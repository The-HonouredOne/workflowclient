# Workflow Builder - Technical Assessment

## Overview
A professional workflow builder application that allows users to create, save, load, and manage workflows with input and output nodes. Features a modern UI with drag-and-drop functionality, real-time data flow, and comprehensive workflow management.

## Tech Stack
- **Frontend**: React, React Flow, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Database**: MongoDB
- **Additional**: Axios, dotenv

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally on port 27017)
- npm or yarn

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd interview
```

### 2. Backend Setup
```bash
cd server
npm install
# Copy environment file
cp .env.example .env
# Start the server
npm start
```
The backend will run on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd client
npm install
# Copy environment file
cp .env.example .env
# Start the development server
npm run dev
```
The frontend will run on `http://localhost:5173`

## Features

### ✅ Core Features
- **Professional UI**: Modern, clean interface with professional styling
- **Workflow Canvas**: Drag nodes, connect them, pan/zoom with React Flow
- **Node Types**: Input (blue) and Output (green) nodes with gradient headers
- **Node Settings**: Click nodes to edit name, description, and values
- **Workflow Operations**: Save, Load, Delete workflows
- **Smart Delete**: Delete currently loaded workflow with confirmation
- **Validation**: Comprehensive checks for nodes, connections, and circular dependencies
- **Data Flow**: Real-time data propagation from Input to Output nodes
- **Keyboard Shortcuts**: Delete key to remove selected nodes/edges

### 🎁 Bonus Features
- **Export/Import**: Export workflows as JSON files and import them back
- **Environment Configuration**: Configurable backend URLs and database connections
- **Professional Design**: Modern card-based UI with hover effects and transitions
- **Contextual Actions**: Smart UI that shows relevant actions based on current state

### 🔧 Core Functionality
- Drag nodes from sidebar to canvas
- Connect nodes via handles with visual feedback
- Delete nodes/edges with Delete key (smart input field detection)
- Comprehensive settings panel with form validation
- Workflow validation before saving
- MongoDB storage with proper error handling
- Real-time workflow state tracking

## API Endpoints

### Workflows
- `POST /api/workflows` - Save a workflow
- `GET /api/workflows` - List all saved workflows  
- `GET /api/workflows/:id` - Load a specific workflow
- `DELETE /api/workflows/:id` - Delete a specific workflow

## Project Structure
```
interview/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── nodes/      # Node type components (InputNode, OutputNode)
│   │   │   ├── Sidebar.tsx # Draggable node library
│   │   │   ├── SettingsPanel.tsx # Node configuration panel
│   │   │   └── Toolbar.tsx # Workflow operations toolbar
│   │   ├── utils/          # Utility functions
│   │   │   ├── validation.ts # Workflow validation logic
│   │   │   └── dataFlow.ts   # Data propagation logic
│   │   ├── types/          # TypeScript type definitions
│   │   └── App.tsx         # Main application component
│   ├── tests/              # Test files
│   ├── .env.example        # Environment variables template
│   └── package.json
├── server/                 # Backend Express application
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   └── middleware/     # Custom middleware
│   ├── tests/              # Backend tests
│   ├── server.js           # Main server file
│   ├── .env.example        # Environment variables template
│   └── package.json
└── README.md
```

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/workflows
NODE_ENV=development
```

## Design Decisions

### Frontend
- **React Flow**: Chosen for robust node-based UI capabilities and excellent TypeScript support
- **TypeScript**: Used throughout for type safety and better development experience
- **Tailwind CSS**: For rapid, consistent styling and professional appearance
- **Vite**: Fast development server and build tool
- **Component Architecture**: Modular design with reusable components

### Backend
- **Express**: Lightweight and flexible web framework
- **MongoDB**: Document-based storage perfect for workflow data
- **Mongoose**: ODM for MongoDB with schema validation
- **MVC Pattern**: Organized code structure with controllers, models, and routes
- **Environment Configuration**: Flexible deployment configuration

### Data Flow
- Input nodes contain text values that propagate to connected Output nodes
- Real-time updates using React state management
- Unidirectional flow (Input → Output)
- Proper state synchronization between components

## Usage Guide

### Creating a Workflow
1. Drag **Input Node** and **Output Node** from sidebar to canvas
2. Connect nodes by dragging from output handle to input handle
3. Click nodes to edit their settings (name, description, value)
4. Enter text in Input node to see it propagate to Output node
5. Click **Save Workflow** to store in database

### Managing Workflows
- **Load**: Select from dropdown to load existing workflow
- **Delete**: Load a workflow, then click "Delete This Workflow"
- **Export**: Click "Export" to download as JSON file
- **Import**: Click "Import" to upload JSON file
- **Clear**: Click "New Workflow" to start fresh

## Testing

### Frontend Tests
```bash
cd client
npm test
```

### Backend Tests
```bash
cd server
npm test
```

## Deployment

### Production Environment Variables
```bash
# Frontend
VITE_API_URL=https://your-api-domain.com

# Backend
PORT=5000
MONGODB_URI=mongodb://your-mongodb-connection-string
NODE_ENV=production
```

## Known Limitations
- No user authentication (single-user application)
- No workflow versioning or history
- Basic validation rules (could be more sophisticated)
- No real-time collaboration features
- No workflow templates or presets

## Future Improvements
- Add user authentication and multi-user support
- Implement workflow versioning and history
- Add more node types (Transform, Filter, etc.)
- Add workflow templates and quick-start options
- Implement undo/redo functionality
- Add dark mode theme
- Add workflow sharing and collaboration features
- Implement workflow execution engine
- Add comprehensive test coverage
- Performance optimizations for large workflows

## Troubleshooting

### Common Issues
- **MongoDB Connection**: Ensure MongoDB is running on port 27017
- **Port Conflicts**: Check that ports 5000 and 5173 are available
- **Environment Variables**: Ensure .env files are properly configured
- **Node Version**: Verify Node.js version is 16 or higher
- **Dependencies**: Run `npm install` in both client and server directories

### Error Messages
- **"Failed to load workflows"**: Check backend server is running
- **"Validation errors"**: Ensure workflow has at least one Input and Output node
- **"MongoDB connection error"**: Verify MongoDB is running and accessible

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License
This project is for technical assessment purposes.