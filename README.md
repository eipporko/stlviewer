# STL Viewer

STL Viewer is a simple application for visualizing STL (stereolithography) files, commonly used for 3D modeling and printing.

## Features
- Load and display STL files.
- Rotate, zoom, and pan the 3D model.
- Lightweight and easy to use.

## Getting Started

Follow the instructions below to clone, install dependencies and deploy the project.

### Prerequisites
- Ensure you have [Git](https://git-scm.com/) and [Node.js](https://nodejs.org/) installed on your system.

### Clone the Repository
```bash
git clone https://github.com/eipporko/stlviewer.git
cd stlviewer
```

### Install Dependencies
Use your package manager of choice (e.g., npm or yarn) to install the required dependencies:
```bash
npm install
```

### Start the Development Server
Launch the application in development mode with hot module replacement (HMR) enabled:
```bash
npm run dev
```
The application will automatically reload when you make changes to the code. Access it at `http://localhost:5173` (default Vite development server port).

### Build for Production
To create a production-ready build:
```bash
npm run build
```
The build files will be located in the `dist` directory.

## License
This project is licensed under the [MIT License](LICENSE).
