const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
    baseUrl: API_URL,
    async handleResponse(res) {
        const contentType = res.headers.get('content-type');
        let data;
        if (contentType && contentType.includes('application/json')) {
            data = await res.json();
        } else {
            const text = await res.text();
            data = { error: true, message: `Server error: ${res.status}`, detail: text };
        }

        // Auto-clear session on token errors (expired or invalid JWT)
        if ((res.status === 401 || res.status === 403) &&
            data?.message && (data.message.toLowerCase().includes('invalid token') || data.message.toLowerCase().includes('no token'))) {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            // Dispatch event so AppContext can react
            window.dispatchEvent(new CustomEvent('session-expired'));
        }

        // Throw on non-OK responses so catch blocks in callers work correctly
        if (!res.ok) {
            const err = new Error(data?.message || `Request failed with status ${res.status}`);
            err.status = res.status;
            err.data = data;
            throw err;
        }

        return data;
    },

    async signup(data) {
        const res = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return this.handleResponse(res);
    },

    async login(email, password) {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return this.handleResponse(res);
    },

    async getProducts() {
        const res = await fetch(`${API_URL}/products`);
        return this.handleResponse(res);
    },

    async getMyProducts() {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/products/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return this.handleResponse(res);
    },

    async addProduct(data) {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        return this.handleResponse(res);
    },

    async deleteProduct(productId) {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/products/${productId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return this.handleResponse(res);
    },

    async markProductAsSold(productId) {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/products/${productId}/sold`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return this.handleResponse(res);
    },

    async updateUser(data) {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/auth/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        return this.handleResponse(res);
    },

    async sendMessage(receiver_id, content, product_id = null) {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ receiver_id, content, product_id })
        });
        return this.handleResponse(res);
    },

    async getConversations() {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/messages/conversations`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return this.handleResponse(res);
    },

    async getMessages(otherUserId) {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/messages/${otherUserId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return this.handleResponse(res);
    },

    async getUnreadCount() {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/messages/unread/count`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return this.handleResponse(res);
    },

    async getWishlist() {
        const token = localStorage.getItem('token');
        if (!token) return [];
        const res = await fetch(`${API_URL}/wishlist`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return this.handleResponse(res);
    },

    async toggleWishlist(productId) {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/wishlist/${productId}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return this.handleResponse(res);
    },

    async forgotPassword(email) {
        const res = await fetch(`${API_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        return this.handleResponse(res);
    },

    async resetPassword(data) {
        const res = await fetch(`${API_URL}/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return this.handleResponse(res);
    },

    async getStats() {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/user/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return this.handleResponse(res);
    },

    async recordProductView(productId) {
        const res = await fetch(`${API_URL}/products/${productId}/view`, {
            method: 'POST'
        });
        return this.handleResponse(res);
    },

    async getCommunityPosts() {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/community/posts`, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        return this.handleResponse(res);
    },

    async createCommunityPost(data) {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/community/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        return this.handleResponse(res);
    },

    async togglePostLike(postId) {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/community/posts/${postId}/like`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return this.handleResponse(res);
    },

    async getPostComments(postId) {
        const res = await fetch(`${API_URL}/community/posts/${postId}/comments`);
        return this.handleResponse(res);
    },

    async addPostComment(postId, content) {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/community/posts/${postId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ content })
        });
        return this.handleResponse(res);
    },

    async deleteCommunityPost(postId) {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/community/posts/${postId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return this.handleResponse(res);
    },

    async activateVerification() {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/user/verify`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return this.handleResponse(res);
    },

    async initiateMpesaPayment(data) {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/mpesa/stkpush`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        return this.handleResponse(res);
    },

    async checkMpesaStatus(checkoutRequestId) {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/mpesa/query/${checkoutRequestId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return this.handleResponse(res);
    },

    async simulateMpesaSuccess(checkoutRequestId) {
        const res = await fetch(`${API_URL}/mpesa/simulate-success`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ checkoutRequestId })
        });
        return this.handleResponse(res);
    },

    async sendFeedback(content) {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/user-feedback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ content })
        });
        return this.handleResponse(res);
    },

    // Admin Methods
    getAdminHeaders() {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };
        if (sessionStorage.getItem('admin_access_unlocked') === 'true') {
            headers['X-Admin-Secret'] = sessionStorage.getItem('admin_secret_key') || import.meta.env.VITE_ADMIN_SECRET || 'CAMPUS_ADMIN_2026';
        }
        return headers;
    },

    async getAdminStats() {
        const res = await fetch(`${API_URL}/admin/stats`, {
            headers: this.getAdminHeaders()
        });
        return this.handleResponse(res);
    },

    async getAdminUsers() {
        const res = await fetch(`${API_URL}/admin/users`, {
            headers: this.getAdminHeaders()
        });
        return this.handleResponse(res);
    },

    async getAdminProducts() {
        const res = await fetch(`${API_URL}/admin/products`, {
            headers: this.getAdminHeaders()
        });
        return this.handleResponse(res);
    },

    async toggleProductApproval(productId) {
        const res = await fetch(`${API_URL}/admin/products/${productId}/toggle-approval`, {
            method: 'POST',
            headers: this.getAdminHeaders()
        });
        return this.handleResponse(res);
    },

    async getAdminLogs() {
        const res = await fetch(`${API_URL}/admin/logs`, {
            headers: this.getAdminHeaders()
        });
        return this.handleResponse(res);
    },

    async getPublicSettings() {
        const res = await fetch(`${API_URL}/settings`);
        return this.handleResponse(res);
    },

    async getAdminSettings() {
        const res = await fetch(`${API_URL}/admin/settings`, {
            headers: this.getAdminHeaders()
        });
        return this.handleResponse(res);
    },

    async updateAdminSettings(settings) {
        const res = await fetch(`${API_URL}/admin/settings`, {
            method: 'POST',
            headers: {
                ...this.getAdminHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(settings)
        });
        return this.handleResponse(res);
    },

    async toggleUserBan(userId) {
        const res = await fetch(`${API_URL}/admin/users/${userId}/ban`, {
            method: 'POST',
            headers: this.getAdminHeaders()
        });
        return this.handleResponse(res);
    },

    async updateUserRole(userId, isAdmin) {
        const res = await fetch(`${API_URL}/admin/users/${userId}/update-role`, {
            method: 'POST',
            headers: {
                ...this.getAdminHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ is_admin: isAdmin })
        });
        return this.handleResponse(res);
    },

    async toggleUserVerification(userId) {
        const res = await fetch(`${API_URL}/admin/users/${userId}/verify`, {
            method: 'POST',
            headers: this.getAdminHeaders()
        });
        return this.handleResponse(res);
    },

    async getAdminCommunityPosts() {
        const res = await fetch(`${API_URL}/admin/community/posts`, {
            headers: this.getAdminHeaders()
        });
        return this.handleResponse(res);
    },

    async getAdminTransactions() {
        const res = await fetch(`${API_URL}/admin/transactions`, {
            headers: this.getAdminHeaders()
        });
        return this.handleResponse(res);
    },

    async deleteAdminCommunityPost(postId) {
        const res = await fetch(`${API_URL}/admin/community/posts/${postId}/delete`, {
            method: 'POST',
            headers: this.getAdminHeaders()
        });
        return this.handleResponse(res);
    },

    async deleteAdminProduct(productId) {
        const res = await fetch(`${API_URL}/admin/products/${productId}`, {
            method: 'DELETE',
            headers: this.getAdminHeaders()
        });
        return this.handleResponse(res);
    },

    async deleteAdminUser(userId) {
        const res = await fetch(`${API_URL}/admin/users/${userId}`, {
            method: 'DELETE',
            headers: this.getAdminHeaders()
        });
        return this.handleResponse(res);
    },

    async postAnnouncement(content) {
        const res = await fetch(`${API_URL}/admin/announcements`, {
            method: 'POST',
            headers: {
                ...this.getAdminHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content })
        });
        return this.handleResponse(res);
    },

    async submitReview(data) {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        return this.handleResponse(res);
    },

    async getUserReviews(userId) {
        const res = await fetch(`${API_URL}/reviews/${userId}`);
        return this.handleResponse(res);
    },

    async getUserRating(userId) {
        const res = await fetch(`${API_URL}/user/${userId}/rating`);
        return this.handleResponse(res);
    }
};
