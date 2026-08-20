# SpeedBack Application

SpeedBack is a platform designed to simplify the process of scheduling feedback sessions within teams. It provides a clear, real-time overview of team members' availability and allows for quick and conflict-free bookings.

---

## 🌟 Key Features

-   **Real-Time Dashboard**: A live, shared view of all feedback slots that updates instantly for all users using WebSockets.
-   **Conflict-Free Booking**: The system intelligently prevents double-bookings, ensuring a person cannot be a booker and a bookie in the same slot.
-   **Interactive UI**: A modern, professional user interface built with React and TypeScript.
-   **API Documentation**: Comes with a live, interactive Swagger UI for exploring and testing the backend API.
-   **Persistent Data**: Uses a PostgreSQL database with Flyway for version-controlled schema migrations.
-   **Professional Tooling**: Integrated with code formatters (Spotless for Java, Prettier for frontend) and linters (ESLint) to maintain high code quality.

---

## 🛠️ Tech Stack

The project is built with a modern, robust, and scalable technology stack.

| Area         | Technology                                                                                   |
|:-------------|:---------------------------------------------------------------------------------------------|
| **Backend**  | **Spring Boot 3** (Java 25), Spring Data JPA, Spring WebSockets, Flyway, Swagger, PostgreSQL |
| **Frontend** | **React 18** (TypeScript), React Router, Axios, Prettier, ESLint, Yarn/NPM                   |

---

## 🚀 Getting Started

Follow these instructions to get a local copy of the project up and running for development and testing purposes.

### Prerequisites

You will need the following software installed on your machine:
-   **Gradle** (only needed once to generate wrapper if missing)
-   **Node.js 18** or later
-   **Yarn** or **NPM**
-   **PostgreSQL 14** or later

---

### Frontend Setup

1.  **Navigate to the frontend directory:**
    Open a **new terminal window** and navigate to the frontend folder.
    ```bash
    cd frontend
    ```

2.  **Install Dependencies:**
    ```bash
    yarn install
    # or: npm install
    ```

3.  **Run the Frontend:**
    ```bash
    yarn start
    # or: npm start
    ```
    The frontend development server will start and open a browser window at `http://localhost:3000`.

---


## ⚙️ Available Scripts & Commands

-   **`yarn start`**: Runs the app in development mode.
-   **`yarn build`**: Builds the app for production.
-   **`yarn validate`**: Checks both code formatting (Prettier) and code quality (ESLint).
-   **`yarn fix`**: Automatically fixes all formatting and linting issues.
