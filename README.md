# Getting Started with PassGuard

This guide walks you through setting up your development environment and running the application.

## Prerequisites

* **Git:** Make sure you have Git installed. Get it from https://git-scm.com/downloads(https://git-scm.com/downloads).
* **Node.js & npm:** Download and install the latest version of Node.js from the official website: https://nodejs.org/en. This will also install npm (Node Package Manager).

## 1. Clone the Repository

Open your terminal or command prompt, navigate to your desired project directory, and run the following command to clone the project repository:

```bash
git clone [https://docs.github.com/articles/cloning-a-repository](https://docs.github.com/articles/cloning-a-repository)
```

Replace `https://docs.github.com/articles/cloning-a-repository` with the actual URL of your Git repository.

## 2. Install Dependencies

Navigate into the cloned project directory:

```bash
cd [project_name]
```

Replace `[project_name]` with the actual name of your project directory.

Then, install the project's dependencies using npm:

```bash
npm install
```

This downloads and installs all the required packages listed in the `package.json` file.

## 3. Database Setup

**Option 1: Using Prisma** (if your project uses Prisma for database management)

Run the following command to build the Prisma schema and create the database tables (if they don't already exist):

```bash
npx prisma build
```

**Option 2: Manual Database Setup** (if you're using a different database management system)

Follow the instructions specific to your chosen database (e.g., MySQL, PostgreSQL) to create the necessary tables and structures. These instructions might involve creating a database user, importing a schema file, or using a GUI tool provided by your database system.

## 4. Run the Development Server

Start the development server using npm:

```bash
npm run dev
```
