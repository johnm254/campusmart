const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Middleware to protect routes
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });

        // Check if user is banned
        try {
            const userCheck = await db.query('SELECT is_banned FROM users WHERE id = $1', [decoded.id]);
            if (userCheck.rows.length > 0 && userCheck.rows[0].is_banned) {
                return res.status(403).json({ message: 'Your account has been suspended.' });
            }
        } catch (e) {
            console.error('Ban check error:', e);
        }

        req.user = decoded;

        // Update last_seen asynchronously
        db.query('UPDATE users SET last_seen = NOW() WHERE id = $1', [decoded.id]).catch(err => console.error('Error updating last_seen:', err));

        next();
    });
};

const verifyAdminToken = (req, res, next) => {
    const adminSecret = req.headers['x-admin-secret'];
    const isSecretValid = adminSecret === 'CAMPUS_ADMIN_2026';

    if (isSecretValid) {
        req.user = { is_admin: true, id: null };
        return next();
    }

    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        if (!decoded.is_admin) return res.status(403).json({ message: 'Admin access required' });

        req.user = decoded;
        next();
    });
};

const logActivity = async (userId, action, metadata = {}) => {
    try {
        await db.query('INSERT INTO activity_logs (user_id, action, metadata) VALUES ($1, $2, $3)', [userId, action, JSON.stringify(metadata)]);
    } catch (err) {
        console.error('Activity Logging Error:', err.message);
    }
};

