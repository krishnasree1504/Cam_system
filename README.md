# CAMS India - Consumer Attention Mapping System

A full-stack web application organized with modular **Frontend**, **Backend**, and **Database** architectures.

## 📁 Project Structure

```
cams-india-app/
├── 📁 frontend/          # React 18 + Vite + Tailwind CSS User Interface
│   └── src/
│       ├── components/   # UI components (Navbar, Sidebar, Badges)
│       ├── context/      # AuthContext state management
│       ├── lib/          # API Axios client
│       ├── pages/        # Dashboard, Stores, Shelves, Cameras, Users, Settings, Login, Register
│       ├── App.tsx
│       ├── main.tsx
│       └── index.css
│
├── 📁 backend/           # Node.js + Express REST API Server
│   ├── routes/           # Modular API endpoints (Auth, Stores, Shelves, Cameras, Users, Dashboard)
│   └── server.ts         # Express server configuration
│
├── 📁 database/          # In-memory Database & Collections Schema
│   ├── schema.ts         # TypeScript interfaces & types
│   └── db.ts             # Initial seed data (India Branches: Mumbai, Bengaluru, Delhi, Hyderabad)
│
├── server.ts             # Root entry point
├── package.json          # Node dependencies & scripts
├── vite.config.ts        # Vite configuration
└── README.md             # Running instructions
```

---

## 🚀 How to Run in VS Code on Your Computer

### Step 1: Open the Project in VS Code
1. Extract the downloaded `cams-india-app.zip` file to a folder on your computer.
2. Open **VS Code**.
3. Click **File** > **Open Folder...** (or `Ctrl + O` / `Cmd + O`) and select the extracted `cams-india-app` folder.

---

### Step 2: Open the Integrated Terminal in VS Code
1. In VS Code, open a new terminal by clicking **Terminal** > **New Terminal** (or pressing ``Ctrl + ` ``).

---

### Step 3: Install Dependencies
Run the following command in the VS Code terminal:

```bash
npm install
```

---

### Step 4: Start the Development Server
Run the dev command:

```bash
npm run dev
```

You will see the output in the terminal:
```
CAMS India App server running on http://localhost:3000
```

---

### Step 5: Open in Your Browser
Open your browser and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🔑 Demo Login Credentials

- **Admin Account**: `admin@cams.com` (Password: `admin123`)
- **Store Manager Account**: `manager@cams.com` (Password: `manager123`)
- **Analyst Account**: `analyst@cams.com` (Password: `analyst123`)
