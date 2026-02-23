# CampusMart

A student marketplace platform connecting students, traders, and landlords. Buy and sell campus goods at comrade prices, find student accommodation, and connect directly with verified traders and landlords.

## Features

- **Student Marketplace** - Buy and sell textbooks, electronics, furniture, and more
- **Accommodation Finder** - Find hostels, single rooms, and apartments near campus
- **Real-time Messaging** - Chat directly with sellers and landlords
- **GPS Location** - Exact location pins for accommodation listings
- **Zero Commission** - 100% free platform for all users
- **Peer Reviews** - Rate and review other users

## Project Structure

```
campus-mart/
├── frontend/          # React + Vite application (Port 5173)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── lib/
│   │   └── hooks/
│   ├── public/
│   └── package.json
│
├── backend/           # Node.js + Express API (Port 5000)
│   ├── index.js       # Main server file
│   ├── .env.example   # Environment template
│   └── package.json
│
├── .gitignore         # Git ignore rules
├── SECURITY.md        # Security guidelines
└── README.md          # This file
```

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/campus-mart.git
   cd campus-mart
   ```

2. **Setup Backend**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your credentials
   npm install
   npm start
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   cp .env.example .env
   # Edit .env with your API URL
   npm install
   npm run dev
   ```

### Environment Setup

See `.env.example` files in both `backend/` and `frontend/` directories for required environment variables.

**IMPORTANT:** Never commit actual `.env` files. See [SECURITY.md](SECURITY.md) for details.

## Access

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

## Tech Stack

### Frontend
- React 18
- Vite
- Lucide Icons
- Supabase (optional)

### Backend
- Node.js
- Express
- PostgreSQL
- JWT Authentication
- Nodemailer
- M-Pesa Integration

## Development

### Running Tests
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Building for Production
```bash
# Frontend
cd frontend
npm run build

# Backend uses Node.js directly
cd backend
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

**Before submitting:** Review [SECURITY.md](SECURITY.md) to ensure no sensitive data is committed.

## Security

See [SECURITY.md](SECURITY.md) for security guidelines and best practices.

## License

This project is licensed under the MIT License.

## Support

For support, email support@campusmart.co.ke or open an issue on GitHub.

## Acknowledgments

- Built for students, by students
- Inspired by the need for a trusted campus marketplace
- Special thanks to all contributors