// Signup Route
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { full_name, email, password, whatsapp, avatar_url } = req.body;

        // Check if user exists
        const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const result = await db.query(
            'INSERT INTO users (full_name, email, password, whatsapp, avatar_url) VALUES ($1, $2, $3, $4, $5) RETURNING id, full_name, email, whatsapp, avatar_url, created_at',
            [full_name, email, hashedPassword, whatsapp, avatar_url]
        );

        const newUser = result.rows[0];

        // Create JWT
        const token = jwt.sign({ id: newUser.id, email: newUser.email, is_admin: newUser.is_admin }, JWT_SECRET, { expiresIn: '24h' });

        logActivity(newUser.id, 'user_signup');

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: newUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during signup' });
    }
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = result.rows[0];

        // Check verification expiry
        if (user.is_verified && user.verified_until && new Date(user.verified_until) < new Date()) {
            await db.query('UPDATE users SET is_verified = FALSE WHERE id = $1', [user.id]);
            user.is_verified = false;
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT
        const token = jwt.sign({ id: user.id, email: user.email, is_admin: user.is_admin, is_verified: user.is_verified }, JWT_SECRET, { expiresIn: '24h' });

        // Remove password from response
        const { password: _, ...userData } = user;

        res.json({ token, user: userData });
        logActivity(user.id, 'login', { ip: req.ip });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// Forgot Password Route
app.post('/api/auth/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists
        const userResult = await db.query('SELECT id, full_name FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            return res.json({ message: 'If an account exists with that email, a reset link has been sent.' });
        }

        const user = userResult.rows[0];

        // Generate token
        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 3600000); // 1 hour

        // Save token
        await db.query(
            'INSERT INTO password_resets (email, token, expires_at) VALUES ($1, $2, $3)',
            [email, token, expires]
        );

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetLink = `${frontendUrl}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

        // Send Email
        const mailOptions = {
            from: `"CampusMart Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Reset Your CampusMart Password',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; borderRadius: '12px'">
                    <h2 style="color: #003366;">CampusMart Password Reset</h2>
                    <p>Hello ${user.full_name},</p>
                    <p>You requested to reset your password. Click the button below to set a new one:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetLink}" style="background-color: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
                    </div>
                    <p>This link will expire in 1 hour.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 0.8rem; color: #888;">© ${new Date().getFullYear()} CampusMart. JKUAT Student Marketplace.</p>
                </div>
            `
        };

        // Send Email asynchronously (don't await) 
        transporter.sendMail(mailOptions).then(() => {
            console.log('Reset email sent to:', email);
        }).catch(mailError => {
            console.error('Nodemailer Error:', mailError.message);
            console.log('Fell back to reset link (background):', resetLink);
        });

        res.json({
            message: 'A reset link is being sent to your email.'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error during forgot password process' });
    }
});

// Reset Password Route
app.post('/api/auth/reset-password', async (req, res) => {
    try {
        const { email, token, newPassword } = req.body;

        // Verify token
        const resetEntry = await db.query(
            'SELECT * FROM password_resets WHERE email = $1 AND token = $2 AND expires_at > NOW()',
            [email, token]
        );

        if (resetEntry.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user password
        await db.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPassword, email]);

        // Delete used token
        await db.query('DELETE FROM password_resets WHERE email = $1', [email]);

        res.json({ message: 'Password has been reset successfully. You can now login.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error resetting password' });
    }
});

// Update Profile Route
app.post('/api/auth/update', verifyToken, async (req, res) => {
    try {
        const { full_name, whatsapp, avatar_url } = req.body;
        const userId = req.user.id;

        await db.query(
            'UPDATE users SET full_name = $1, whatsapp = $2, avatar_url = $3 WHERE id = $4',
            [full_name, whatsapp, avatar_url, userId]
        );

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating profile' });
    }
});

// Products Routes
app.get('/api/products', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT p.id, p.title, p.category, p.price, p.location, p.image_url,
                   p.seller_id, p.condition_text as condition, p.description,
                   p.created_at, p.views,
                   u.full_name as seller_name, u.whatsapp, u.avatar_url as seller_avatar,
                   u.last_seen as seller_last_seen, 
                   u.boost_type,
                   CASE 
                     WHEN u.is_verified = TRUE AND (u.verified_until IS NULL OR u.verified_until >= NOW()) THEN TRUE 
                     ELSE FALSE 
                   END as seller_is_verified
            FROM products p 
            LEFT JOIN users u ON p.seller_id = u.id 
            ORDER BY 
              CASE 
                WHEN u.is_verified = TRUE AND (u.verified_until IS NULL OR u.verified_until >= NOW()) AND u.boost_type = 'power' THEN 2
                WHEN u.is_verified = TRUE AND (u.verified_until IS NULL OR u.verified_until >= NOW()) AND u.boost_type = 'starter' THEN 1
                ELSE 0 
              END DESC, 
              p.created_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching products' });
    }
});

// Fetch products for the authenticated user
app.get('/api/products/me', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await db.query(`
            SELECT p.*, u.full_name as seller_name, u.whatsapp, u.avatar_url as seller_avatar 
            FROM products p 
            LEFT JOIN users u ON p.seller_id = u.id 
            WHERE p.seller_id = $1
            ORDER BY p.created_at DESC
        `, [userId]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching your products' });
    }
});

app.post('/api/products', verifyToken, async (req, res) => {
    try {
        const { title, category, price, location, image_url, images, condition, description } = req.body;
        const seller_id = req.user.id;

        await db.query(
            'INSERT INTO products (title, category, price, location, image_url, images, seller_id, condition_text, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
            [title, category, price, location, image_url, images || null, seller_id, condition || 'second-hand', description || '']
        );
        logActivity(seller_id, 'product_create', { title });
        res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding product' });
    }
});

// Delete a product
app.delete('/api/products/:id', verifyToken, async (req, res) => {
    try {
        const productId = req.params.id;
        const userId = req.user.id;

        // Check ownership
        const product = await db.query('SELECT seller_id FROM products WHERE id = $1', [productId]);

        if (product.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.rows[0].seller_id !== userId) {
            return res.status(403).json({ message: 'You can only delete your own products' });
        }

        await db.query('DELETE FROM products WHERE id = $1', [productId]);
        logActivity(userId, 'product_delete', { productId });
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting product' });
    }
});

// Increment product views
app.post('/api/products/:id/view', async (req, res) => {
    try {
        const productId = req.params.id;
        await db.query('UPDATE products SET views = views + 1 WHERE id = $1', [productId]);
        res.json({ message: 'View recorded' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error recording view' });
    }
});

// Get consolidated stats for the dashboard
app.get('/api/user/stats', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const listingsRes = await db.query('SELECT COUNT(*) as count FROM products WHERE seller_id = $1', [userId]);
        const viewsRes = await db.query('SELECT SUM(views) as count FROM products WHERE seller_id = $1', [userId]);
        const wishlistRes = await db.query('SELECT COUNT(*) as count FROM wishlist WHERE user_id = $1', [userId]);
        const messagesRes = await db.query(`
            SELECT COUNT(DISTINCT CASE WHEN sender_id = $1 THEN receiver_id ELSE sender_id END) as count 
            FROM messages 
            WHERE sender_id = $1 OR receiver_id = $1
        `, [userId]);

        const ratingRes = await db.query(`
            SELECT COALESCE(AVG(rating), 0) as average_rating, COUNT(*) as review_count
            FROM user_reviews
            WHERE reviewee_id = $1
        `, [userId]);

        res.json({
            active_listings: parseInt(listingsRes.rows[0].count) || 0,
            total_views: parseInt(viewsRes.rows[0].count) || 0,
            saved_items: parseInt(wishlistRes.rows[0].count) || 0,
            total_messages: parseInt(messagesRes.rows[0].count) || 0,
            average_rating: parseFloat(ratingRes.rows[0].average_rating) || 0,
            review_count: parseInt(ratingRes.rows[0].review_count) || 0
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ message: 'Error fetching stats' });
    }
});

// ─── User Reviews Routes ──────────────────────────────────────────────────

// Get user average rating and count
app.get('/api/user/:userId/rating', async (req, res) => {
    try {
        const userId = req.params.userId;
        const result = await db.query(`
            SELECT COALESCE(AVG(rating), 0) as average_rating, COUNT(*) as review_count
            FROM user_reviews
            WHERE reviewee_id = $1
        `, [userId]);

        res.json({
            average_rating: parseFloat(result.rows[0].average_rating) || 0,
            review_count: parseInt(result.rows[0].review_count) || 0
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching user rating' });
    }
});

// Get reviews for a specific user
app.get('/api/reviews/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const result = await db.query(`
            SELECT r.*, u.full_name as reviewer_name, u.avatar_url as reviewer_avatar
            FROM user_reviews r
            JOIN users u ON r.reviewer_id = u.id
            WHERE r.reviewee_id = $1 OR r.parent_id IN (
                SELECT id FROM user_reviews WHERE reviewee_id = $1
            )
            ORDER BY r.created_at DESC
        `, [userId]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching reviews' });
    }
});

// Post a new review
app.post('/api/reviews', verifyToken, async (req, res) => {
    try {
        const reviewerId = req.user.id;
        let { reviewee_id, rating, comment, parent_id } = req.body;
        console.log('Review Payload:', { reviewee_id, rating, comment, parent_id, reviewerId });

        reviewee_id = parseInt(reviewee_id);
        rating = (rating !== null && rating !== undefined) ? parseInt(rating) : null;
        const parentId = (parent_id !== null && parent_id !== undefined) ? parseInt(parent_id) : null;

        if (!reviewee_id) {
            return res.status(400).json({ message: 'Invalid target user ID' });
        }

        // Require rating for all submissions (reviews or comments/replies)
        if (!rating || isNaN(rating) || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'A star rating (1-5) is required.' });
        }

        if (reviewerId === reviewee_id) {
            return res.status(400).json({ message: 'You cannot rate yourself' });
        }

        if (parentId === null) {
            // Check if already reviewed (only for top-level reviews)
            const existing = await db.query(
                'SELECT id FROM user_reviews WHERE reviewer_id = $1 AND reviewee_id = $2 AND parent_id IS NULL',
                [reviewerId, reviewee_id]
            );

            if (existing.rows.length > 0) {
                // Update
                await db.query(
                    'UPDATE user_reviews SET rating = $1, comment = $2, created_at = NOW() WHERE id = $3',
                    [rating, comment || '', existing.rows[0].id]
                );
                return res.json({ message: 'Review updated successfully' });
            }
        }

        // Insert new (reply or first-time review)
        await db.query(
            'INSERT INTO user_reviews (reviewer_id, reviewee_id, rating, comment, parent_id) VALUES ($1, $2, $3, $4, $5)',
            [reviewerId, reviewee_id, rating, comment || '', parentId]
        );
        res.status(201).json({ message: parentId ? 'Comment posted successfully' : 'Review submitted successfully' });
    } catch (error) {
        console.error('Submit review error:', error);
        res.status(500).json({ message: 'Error submitting review: ' + error.message });
    }
});

// ─── Messages Routes ────────────────────────────────────────────────────────

// Send a message
app.post('/api/messages', verifyToken, async (req, res) => {
    try {
        const { receiver_id, content, product_id } = req.body;
        const sender_id = req.user.id;

        if (!receiver_id || !content) {
            return res.status(400).json({ message: 'receiver_id and content are required' });
        }

        // Prevent self-messaging
        if (parseInt(receiver_id) === sender_id) {
            return res.status(400).json({ message: 'You cannot send a message to yourself.' });
        }

        // Check if receiver is "online" (active within last 1 minute)
        const userStatus = await db.query('SELECT last_seen FROM users WHERE id = $1', [receiver_id]);
        let isDelivered = false;
        if (userStatus.rows.length > 0) {
            const lastSeen = new Date(userStatus.rows[0].last_seen);
            const now = new Date();
            if ((now - lastSeen) < 60000) { // 1 minute
                isDelivered = true;
            }
        }

        const result = await db.query(
            `INSERT INTO messages (sender_id, receiver_id, content, product_id, is_delivered)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [sender_id, parseInt(receiver_id), content, product_id || null, isDelivered]
        );

        logActivity(sender_id, 'message_send', { receiverId: parseInt(receiver_id), productId: product_id || null });

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Send message error:', error.message);
        res.status(500).json({ message: 'Error sending message: ' + error.message });
    }
});

