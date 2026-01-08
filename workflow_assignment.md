# Workflow Builder - Technical Assessment

## Overview
Build a simple workflow builder application that allows users to create basic workflows with input and output nodes, and save/load these workflows.

**Tech Stack:**
- Frontend: React, React Flow, TypeScript
- Backend: Node.js, Express
- Database: Your choice (MongoDB, PostgreSQL, etc.)

---

## Project Requirements

### 1. Frontend Implementation

#### 1.1 Workflow Canvas
- Implement a canvas using React Flow
- Users should be able to:
  - Drag nodes from a sidebar onto the canvas
  - Connect nodes (output port to input port)
  - Select, move, and delete nodes
  - Pan and zoom the canvas

#### 1.2 Node Types
Implement the following node types:

1. **Input Node**
   - Single output port
   - No input port
   - Settings: Node name, Description
   - Visual: Blue border/background
   - Can contain text input that will be passed to connected nodes

2. **Output Node**
   - Single input port
   - No output port
   - Settings: Node name, Description
   - Visual: Green border/background
   - Displays the text received from connected input node

#### 1.3 Node Settings
- Clicking a node should open a settings panel
- Settings should include:
  - Node Name (string, required)
  - Description (optional)
  - For Input Node: Default text value
- Changes should be saved when the user clicks outside the panel

#### 1.4 Workflow Operations
Create a single page with:
- Canvas area for building workflows
- Sidebar with draggable node types (Input and Output)
- Toolbar with actions: Save Workflow, Load Workflow, Clear Canvas

#### 1.5 Workflow Validation
Implement basic validation that checks:
- At least one Input node exists
- At least one Output node exists
- All nodes are connected
- No circular connections
- Display validation errors when saving

#### 1.6 Data Flow
- When the user enters text in an Input node, it should be passed to connected Output nodes
- Output nodes should display the text they receive
- The flow should be unidirectional (Input → Output)

#### 1.7 Styling
- Use CSS or a UI library of your choice
- Make it clean and functional

---

### 2. Backend Implementation

#### 2.1 API Endpoints
Implement the following RESTful endpoints:

**Workflows:**
```
POST   /api/workflows     - Save a workflow
GET    /api/workflows     - List all saved workflows
GET    /api/workflows/:id - Load a specific workflow
```


**Implementation Steps:**
1. First, implement these  node types with their data structures
2. Create the transformation logic for each node type
3. Build the React Flow UI components for drag-and-drop
4. Implement node settings panel to edit the settings
5. Connect nodes via edges and validate the workflow
6. Implement the backend API to store/retrieve workflows

This structure will serve as the foundation for your drag-and-drop interface.

#### 4.2 README.md
Include:
- Project description
- Tech stack
- Prerequisites (Node version, MongoDB, etc.)
- Installation instructions
- How to run the application (frontend & backend)
- How to run tests
- Environment variables needed
- API documentation (or link to it)
- Design decisions and assumptions made
- Known limitations or future improvements

#### 4.3 Project Structure
Organize your code with clear separation:
```
project-root/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── types/
│   │   ├── utils/
│   │   └── ...
│   ├── tests/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── ...
│   ├── tests/
│   └── package.json
└── README.md
```

#### 4.4 Code Quality
- Use TypeScript throughout
- Follow consistent code style (ESLint recommended)
- Write clean, maintainable code
- Add comments for complex logic
- Handle errors gracefully

---

## Evaluation Criteria

You will be evaluated on:

1. **Functionality (40%)**
   - All features work as specified
   - Workflows can be created, saved, edited, and deleted
   - Validation and simulation work correctly

2. **Code Quality (30%)**
   - Clean, readable, and maintainable code
   - Proper TypeScript usage
   - Good project structure and organization
   - Proper error handling

3. **UI/UX (15%)**
   - Intuitive and user-friendly interface
   - Responsive design
   - Professional appearance
   - Good use of Tailwind CSS

4. **Testing & Documentation (15%)**
   - Adequate test coverage
   - Clear API documentation
   - Comprehensive README
   - Code is easy to set up and run

---

## Submission Guidelines

1. Create a Git repository (GitHub, GitLab, or Bitbucket)
2. Commit your code with clear, meaningful commit messages
3. Ensure README.md has complete setup instructions
4. Share the repository link
5. Include any .env.example files needed

**Important Notes:**
- Do not include node_modules or .env files
- Ensure the application runs on a fresh clone
- If you run out of time, document what's incomplete and how you would approach it

---

## Bonus Points (Optional)

If you have extra time, consider adding:
- Workflow versioning
- Undo/redo functionality
- Workflow templates
- Export/import workflows as JSON
- Dark mode
- More sophisticated validation rules
- Performance optimizations for large workflows

---

## Questions?

If you have any questions or need clarification, please reach out. We want you to succeed!

Good luck! 🚀