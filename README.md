# MediaVault

A full-stack web application to manage your personal library of media like books, movies, games, and more. Track what you own, what you've lent, what's on your wishlist, and your reading/watching progress.

## Features

- **User Authentication**: Secure registration and login system using JWT.
- **Library Management**: Full CRUD (Create, Read, Update, Delete) operations for all your media items.
- **Custom Collections**: Organize your media into personalized collections.
- **Loan Tracking**: Keep a record of items you've lent to friends and when they are due back.
- **Wishlist**: Maintain a list of media you want to acquire in the future.
- **Rating & Reviews**: Rate your media on a 5-star scale and write detailed reviews.
- **Progress Tracking**: Monitor your progress for books (by page) and series (by episode).
- **Statistics Dashboard**: Visualize your library with charts and key stats.
- **Dual Theme**: A beautiful and responsive UI with custom Light and Dark modes.

## Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite
- **Authentication**: JSON Web Tokens (JWT)
- **Dependencies**: `cors`, `bcryptjs`, `dotenv`, `jsonwebtoken`, `sqlite3`

### Frontend

- **Framework**: React (bootstrapped with Vite)
- **Styling**: Tailwind CSS with the DaisyUI component library.
- **Routing**: React Router
- **API Communication**: Axios
- **Animations**: Framer Motion & tsParticles
- **Charts**: Recharts

## Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or later recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Installation & Setup

Follow these steps to get the project running on your local machine.

1.  **Clone the repository**

    ```bash
    git clone <your-repository-url>
    cd MediaVault
    ```

2.  **Set up the Backend**

    ```bash
    # Navigate to the backend directory
    cd backend

    # Install dependencies
    npm install
    ```
    The backend uses a `.env` file for configuration. You can create one in the `backend` directory to specify the following variables (defaults are used if not provided):

    ```env
    # Port for the backend server
    PORT=5000

    # Secret key for signing JWTs
    JWT_SECRET=your_jwt_secret
    ```

3.  **Set up the Frontend**

    ```bash
    # Navigate to the frontend directory from the root
    cd frontend

    # Install dependencies
    npm install
    ```

## Usage

To run the application, you need to start both the backend and frontend servers.

-   **Run the Backend Server**

    Open a terminal in the `backend` directory and run:

    ```bash
    npm start
    ```

    The API server will start on `http://localhost:5000` (or the port specified in your `.env` file).

-   **Run the Frontend Dev Server**

    Open a second terminal in the `frontend` directory and run:

    ```bash
    npm run dev
    ```

    The React application will be available at `http://localhost:5173` (or the next available port).

