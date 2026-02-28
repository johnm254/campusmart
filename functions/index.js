const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Create Express app
const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || '4103d60b75eab57a978e723abdafcf225f2d4dd976096775bbf0277aa3006b4d';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'CAMPUS_ADMIN_2026';

// ═══════════════════════════════════════════════════════════════
//  AUTHENTICATION MIDDLEWARE
// ═══════════════════════════════════════════════════════════════

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userDoc = await db.collection('users').doc(decoded.userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    req.user = { id: decoded.userId, ...userDoc.data() };
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// ═══════════════════════════════════════════════════════════════
//  HEALTH CHECK
// ═══════════════════════════════════════════════════════════════

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'CampusMart API - Firebase Functions',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// ═══════════════════════════════════════════════════════════════
//  AUTH ROUTES
// ═══════════════════════════════════════════════════════════════

// Register
app.post('/auth/register', async (req, res) => {
  try {
    const { email, password, full_name, whatsapp } = req.body;

    // Check if user exists
    const existingUser = await db.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (!existingUser.empty) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userRef = await db.collection('users').add({
      email,
      password: hashedPassword,
      full_name,
      whatsapp: whatsapp || null,
      avatar_url: null,
      is_admin: false,
      is_banned: false,
      is_verified: false,
      verified_until: null,
      boost_type: null,
      last_seen: admin.firestore.FieldValue.serverTimestamp(),
      created_at: admin.firestore.FieldValue.serverTimestamp()
    });

    // Generate token
    const token = jwt.sign({ userId: userRef.id }, JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: userRef.id,
        email,
        full_name,
        whatsapp
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const usersSnapshot = await db.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const userDoc = usersSnapshot.docs[0];
    const user = userDoc.data();

    // Check if banned
    if (user.is_banned) {
      return res.status(403).json({ error: 'Account has been banned' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last seen
    await userDoc.ref.update({
      last_seen: admin.firestore.FieldValue.serverTimestamp()
    });

    // Generate token
    const token = jwt.sign({ userId: userDoc.id }, JWT_SECRET, { expiresIn: '30d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: userDoc.id,
        email: user.email,
        full_name: user.full_name,
        whatsapp: user.whatsapp,
        avatar_url: user.avatar_url,
        is_admin: user.is_admin,
        is_verified: user.is_verified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
app.get('/auth/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// ═══════════════════════════════════════════════════════════════
//  PRODUCTS ROUTES
// ═══════════════════════════════════════════════════════════════

// Get all products
app.get('/products', async (req, res) => {
  try {
    const { category, search, limit = 50 } = req.query;
    
    let query = db.collection('products');

    if (category && category !== 'all') {
      query = query.where('category', '==', category);
    }

    query = query.orderBy('created_at', 'desc').limit(parseInt(limit));

    const snapshot = await query.get();
    const products = [];

    for (const doc of snapshot.docs) {
      const product = { id: doc.id, ...doc.data() };
      
      // Get seller info
      const sellerDoc = await db.collection('users').doc(product.seller_id).get();
      if (sellerDoc.exists) {
        product.seller = {
          id: sellerDoc.id,
          full_name: sellerDoc.data().full_name,
          whatsapp: sellerDoc.data().whatsapp,
          avatar_url: sellerDoc.data().avatar_url
        };
      }

      products.push(product);
    }

    // Filter by search if provided
    let filteredProducts = products;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = products.filter(p => 
        p.title?.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower)
      );
    }

    res.json({ products: filteredProducts });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Create product
app.post('/products', authenticateToken, async (req, res) => {
  try {
    const { title, description, price, category, condition, images } = req.body;

    const productRef = await db.collection('products').add({
      seller_id: req.user.id,
      title,
      description,
      price: parseFloat(price),
      category,
      condition,
      images: images || [],
      status: 'available',
      views: 0,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({
      message: 'Product created successfully',
      product: {
        id: productRef.id,
        ...req.body
      }
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product
app.put('/products/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const productDoc = await db.collection('products').doc(id).get();

    if (!productDoc.exists) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = productDoc.data();
    
    // Check ownership or admin
    if (product.seller_id !== req.user.id && !req.user.is_admin) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await productDoc.ref.update({
      ...req.body,
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
app.delete('/products/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const productDoc = await db.collection('products').doc(id).get();

    if (!productDoc.exists) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = productDoc.data();
    
    // Check ownership or admin
    if (product.seller_id !== req.user.id && !req.user.is_admin) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await productDoc.ref.delete();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// ═══════════════════════════════════════════════════════════════
//  MESSAGES ROUTES
// ═══════════════════════════════════════════════════════════════

// Get conversations
app.get('/messages/conversations', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get messages where user is sender or receiver
    const sentSnapshot = await db.collection('messages')
      .where('sender_id', '==', userId)
      .orderBy('created_at', 'desc')
      .get();

    const receivedSnapshot = await db.collection('messages')
      .where('receiver_id', '==', userId)
      .orderBy('created_at', 'desc')
      .get();

    const conversations = new Map();

    // Process sent messages
    for (const doc of sentSnapshot.docs) {
      const msg = doc.data();
      const otherId = msg.receiver_id;
      if (!conversations.has(otherId)) {
        conversations.set(otherId, { ...msg, id: doc.id });
      }
    }

    // Process received messages
    for (const doc of receivedSnapshot.docs) {
      const msg = doc.data();
      const otherId = msg.sender_id;
      if (!conversations.has(otherId)) {
        conversations.set(otherId, { ...msg, id: doc.id });
      }
    }

    res.json({ conversations: Array.from(conversations.values()) });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Send message
app.post('/messages', authenticateToken, async (req, res) => {
  try {
    const { receiver_id, message, product_id } = req.body;

    const messageRef = await db.collection('messages').add({
      sender_id: req.user.id,
      receiver_id,
      message,
      product_id: product_id || null,
      is_read: false,
      created_at: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({
      message: 'Message sent successfully',
      id: messageRef.id
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// ═══════════════════════════════════════════════════════════════
//  ADMIN ROUTES
// ═══════════════════════════════════════════════════════════════

// Admin login
app.post('/admin/login', async (req, res) => {
  try {
    const { secret } = req.body;

    if (secret !== ADMIN_SECRET) {
      return res.status(401).json({ error: 'Invalid admin secret' });
    }

    res.json({ message: 'Admin authenticated', isAdmin: true });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Admin login failed' });
  }
});

// Get all users (admin only)
app.get('/admin/users', authenticateToken, async (req, res) => {
  try {
    if (!req.user.is_admin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const snapshot = await db.collection('users').get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Export the Express app as a Firebase Function
exports.api = functions.https.onRequest(app);