// Feedback endpoint - sends a message to all admins
app.post('/api/user-feedback', verifyToken, async (req, res) => {
    console.log('Feedback attempt by user:', req.user.id);
    try {
        const { content } = req.body;
        const userId = req.user.id;

        if (!content || content.trim().length === 0) {
            return res.status(400).json({ message: 'Feedback content is required' });
        }

        if (content.length > 2000) {
            return res.status(400).json({ message: 'Feedback is too long (max 2000 characters)' });
        }

        // Find all administrators
        const admins = await db.query('SELECT id FROM users WHERE is_admin = TRUE');

        console.log('Admins found:', admins.rows.length);

        if (admins.rows.length === 0) {
            return res.status(404).json({ message: 'Feedback Error: No administrators are registered in the system.' });
        }

        const user = await db.query('SELECT full_name, email FROM users WHERE id = $1', [userId]);
        const userName = user.rows[0]?.full_name || 'A user';
        const userEmail = user.rows[0]?.email || '';

        const feedbackMessage = `📢 OFFICIAL FEEDBACK\n━━━━━━━━━━━━━━━\n👤 From: ${userName} (${userEmail})\n\n${content}\n\n━━━━━━━━━━━━━━━\nSent via Feedback Center`;

        // Send message to each admin
        const promises = admins.rows.map(admin => {
            return db.query(
                `INSERT INTO messages (sender_id, receiver_id, content, is_read, is_delivered)
                 VALUES ($1, $2, $3, false, false)`,
                [userId, admin.id, feedbackMessage]
            );
        });

        await Promise.all(promises);
        console.log('Feedback saved to database');

        logActivity(userId, 'feedback_submitted', { length: content.length });

        res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (error) {
        console.error('Feedback error:', error);
        res.status(500).json({ message: 'Error submitting feedback: ' + error.message });
    }
});

// Get all conversations for the logged-in user
app.get('/api/messages/conversations', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;

        // Mark incoming messages as delivered
        await db.query('UPDATE messages SET is_delivered = true WHERE receiver_id = $1 AND is_delivered = false', [userId]);

        const result = await db.query(`
            SELECT DISTINCT ON (other_user_id)
                m.id,
                m.content as last_message,
                m.created_at,
                m.is_read,
                m.sender_id,
                CASE WHEN m.sender_id = $1 THEN m.receiver_id ELSE m.sender_id END as other_user_id,
                u.full_name as other_user_name,
                u.avatar_url as other_user_avatar,
                u.last_seen as other_user_last_seen,
                (
                    SELECT COUNT(*) FROM messages sub
                    WHERE sub.receiver_id = $1
                      AND sub.sender_id = CASE WHEN m.sender_id = $1 THEN m.receiver_id ELSE m.sender_id END
                      AND sub.is_read = false
                ) as unread_count
            FROM messages m
            JOIN users u ON u.id = CASE WHEN m.sender_id = $1 THEN m.receiver_id ELSE m.sender_id END
            WHERE m.sender_id = $1 OR m.receiver_id = $1
            ORDER BY other_user_id, m.created_at DESC
        `, [userId]);

        res.json(result.rows);
    } catch (error) {
        console.error('Conversations error:', error.message);
        res.status(500).json({ message: 'Error fetching conversations' });
    }
});


