#Mini CRM Frontend
This is the frontend application for the Mini CRM platform, built with React and Tailwind CSS. It provides a user-friendly interface for managing customers, orders, and marketing campaigns, including AI-powered segmentation capabilities.

#✨ Features
Google OAuth Integration: Secure user authentication via Google.

Dashboard: Overview of key CRM metrics (total customers, orders, campaigns).

Customer Management:

View, add, edit, and delete customer records.

Customer details include ID, name, email, phone, address, total spend, and total visits.

Order Management:

View, add, edit, and delete order records.

Orders are linked to customers and include details like order ID, date, total amount, items, and status.

Campaign Management:

Create, view, and delete marketing campaigns.

Dynamic Segmentation: Build complex customer segments using a rule builder with various fields (spend, visits, activity, demographics) and conditions (equals, greater than, contains, inactive days, etc.).

AI-Powered Segmentation: Generate segmentation rules from natural language queries using the Gemini API.

Audience Preview: See the estimated audience size and sample emails for your defined segments.

Campaign Delivery Simulation: Campaigns are simulated to send messages to the targeted audience.

Communication Logs: View detailed logs of messages sent for each campaign, including delivery status and failure reasons.

Responsive Design: Optimized for various screen sizes (desktop, tablet, mobile).

Modern UI: Clean and intuitive interface using Tailwind CSS and Headless UI components.

#🚀 Technologies Used
React.js: A JavaScript library for building user interfaces.

Tailwind CSS: A utility-first CSS framework for rapidly building custom designs.

Headless UI: Completely unstyled, fully accessible UI components, designed to integrate beautifully with Tailwind CSS.

React Router DOM: For declarative routing in the application.

Axios: Promise-based HTTP client for making API requests to the backend.

Heroicons: Beautiful hand-crafted SVG icons.

#⚙️ Setup and Local Development
Follow these steps to get the frontend running on your local machine.

#Prerequisites
Node.js (LTS version recommended)

npm (Node Package Manager) or yarn

#Installation
Clone the repository:

git clone <your-frontend-repo-url>
cd mini-crm/frontend

(Replace <your-frontend-repo-url> with the actual URL of your frontend repository)

Install dependencies:

npm install
 OR
yarn install

Create a .env file:
In the frontend/ directory, create a file named .env and add the following:

REACT_APP_BACKEND_URL=[https://crm-backend-64da.onrender.com]

Note: If your backend is running on a different port (e.g., 5001), adjust http://localhost:5000 accordingly. If you are using Vite for your React app, ensure the variable starts with VITE_ (e.g., VITE_APP_BACKEND_URL).

Running the Application
Start the frontend development server:

npm start
# OR
yarn start

This will typically open your application in your browser at http://localhost:3000 (or http://localhost:5173 if using Vite).

Ensure the Backend is Running:
This frontend application requires the Mini CRM Backend to be running. Make sure you have followed the backend setup instructions and started the backend server (usually on http://localhost:5000).

#💡 Usage
Once the application is running:

Login: Click "Login with Google" to authenticate. You will be redirected to Google for authentication and then back to the dashboard.

Navigate: Use the navigation bar to access different sections:

Dashboard: View summary statistics.

Campaigns: Create and manage marketing campaigns, define segments, and view delivery logs.

Customers: Add, view, and manage customer profiles.

Orders: Add, view, and manage customer orders.

Interact: Use the forms and tables to add new data, edit existing records, and delete entries. Experiment with the AI-powered segmentation by typing natural language queries.

#📂 Project Structure
frontend/
├── public/                  # Public assets
├── src/
│   ├── api/                 # API client (axios setup, crmApi.js)
│   ├── components/          # Reusable UI components (Navbar, MessageModal, RuleBuilder, PrivateRoute, AuthStatus)
│   ├── contexts/            # React Contexts (AuthContext)
│   ├── hooks/               # Custom React Hooks (useAuth)
│   ├── pages/               # Top-level page components (DashboardPage, CampaignListPage, LoginPage, etc.)
│   ├── utils/               # Utility functions (helpers.js)
│   ├── App.js               # Main application component
│   ├── index.js             # Entry point for React app
│   └── index.css            # Tailwind CSS imports and custom styles
├── .env.example             # Example environment variables
├── package.json             # Project dependencies and scripts
└── README.md                # This file

#🤝 Contributing
Contributions are welcome! If you have suggestions for improvements or find bugs, please feel free to open an issue or submit a pull request.

#📄 License
This project is licensed under the MIT License.
