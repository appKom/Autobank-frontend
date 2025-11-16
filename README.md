# Autobank Frontend
This project is a website for the bank committee in online. It's a website both for users, seeking funding or money back from the line union, and for admins, approving or rejecting applications for funding or reimbursement. So the users can apply for money, they can send in a receipt and have an overlook over their applications and receipts that have been sent in. There will also be a frequently asked questions site, to help users understand and hopefully find answers to their questions. 

For admins they can review applications and receipts, either approving or rejecting, they will also get an overview of all the different applications. Further plans are to incorporate a form to make invoices to different companies, to make this easier for the admins. 

## Getting Started

### 1. Clone the repository

```bash
git https://github.com/appKom/gnocchi.git
cd gnocchi
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

#### Create `.env` file:

```bash
touch .env
```

## Required environment variables

- **VITE_AUTH0_DOMAIN** - The domain of the Auth0 application.
- **VITE_AUTH0_CLIENT_ID** - The client id of the Auth0 application.
- **VITE_AUTH0_REDIRECT_URI** - The redirect uri of the Auth0 application.
- **VITE_AUTH0_AUDIENCE** - The audience of the Auth0 application.
- **VITE_AUTH0_LOGOUT_URI** - The uri to redirect to after logging out.

- **VITE_BACKEND_URI** - The uri of the backend.