// Get messages between two users
app.get('/api/messages/:otherUserId', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const otherUserId = parseInt(req.params.otherUserId);

        // Mark messages as read and delivered
        await db.query(
            `UPDATE messages SET is_read = true, is_delivered = true 
             WHERE sender_id = $1 AND receiver_id = $2 AND (is_read = false OR is_delivered = false)`,
            [otherUserId, userId]
        );

        const result = await db.query(`
            SELECT m.*, 
                   s.full_name as sender_name, s.avatar_url as sender_avatar,
                   r.full_name as receiver_name
            FROM messages m
            JOIN users s ON m.sender_id = s.id
            JOIN users r ON m.receiver_id = r.id
            WHERE (m.sender_id = $1 AND m.receiver_id = $2)
               OR (m.sender_id = $2 AND m.receiver_id = $1)
            ORDER BY m.created_at ASC
        `, [userId, otherUserId]);

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching messages' });
    }
});

// Get unread message count
app.get('/api/messages/unread/count', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await db.query(
            `SELECT COUNT(*) as count FROM messages WHERE receiver_id = $1 AND is_read = false`,
            [userId]
        );
        res.json({ count: parseInt(result.rows[0].count) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching unread count' });
    }
});

// ─── Wishlist Routes ────────────────────────────────────────────────────────

// Get user's wishlist
app.get('/api/wishlist', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await db.query(`
            SELECT p.*, u.full_name as seller_name, u.whatsapp, u.avatar_url as seller_avatar 
            FROM wishlist w
            JOIN products p ON w.product_id = p.id
            LEFT JOIN users u ON p.seller_id = u.id
            WHERE w.user_id = $1
            ORDER BY w.created_at DESC
        `, [userId]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching wishlist' });
    }
});

