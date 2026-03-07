# Running the Course Management System

This project includes convenient scripts to build and run the application.

## Windows Users

### Option 1: Production Build
Run from **anywhere**:
```cmd
.\script\production\run.bat
```

Or navigate to the script folder:
```cmd
cd script\production
run.bat
```

This will:
1. Build the frontend (client)
2. Install server dependencies
3. Stop any existing Node processes
4. Start the production server on `http://localhost:5000`

### Option 2: Development Mode
Run from **anywhere**:
```cmd
.\script\development\run-dev.bat
```

Or navigate to the script folder:
```cmd
cd script\development
run-dev.bat
```

---

## Mac / Linux / Unix Users

### Option 1: Production Build

First time only, make the script executable:
```bash
chmod +x script/production/run.sh
```

Then run from **anywhere**:
```bash
./script/production/run.sh
```

Or navigate to the script folder:
```bash
cd script/production
./run.sh
```

This will:
1. Build the frontend (client)
2. Install server dependencies
3. Stop any existing Node processes
4. Start the production server on `http://localhost:5000`

### Option 2: Development Mode

First time only, make the script executable:
```bash
chmod +x script/development/run-dev.sh
```

Then run from **anywhere**:
```bash
./script/development/run-dev.sh
```

Or navigate to the script folder:
```bash
cd script/development
./run-dev.sh
```

---

## Manual Steps (if not using scripts)

### 1. Build Frontend
```bash
cd client
npm install
npm run build
cd ..
```

### 2. Install Server Dependencies
```bash
cd server
npm install
cd ..
```

### 3. Run Server
```bash
cd server
npm start
```

The server will start on `http://localhost:5000`

---

## Requirements
- Node.js (v20.19.0 or v22.12.0+)
- npm (comes with Node.js)

## Access the Application
- **Frontend:** http://localhost:5000
- **API:** http://localhost:5000/api
