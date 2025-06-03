# Mini CRM Frontend

This is the **frontend application** for the **Mini CRM platform**, built with **React** and **Tailwind CSS**. It provides a user-friendly interface for managing customers, orders, and marketing campaigns—including AI-powered segmentation capabilities.

---

## ✨ Features

- **Google OAuth Integration**: Secure user authentication via Google.
- **Dashboard**: Overview of key CRM metrics (total customers, orders, campaigns).
- **Customer Management**:
  - View, add, edit, and delete customer records.
  - Customer details include ID, name, email, phone, address, total spend, and total visits.
- **Order Management**:
  - View, add, edit, and delete order records.
  - Orders linked to customers with details like order ID, date, total amount, items, and status.
- **Campaign Management**:
  - Create, view, and delete marketing campaigns.
  - **Dynamic Segmentation**: Build complex segments using a rule builder (spend, visits, activity, demographics, etc.).
  - **AI-Powered Segmentation**: Generate rules from natural language using the Gemini API.
  - **Audience Preview**: Estimate audience size and preview emails for defined segments.
  - **Campaign Delivery Simulation**: Simulate sending messages to targeted segments.
  - **Communication Logs**: View logs of sent messages, including delivery status and failure reasons.
- **Responsive Design**: Works on desktop, tablet, and mobile.
- **Modern UI**: Clean and intuitive interface using Tailwind CSS and Headless UI.

---

## 🚀 Technologies Used

- **React.js** – Frontend UI framework.
- **Tailwind CSS** – Utility-first CSS framework.
- **Headless UI** – Accessible unstyled components.
- **React Router DOM** – Client-side routing.
- **Axios** – HTTP client for API communication.
- **Heroicons** – Beautiful SVG icon library.

---

## ⚙️ Setup & Local Development

### Prerequisites

- Node.js (LTS recommended)
- npm or yarn

### Installation

1. **Clone the repository**:

   ```bash
   git clone <your-repo-url>
   cd mini-crm/frontend
**Install dependencies:


npm install
# OR
yarn install
Configure environment variables:

Create a .env file in the frontend/ directory:

REACT_APP_BACKEND_URL=https://crm-backend-64da.onrender.com
If you're using Vite, the variable should be VITE_APP_BACKEND_URL.

Start the frontend server:


npm start
# OR
yarn start
This typically runs at http://localhost:3000 (or http://localhost:5173 for Vite).

Ensure Backend is Running:

The frontend connects to the Mini CRM Backend. Ensure the backend is set up and running (default: http://localhost:5000).

💡 Usage
Login: Click "Login with Google" to authenticate via Google.

Navigate using the top navbar:

Dashboard: Summary statistics.

Campaigns: Create/manage campaigns, define segments, view logs.

Customers: Add/view/manage customer profiles.

Orders: Add/view/manage customer orders.

AI Segmentation: Use natural language to generate smart segments using the Gemini API.

📂 Project Structure
graphql
Copy
Edit
frontend/
├── public/                # Public assets
├── src/
│   ├── api/               # API client (axios setup, crmApi.js)
│   ├── components/        # Reusable UI components (Navbar, RuleBuilder, etc.)
│   ├── contexts/          # React Contexts (AuthContext)
│   ├── hooks/             # Custom React Hooks (useAuth)
│   ├── pages/             # Page components (Dashboard, Campaigns, etc.)
│   ├── utils/             # Utility functions
│   ├── App.js             # Root component
│   ├── index.js           # React entry point
│   └── index.css          # Tailwind CSS and styles
├── .env.example           # Sample environment variables
├── package.json           # Project metadata and scripts
└── README.md              # Project documentation
🤝 Contributing
Contributions are welcome! Please open an issue or submit a pull request if you find bugs or have suggestions for improvement.









=
