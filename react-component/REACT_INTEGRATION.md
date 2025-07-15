# STL Viewer React Integration Guide

This guide will help you integrate the STL Viewer component into your React application.

## Project Structure

This `react-component` folder contains all the files needed for React integration:
```
react-component/
├── STLViewer.jsx          # Main React component
├── STLViewer.css          # Component styling
├── Example.jsx            # Usage example
├── REACT_INTEGRATION.md   # This guide
└── react-dependencies.json # Required dependencies list
```

## Quick Start Options

### Option 1: Use in Existing React App

1. **Install Three.js dependency:**
   ```bash
   npm install three@^0.175.0
   ```

2. **Copy component files to your React project:**
   - Copy `STLViewer.jsx` and `STLViewer.css` to your components folder
   - Copy the `../static/textures` folder to your React app's `public/` folder

3. **Import and use:**
   ```jsx
   import STLViewer from './components/STLViewer';
   
   function App() {
     return (
       <div>
         <h1>My 3D STL Viewer</h1>
         <STLViewer width={800} height={600} showControls={true} />
       </div>
     );
   }
   ```

### Option 2: Test with New React App

1. **Create new React app:**
   ```bash
   npx create-react-app stl-viewer-test
   cd stl-viewer-test
   npm install three@^0.175.0
   ```

2. **Copy files:**
   - Copy `STLViewer.jsx` and `STLViewer.css` to `src/`
   - Copy `../static/textures` folder to `public/`
   - Replace `src/App.js` content with the example from `Example.jsx`

3. **Run:**
   ```bash
   npm start
   ```

### Option 3: Keep Original Project

Your original vanilla JS implementation remains untouched and can still be run with:
```bash
npm run dev  # Runs the original Three.js implementation
```

## Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | number | 800 | Canvas width in pixels |
| `height` | number | 600 | Canvas height in pixels |
| `showControls` | boolean | true | Show/hide control panel |
| `initialModel` | File | null | Initial STL file to load |

## Features

- **STL File Loading**: Click "Load STL File" to upload .stl files
- **Material Options**: Switch between Matcap, Depth, and Normal materials
- **Interactive Controls**: Rotate, zoom, and pan with mouse/touch
- **Export**: Save current view as PNG image
- **Responsive**: Adapts to different screen sizes

## Customization

### Styling
Modify `STLViewer.css` to customize the appearance:
- Control panel positioning and styling
- Canvas border and shadows
- Button colors and hover effects

### Materials
Add custom materials by modifying the `materialsRef.current` object in the component:

```jsx
materialsRef.current = {
  matcap: new THREE.MeshMatcapMaterial({ matcap: matcapTexture, side: THREE.DoubleSide }),
  depth: new THREE.MeshDepthMaterial({ depthPacking: THREE.BasicDepthPacking, side: THREE.DoubleSide }),
  normal: new THREE.MeshNormalMaterial({ side: THREE.DoubleSide }),
  // Add your custom material here
  custom: new THREE.MeshStandardMaterial({ color: 0xff0000 })
};
```

### Default Model
To load a specific STL file by default, pass it as the `initialModel` prop or modify the `addDefaultCube()` function.

## Troubleshooting

### Texture Loading Issues
- Ensure texture files are in the `public/textures/matcaps/` folder
- Check browser console for 404 errors
- Verify file paths match the component expectations

### Performance Issues
- For large STL files, consider adding a loading indicator
- Implement file size limits if needed
- Use `useMemo` for expensive calculations if performance becomes an issue

### Memory Management
The component automatically disposes of geometries and materials when unmounted, but for memory-intensive applications, consider:
- Implementing geometry caching
- Adding cleanup for large models
- Using texture compression

## Integration Example

See `Example.jsx` for a complete implementation example showing:
- Basic usage
- Multiple viewers on the same page
- Different configurations

This component is fully self-contained and ready to use in any React application!
