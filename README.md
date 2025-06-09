# ShopBot: E-commerce Sales Chatbot

A modern, AI-powered e-commerce platform with an integrated chatbot for enhanced shopping experience. The application features a responsive UI, real-time product search, and a conversational assistant to help users find products, explore categories, and get personalized recommendations.

### HomePage:-
![E-commerce Chatbot Demo](https://github.com/user-attachments/assets/f69cbfb2-c584-46d7-bb5c-6b20d31f061d)

### ProductsPage:-
![E-commerce Chatbot Demo](https://github.com/user-attachments/assets/294923d1-a72e-40d3-99ec-76c7460b58d4)

### ChatBot:-
![E-commerce Chatbot Demo](https://github.com/user-attachments/assets/5c2f4e5f-564d-42fd-a90c-29991dc4e154)


## 🚀 Features

- **Intelligent Shopping Assistant**: Chatbot to help users browse products and answer questions
- **Product Catalog**: Browse and search across 8 product categories with detailed product pages
- **Responsive Design**: Modern UI that works on desktop and mobile devices
- **User Authentication**: Secure login and registration system
- **Graceful Error Handling**: Fallback mechanisms for API failures with mock data

## 🛠️ Technology Stack

### Frontend

- **Framework**: Next.js 14 with App Router
- **UI**: TailwindCSS with custom animations and gradients
- **State Management**: React hooks and context
- **Image Optimization**: Next.js Image component with proper loading states

### Backend

- **API**: RESTful endpoints for products, categories, users, and chat
- **Authentication**: JWT-based auth system
- **Data Storage**: Structured product and user data models

### Chatbot Features

- **Natural Language Processing**: Context-aware conversations
- **Product Discovery**: Find products by name, category, or features
- **Category Navigation**: Browse through 8 different product categories
- **Product Recommendations**: Get personalized product suggestions

## 📋 Project Structure

```
ecommerce-chatbot/
├── frontend/                # Next.js frontend application
│   ├── app/                 # App router pages and layouts
│   │   ├── api/             # API route handlers
│   │   ├── auth/            # Authentication pages
│   │   ├── cart/            # Shopping cart functionality
│   │   ├── components/      # Reusable UI components
│   │   ├── lib/             # Utility functions and API client
│   │   ├── products/        # Product listing and detail pages
│   │   └── layout.tsx       # Root layout with metadata
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
└── backend/                 # Backend API (if applicable)
    ├── api/                 # API endpoints
    ├── models/              # Data models
    └── package.json         # Backend dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/rachitkatyal04/e-commerce-chatbot.git
   cd e-commerce-chatbot
   ```

2. Install frontend dependencies:

   ```bash
   cd frontend
   npm install
   # or
   yarn install
   ```

3. If you have a separate backend, install backend dependencies:
   ```bash
   cd ../backend
   npm install
   # or
   yarn install
   ```

### Running the Application

1. Start the frontend development server:

   ```bash
   cd frontend
   npm run dev
   # or
   yarn dev
   ```

2. Start the backend server using Python virtual environment:

   ```bash
   cd ../backend
   # Create virtual environment (if not already created)
   python -m venv venv

   # Activate virtual environment
   # On Windows
   .\venv\Scripts\activate
   # On macOS/Linux
   source venv/bin/activate

   # Install dependencies
   pip install -r requirements.txt

   # Run the server (automatically runs on http://localhost:8000)
   python manage.py runserver
   ```

3. Open your browser and navigate to `http://localhost:3000`

## 💬 Chatbot Usage Examples

The chatbot can understand a variety of queries. Here are some examples:

### Category Browsing

- "Show me all categories"
- "What products do you have?"
- "I want to see electronics"

### Product Search

- "Show me smartphones"
- "Do you have any laptops?"
- "I'm looking for kitchen appliances"

### Product Details

- "Tell me more about the Premium T-Shirt"
- "What's the price of the Ultra Book Pro?"
- "Is the Coffee Maker Deluxe in stock?"

### Shopping Assistance

- "Help me find a gift"
- "What's your best-selling product?"
- "I need a new watch"

## 🔒 Authentication

The application includes user authentication:

1. Register a new account
2. Log in with your credentials
3. Access personalized features (saved cart, order history)

## 🧪 Testing

Run the test suite with:

```bash
cd frontend
npm run test
# or
yarn test
```

## 📱 Responsive Design

The application is fully responsive and optimized for:

- Desktop browsers
- Tablets
- Mobile devices

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Unsplash](https://unsplash.com/) for product images

## 👨‍💻 Developer

Developed by Rachit Katyal😎