// Toggle wishlist item (Add if not exists, remove if exists)
app.post('/api/wishlist/:productId', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = parseInt(req.params.productId);

        // Check if already in wishlist
        const existing = await db.query('SELECT id FROM wishlist WHERE user_id = $1 AND product_id = $2', [userId, productId]);

        if (existing.rows.length > 0) {
            // Remove
            await db.query('DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2', [userId, productId]);
            res.json({ message: 'Removed from wishlist', action: 'removed' });
        } else {
            // Add
            await db.query('INSERT INTO wishlist (user_id, product_id) VALUES ($1, $2)', [userId, productId]);
            res.status(201).json({ message: 'Added to wishlist', action: 'added' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error toggling wishlist' });
    }
});

// ─── Community Routes ────────────────────────────────────────────────────────

// Get all community posts
app.get('/api/community/posts', async (req, res) => {
    try {
        const userId = req.headers['authorization'] ? jwt.decode(req.headers['authorization'].split(' ')[1])?.id : null;

        const result = await db.query(`
            SELECT cp.*, u.full_name as author_name, u.avatar_url as author_avatar, u.is_admin,
                   CASE 
                     WHEN u.is_verified = TRUE AND (u.verified_until IS NULL OR u.verified_until >= NOW()) THEN TRUE 
                     ELSE FALSE 
                   END as is_verified,
                   (SELECT COALESCE(AVG(rating), 0) FROM user_reviews WHERE reviewee_id = cp.author_id) as author_rating,
                   (SELECT COUNT(*) FROM user_reviews WHERE reviewee_id = cp.author_id) as author_review_count,
                   (SELECT COUNT(*) FROM post_likes WHERE post_id = cp.id) as likes,
                   (SELECT COUNT(*) FROM post_comments WHERE post_id = cp.id) as comments,
                   CASE WHEN $1::integer IS NOT NULL AND EXISTS(SELECT 1 FROM post_likes WHERE post_id = cp.id AND user_id = $1) THEN true ELSE false END as is_liked
            FROM community_posts cp
            LEFT JOIN users u ON cp.author_id = u.id
            ORDER BY u.is_admin DESC, cp.created_at DESC
        `, [userId]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching community posts' });
    }
});

// Create a community post
app.post('/api/community/posts', verifyToken, async (req, res) => {
    try {
        const { content, type, image_url } = req.body;
        const author_id = req.user.id;
        const is_admin = req.user.is_admin;

        // Fetch current user status from DB to ensure verification hasn't expired
        const userStatus = await db.query('SELECT is_verified, verified_until FROM users WHERE id = $1', [author_id]);
        const is_verified = userStatus.rows[0]?.is_verified && (userStatus.rows[0]?.verified_until === null || new Date(userStatus.rows[0]?.verified_until) >= new Date());

        // Restriction: Only admins and verified users can post events and announcements
        if ((type === 'announcement' || type === 'events') && !is_admin && !is_verified) {
            return res.status(403).json({ message: 'Premium verification is required to create events and announcements.' });
        }

        const result = await db.query(
            'INSERT INTO community_posts (author_id, content, type, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
            [author_id, content, type || 'general', image_url || null]
        );
        logActivity(author_id, 'community_post_create', { postId: result.rows[0].id, type: type || 'general' });
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating community post' });
    }
});

// Toggle post like
app.post('/api/community/posts/:id/like', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const postId = parseInt(req.params.id);

        const existing = await db.query('SELECT id FROM post_likes WHERE user_id = $1 AND post_id = $2', [userId, postId]);

        if (existing.rows.length > 0) {
            await db.query('DELETE FROM post_likes WHERE user_id = $1 AND post_id = $2', [userId, postId]);
            res.json({ message: 'Like removed', action: 'unliked' });
        } else {
            await db.query('INSERT INTO post_likes (user_id, post_id) VALUES ($1, $2)', [userId, postId]);
            res.status(201).json({ message: 'Post liked', action: 'liked' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error toggling like' });
    }
});

// Get post comments
app.get('/api/community/posts/:id/comments', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT pc.*, u.full_name as author_name, u.avatar_url as author_avatar, u.is_verified
            FROM post_comments pc
            LEFT JOIN users u ON pc.user_id = u.id
            WHERE pc.post_id = $1
            ORDER BY pc.created_at ASC
        `, [req.params.id]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching comments' });
    }
});

// Add a comment - also sends a message to the post author's inbox
app.post('/api/community/posts/:id/comments', verifyToken, async (req, res) => {
    try {
        const { content } = req.body;
        const userId = req.user.id;
        const postId = req.params.id;

        const result = await db.query(
            'INSERT INTO post_comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING *',
            [postId, userId, content]
        );

        // Send a real message to the post author's inbox
        const postAuthor = await db.query('SELECT author_id, content as post_content FROM community_posts WHERE id = $1', [postId]);
        if (postAuthor.rows.length > 0 && postAuthor.rows[0].author_id !== userId) {
            const authorId = postAuthor.rows[0].author_id;
            const postPreview = postAuthor.rows[0].post_content.substring(0, 40);
            const commenterName = await db.query('SELECT full_name FROM users WHERE id = $1', [userId]);
            const name = commenterName.rows[0]?.full_name || 'Someone';

            // Insert a message into the messages table
            await db.query(
                `INSERT INTO messages (sender_id, receiver_id, content, is_read, is_delivered)
                 VALUES ($1, $2, $3, false, false)`,
                [userId, authorId, `💬 Commented on your post "${postPreview}...":\n\n"${content}"`]
            );

            logActivity(authorId, 'new_comment_on_post', {
                postId,
                commentAuthorId: userId,
                preview: content.substring(0, 50)
            });
        }

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding comment' });
    }
});

// Delete own post
app.delete('/api/community/posts/:id', verifyToken, async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;

        const check = await db.query('SELECT author_id FROM community_posts WHERE id = $1', [postId]);
        if (check.rows.length === 0) return res.status(404).json({ message: 'Post not found' });

        if (parseInt(check.rows[0].author_id) !== parseInt(userId) && !req.user.is_admin) {
            return res.status(403).json({ message: 'Unauthorized to delete this post' });
        }

        // Delete associated comments and likes first
        await db.query('DELETE FROM post_comments WHERE post_id = $1', [postId]);
        await db.query('DELETE FROM post_likes WHERE post_id = $1', [postId]);
        await db.query('DELETE FROM community_posts WHERE id = $1', [postId]);
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Delete post error:', error);
        res.status(500).json({ message: 'Error deleting post' });
    }
});

// Activate Verification (Boost Packages)
app.post('/api/user/verify', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { plan } = req.body;

        const boostUntil = new Date();
        let amount = 0;
        let boostType = null;

        if (plan === 'starter') {
            boostUntil.setDate(boostUntil.getDate() + 14);
            amount = 149;
            boostType = 'starter';
        } else if (plan === 'power') {
            boostUntil.setDate(boostUntil.getDate() + 28);
            amount = 220;
            boostType = 'power';
        } else {
            return res.status(400).json({ message: 'Invalid boost plan' });
        }

        await db.query(`
            UPDATE users 
            SET is_verified = TRUE, boost_type = $1, verified_until = $2 
            WHERE id = $3
        `, [boostType, boostUntil, userId]);

        // Fetch updated user
        const result = await db.query('SELECT id, full_name, email, whatsapp, avatar_url, is_verified, boost_type, verified_until, is_admin FROM users WHERE id = $1', [userId]);

        // Record Transaction
        await db.query('INSERT INTO transactions (user_id, amount, type, status) VALUES ($1, $2, $3, $4)', [userId, amount, `${boostType}_boost`, 'completed']);
        logActivity(userId, 'boost_purchase', { plan, amount });

        res.json({
            message: `Account successfully boosted with ${plan}!`,
            user: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error during boost process' });
    }
});

// ─── Review Routes ──────────────────────────────────────────────────────────

// Submit a review for a user (trader or buyer)
app.post('/api/reviews', verifyToken, async (req, res) => {
    try {
        const { reviewee_id, rating, comment } = req.body;
        const reviewer_id = req.user.id;

        if (!reviewee_id || !rating) {
            return res.status(400).json({ message: 'Reviewee ID and rating are required' });
        }

        if (parseInt(reviewee_id) === reviewer_id) {
            return res.status(400).json({ message: 'You cannot review yourself' });
        }

        // Upsert review
        await db.query(`
            INSERT INTO user_reviews (reviewer_id, reviewee_id, rating, comment)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (reviewer_id, reviewee_id) 
            DO UPDATE SET rating = $3, comment = $4, created_at = NOW()
        `, [reviewer_id, reviewee_id, rating, comment]);

        logActivity(reviewer_id, 'user_review_submit', { targetUserId: reviewee_id, rating });
        res.json({ message: 'Review submitted successfully' });
    } catch (error) {
        console.error('Review error:', error);
        res.status(500).json({ message: 'Error submitting review' });
    }
});

// Get reviews for a user
app.get('/api/reviews/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await db.query(`
            SELECT r.*, u.full_name as reviewer_name, u.avatar_url as reviewer_avatar
            FROM user_reviews r
            JOIN users u ON r.reviewer_id = u.id
            WHERE r.reviewee_id = $1
            ORDER BY r.created_at DESC
        `, [userId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Fetch reviews error:', error);
        res.status(500).json({ message: 'Error fetching reviews' });
    }
});

// Get user's average rating
app.get('/api/user/:userId/rating', async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await db.query(`
            SELECT 
                COALESCE(AVG(rating), 0) as average_rating,
                COUNT(*) as review_count
            FROM user_reviews
            WHERE reviewee_id = $1
        `, [userId]);
        res.json({
            average_rating: parseFloat(result.rows[0].average_rating),
            review_count: parseInt(result.rows[0].review_count)
        });
    } catch (error) {
        console.error('Average rating error:', error);
        res.status(500).json({ message: 'Error fetching rating stats' });
    }
});

// ─── M-Pesa Routes ────────────────────────────────────────────────────────
const mpesaController = require('./mpesa');

// Route: POST /api/mpesa/stkpush
// Flow: verifyToken → getAccessToken (fetches Safaricom token) → stkPush
app.post('/api/mpesa/stkpush', verifyToken, mpesaController.getAccessToken, mpesaController.stkPush);

// Route: GET /api/mpesa/status — Check if M-Pesa credentials are valid (no auth needed)
app.get('/api/mpesa/status', async (req, res) => {
    const consumer_key = process.env.MPESA_CONSUMER_KEY;
    const consumer_secret = process.env.MPESA_CONSUMER_SECRET;
    if (!consumer_key || !consumer_secret) {
        return res.json({ status: 'missing', message: 'M-Pesa credentials not set in .env' });
    }
    const axios = require('axios');
    const creds = Buffer.from(`${consumer_key}:${consumer_secret}`).toString('base64');
    try {
        const r = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
            headers: { 'Authorization': `Basic ${creds}` }, timeout: 10000
        });
        if (r.data && r.data.access_token) {
            return res.json({ status: 'ok', message: 'M-Pesa credentials are valid ✅' });
        }
        return res.json({ status: 'unknown', message: 'Unexpected response from Safaricom', data: r.data });
    } catch (e) {
        const httpStatus = e.response?.status;
        if (httpStatus === 400 || httpStatus === 401) {
            return res.json({
                status: 'invalid',
                message: `Credentials rejected by Safaricom (HTTP ${httpStatus}). They may have expired.`,
                hint: 'Go to https://developer.safaricom.co.ke → My Apps → regenerate credentials and update server/.env'
            });
        }
        return res.json({ status: 'error', message: e.message, code: e.code });
    }
});

// Route: GET /api/mpesa/query/:checkoutRequestId
app.get('/api/mpesa/query/:checkoutRequestId', verifyToken, mpesaController.queryStatus);

// Callback URL - This needs to be public for Safaricom to hit it
app.post('/api/mpesa/callback', async (req, res) => {
    try {
        console.log('M-Pesa Callback Received:', JSON.stringify(req.body, null, 2));

        const callbackData = req.body.Body.stkCallback;
        const checkoutRequestID = callbackData.CheckoutRequestID;
        const resultCode = callbackData.ResultCode;

        if (resultCode === 0) {
            // Payment SUCCESS
            const result = await db.query('SELECT * FROM transactions WHERE checkout_request_id = $1', [checkoutRequestID]);

            if (result.rows.length > 0) {
                const transaction = result.rows[0];
                const { user_id, plan } = transaction;

                // 1. Update transaction status
                await db.query('UPDATE transactions SET status = $1 WHERE checkout_request_id = $2', ['completed', checkoutRequestID]);

                // 2. Activate Boost for user
                const boostUntil = new Date();
                let boostType = plan;
                if (plan === 'starter') boostUntil.setDate(boostUntil.getDate() + 14);
                else if (plan === 'power') boostUntil.setDate(boostUntil.getDate() + 28);

                await db.query(`
                    UPDATE users 
                    SET is_verified = TRUE, boost_type = $1, verified_until = $2 
                    WHERE id = $3
                `, [boostType, boostUntil, user_id]);

                logActivity(user_id, 'boost_purchase_auto', { plan, checkoutRequestID });
                console.log(`✅ Boost ${plan} auto-activated for user ${user_id}`);
            }
        } else {
            // Payment FAILED
            await db.query('UPDATE transactions SET status = $1 WHERE checkout_request_id = $2', ['failed', checkoutRequestID]);
            console.log(`❌ Payment failed for ID: ${checkoutRequestID}`);
        }

        res.json({ result: "success" });
    } catch (error) {
        console.error('Callback error:', error);
        res.status(500).json({ message: 'Error processing callback' });
    }
});

// DEV ONLY: Route to manually simulate a successful callback
app.post('/api/mpesa/simulate-success', async (req, res) => {
    const { checkoutRequestId } = req.body;
    try {
        // Trigger the callback logic internally or just update DB
        const result = await db.query('SELECT * FROM transactions WHERE checkout_request_id = $1', [checkoutRequestId]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Transaction not found' });

        const transaction = result.rows[0];
        const { user_id, plan } = transaction;

        await db.query('UPDATE transactions SET status = $1 WHERE checkout_request_id = $2', ['completed', checkoutRequestId]);

        const boostUntil = new Date();
        if (plan === 'starter') boostUntil.setDate(boostUntil.getDate() + 14);
        else if (plan === 'power') boostUntil.setDate(boostUntil.getDate() + 28);

        await db.query(`
            UPDATE users SET is_verified = TRUE, boost_type = $1, verified_until = $2 WHERE id = $3
        `, [plan, boostUntil, user_id]);

        res.json({ message: 'Simulation success! Account boosted.' });
    } catch (error) {
        res.status(500).json({ message: 'Simulation failed' });
    }
});

// ─── Admin Dashboard Routes ───────────────────────────────────────────────

app.get('/api/admin/stats', verifyAdminToken, async (req, res) => {
    try {
        const usersCount = await db.query('SELECT COUNT(*) FROM users');
        const productsCount = await db.query('SELECT COUNT(*) FROM products');
        const revenueTotal = await db.query(`
            SELECT SUM(t.amount) as sum 
            FROM transactions t
            WHERE t.status = $1
        `, ['completed']);
        const pendingApprovals = await db.query('SELECT COUNT(*) FROM products WHERE is_approved = FALSE');

        // New active stats
        const usersToday = await db.query('SELECT COUNT(*) FROM users WHERE created_at >= CURRENT_DATE');
        const productsToday = await db.query('SELECT COUNT(*) FROM products WHERE created_at >= CURRENT_DATE');

        const recentUsers = await db.query('SELECT full_name, email, created_at FROM users ORDER BY created_at DESC LIMIT 5');
        const recentTransactions = await db.query(`
            SELECT t.*, u.full_name 
            FROM transactions t 
            LEFT JOIN users u ON t.user_id = u.id 
            WHERE t.status = 'completed'
            ORDER BY t.created_at DESC LIMIT 5
        `);

        res.json({
            overview: {
                total_users: parseInt(usersCount.rows[0].count),
                total_products: parseInt(productsCount.rows[0].count),
                total_revenue: parseFloat(revenueTotal.rows[0].sum || 0),
                pending_approvals: parseInt(pendingApprovals.rows[0].count),
                users_today: parseInt(usersToday.rows[0].count),
                products_today: parseInt(productsToday.rows[0].count)
            },
            recent_users: recentUsers.rows,
            recent_transactions: recentTransactions.rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching admin stats' });
    }
});

app.get('/api/admin/transactions', verifyAdminToken, async (req, res) => {
    try {
        const result = await db.query(`
            SELECT t.*, u.full_name, u.email 
            FROM transactions t 
            LEFT JOIN users u ON t.user_id = u.id 
            WHERE t.status = 'completed'
            ORDER BY t.created_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching transactions' });
    }
});

app.get('/api/admin/users', verifyAdminToken, async (req, res) => {
    try {
        const result = await db.query(`
            SELECT id, full_name, email, whatsapp, is_admin, is_banned, created_at, last_seen,
                   CASE 
                     WHEN is_verified = TRUE AND (verified_until IS NULL OR verified_until >= NOW()) THEN TRUE 
                     ELSE FALSE 
                   END as is_verified,
                   verified_until
            FROM users 
            ORDER BY created_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

app.get('/api/admin/products', verifyAdminToken, async (req, res) => {
    try {
        const result = await db.query(`
            SELECT p.*, u.full_name as seller_name, u.email as seller_email 
            FROM products p 
            JOIN users u ON p.seller_id = u.id 
            ORDER BY p.created_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching admin products' });
    }
});

app.post('/api/admin/products/:id/toggle-approval', verifyAdminToken, async (req, res) => {
    try {
        const { id } = req.params;
        const current = await db.query('SELECT is_approved FROM products WHERE id = $1', [id]);
        if (current.rows.length === 0) return res.status(404).json({ message: 'Product not found' });

        const newValue = !current.rows[0].is_approved;
        await db.query('UPDATE products SET is_approved = $1 WHERE id = $2', [newValue, id]);

        logActivity(req.user.id, newValue ? 'admin_approve_product' : 'admin_deactivate_product', { targetProductId: id });
        res.json({ message: `Product ${newValue ? 'authorized' : 'deactivated'}`, is_approved: newValue });
    } catch (error) {
        res.status(500).json({ message: 'Error toggling product status' });
    }
});

app.get('/api/admin/logs', verifyAdminToken, async (req, res) => {
    try {
        const result = await db.query(`
            SELECT l.*, u.full_name 
            FROM activity_logs l 
            LEFT JOIN users u ON l.user_id = u.id 
            ORDER BY l.created_at DESC LIMIT 100
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching logs' });
    }
});

// Settings management
app.get('/api/settings', async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM site_settings WHERE key IN ('site_name', 'maintenance_mode', 'announcement')");
        const settings = {};
        result.rows.forEach(row => settings[row.key] = row.value);
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching settings' });
    }
});

app.get('/api/admin/settings', verifyAdminToken, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM site_settings');
        const settings = {};
        result.rows.forEach(row => settings[row.key] = row.value);
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching settings' });
    }
});

app.post('/api/admin/settings', verifyAdminToken, async (req, res) => {
    try {
        const settings = req.body;
        for (const [key, value] of Object.entries(settings)) {
            await db.query(`
                INSERT INTO site_settings (key, value, updated_at)
                VALUES ($1, $2, NOW())
                ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()
            `, [key, value]);
        }
        logActivity(req.user.id, 'admin_settings_update', settings);
        res.json({ message: 'Settings updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating settings' });
    }
});

// User actions: Ban, Role update
app.post('/api/admin/users/:id/ban', verifyAdminToken, async (req, res) => {
    try {
        const { id } = req.params;
        const current = await db.query('SELECT is_banned FROM users WHERE id = $1', [id]);
        if (current.rows.length === 0) return res.status(404).json({ message: 'User not found' });

        const newValue = !current.rows[0].is_banned;
        await db.query('UPDATE users SET is_banned = $1 WHERE id = $2', [newValue, id]);

        logActivity(req.user.id, newValue ? 'admin_ban_user' : 'admin_unban_user', { targetUserId: id });
        res.json({ message: `User ${newValue ? 'banned' : 'unbanned'}`, is_banned: newValue });
    } catch (error) {
        res.status(500).json({ message: 'Error banning user' });
    }
});

app.post('/api/admin/users/:id/update-role', verifyAdminToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { is_admin } = req.body;
        await db.query('UPDATE users SET is_admin = $1 WHERE id = $2', [is_admin, id]);

        logActivity(req.user.id, 'admin_role_update', { targetUserId: id, is_admin });
        res.json({ message: `User role updated to ${is_admin ? 'Admin' : 'User'}` });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user role' });
    }
});

app.post('/api/admin/users/:id/verify', verifyAdminToken, async (req, res) => {
    try {
        const { id } = req.params;
        const current = await db.query('SELECT is_verified FROM users WHERE id = $1', [id]);
        if (current.rows.length === 0) return res.status(404).json({ message: 'User not found' });

        const newValue = !current.rows[0].is_verified;
        const verifiedUntil = newValue ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null;

        await db.query('UPDATE users SET is_verified = $1, verified_until = $2 WHERE id = $3', [newValue, verifiedUntil, id]);

        logActivity(req.user.id, newValue ? 'admin_verify_user' : 'admin_unverify_user', { targetUserId: id });
        res.json({ message: `User ${newValue ? 'verified' : 'unverified'}`, is_verified: newValue });
    } catch (error) {
        res.status(500).json({ message: 'Error toggling verification' });
    }
});

// Community posts management
app.get('/api/admin/community/posts', verifyAdminToken, async (req, res) => {
    try {
        const result = await db.query(`
            SELECT cp.*, u.full_name as author_name, u.avatar_url as author_avatar, u.is_admin,
                   CASE 
                     WHEN u.is_verified = TRUE AND (u.verified_until IS NULL OR u.verified_until >= NOW()) THEN TRUE 
                     ELSE FALSE 
                   END as is_verified,
                   (SELECT COUNT(*) FROM post_likes WHERE post_id = cp.id) as likes,
                   (SELECT COUNT(*) FROM post_comments WHERE post_id = cp.id) as comments
            FROM community_posts cp 
            LEFT JOIN users u ON cp.author_id = u.id 
            ORDER BY cp.created_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching community posts' });
    }
});

app.post('/api/admin/community/posts/:id/delete', verifyAdminToken, async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM community_posts WHERE id = $1', [id]);
        logActivity(req.user.id, 'admin_delete_post', { postId: id });
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting post' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    // Test M-Pesa credentials on startup so you know immediately if they're expired
    // mpesaController.testCredentials();
});
