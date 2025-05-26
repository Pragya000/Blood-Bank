Blood Bank Management System
A full-stack web application designed to streamline blood donation and transfusion processes. This system facilitates efficient management of donors, recipients, and blood inventory for hospitals and blood banks.

🧪 Features
Donor Management: Register, update, and manage donor information.

Recipient Management: Handle recipient requests and track transfusion history.

Inventory Tracking: Monitor blood stock levels by type and quantity.

Authentication: Secure login and registration for users and administrators.

Responsive Design: Optimized for various devices using Tailwind CSS.

🛠️ Tech Stack
Frontend: React.js, Tailwind CSS, Vite

Backend: Node.js, Express.js

Database: MongoDB

Version Control: Git & GitHub

Deployment: Vercel

Getting Started
Prerequisites
Node.js and npm installed

Installation
Clone the repository:

bash
git clone https://github.com/Pragya000/Blood-Bank.git
cd Blood-Bank
Install dependencies:

bash
npm install
Set up environment variables:

Rename .env.example to .env

Configure the following variables:

env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
Start the development server:

bash
npm run dev
The application will be accessible at http://localhost:5000.

📄 API Endpoints
Authentication
POST /api/auth/register - Register a new user

POST /api/auth/login - Authenticate user and retrieve token

Donors
GET /api/donors - Retrieve all donors

POST /api/donors - Add a new donor

PUT /api/donors/:id - Update donor information

DELETE /api/donors/:id - Remove a donor

Recipients
GET /api/recipients - Retrieve all recipients

POST /api/recipients - Add a new recipient

PUT /api/recipients/:id - Update recipient information

DELETE /api/recipients/:id - Remove a recipient

Inventory
GET /api/inventory - View blood stock levels

POST /api/inventory - Update inventory records



Create a new branch: git checkout -b feature/your-feature-name

Commit your changes: git commit -m 'Add your feature'

Push to the branch: git push origin feature/your-feature-name

Open a pull request

Contact
Developer: Pragya

GitHub: Pragya000

Email: pragyakhatwani20@gmail.com
