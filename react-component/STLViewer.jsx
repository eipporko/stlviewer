import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import './STLViewer.css';

const STLViewer = ({ 
  width = 800, 
  height = 600, 
  showControls = true,
  initialModel = null 
}) => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const meshRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const [materialType, setMaterialType] = useState('matcap');
  const [isLoading, setIsLoading] = useState(false);

  // Materials setup
  const materialsRef = useRef({});
  const textureLoaderRef = useRef(new THREE.TextureLoader());
  const stlLoaderRef = useRef(new STLLoader());

  useEffect(() => {
    // Initialize materials
    const matcapTexture = textureLoaderRef.current.load('/textures/matcaps/312D20_80675C_8B8C8B_85848C-256px.png');
    materialsRef.current = {
      matcap: new THREE.MeshMatcapMaterial({ matcap: matcapTexture, side: THREE.DoubleSide }),
      depth: new THREE.MeshDepthMaterial({ depthPacking: THREE.BasicDepthPacking, side: THREE.DoubleSide }),
      normal: new THREE.MeshNormalMaterial({ side: THREE.DoubleSide })
    };

    // Initialize Three.js scene
    initializeScene();
    
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(width, height);
        rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      }
    };

    window.addEventListener('resize', handleResize);

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [width, height]);

  const initializeScene = () => {
    sceneRef.current = new THREE.Scene();
    sceneRef.current.background = new THREE.Color(0xffffff);

    cameraRef.current = new THREE.PerspectiveCamera(75, width / height, 0.5, 10);
    cameraRef.current.position.set(1.5, 1.5, 1.5);
    sceneRef.current.add(cameraRef.current);

    rendererRef.current = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true
    });
    rendererRef.current.setSize(width, height);
    rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    controlsRef.current = new OrbitControls(cameraRef.current, canvasRef.current);
    controlsRef.current.enableDamping = true;

    addDefaultCube();
  };

  const addDefaultCube = () => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    meshRef.current = new THREE.Mesh(geometry, materialsRef.current.matcap);
    sceneRef.current.add(meshRef.current);
  };

  const adjustCameraToGeometry = (geometry) => {
    geometry.computeBoundingBox();
    const boundingBox = geometry.boundingBox;
    const center = new THREE.Vector3();
    boundingBox.getCenter(center);
    const size = new THREE.Vector3();
    boundingBox.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = cameraRef.current.fov * (Math.PI / 180);
    const cameraZ = Math.abs(maxDim / (2 * Math.tan(fov / 2)));
    const near = cameraZ - maxDim;
    const far = cameraZ + maxDim;

    cameraRef.current.position.set(center.x, center.y, cameraZ + center.z);
    cameraRef.current.near = Math.max(0.5, near);
    cameraRef.current.far = far;
    cameraRef.current.updateProjectionMatrix();

    controlsRef.current.target.copy(center);
    controlsRef.current.update();
  };

  const loadSTLFile = (file) => {
    if (!file) return;
    
    setIsLoading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        // Clear existing mesh
        if (meshRef.current) {
          sceneRef.current.remove(meshRef.current);
          meshRef.current.geometry.dispose();
        }

        // Load new geometry
        const geometry = stlLoaderRef.current.parse(e.target.result);
        geometry.computeBoundingBox();
        
        // Center the geometry
        const boundingBox = geometry.boundingBox;
        const center = new THREE.Vector3();
        boundingBox.getCenter(center);
        geometry.translate(-center.x, -center.y, -center.z);
        geometry.rotateX(-Math.PI / 2);

        // Create new mesh
        meshRef.current = new THREE.Mesh(geometry, materialsRef.current[materialType]);
        sceneRef.current.add(meshRef.current);

        adjustCameraToGeometry(geometry);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading STL file:', error);
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      console.error('Error reading file');
      setIsLoading(false);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.name.toLowerCase().endsWith('.stl')) {
      loadSTLFile(file);
    } else {
      alert('Please select a valid STL file');
    }
  };

  const handleMaterialChange = (newMaterial) => {
    setMaterialType(newMaterial);
    if (meshRef.current && materialsRef.current[newMaterial]) {
      meshRef.current.material = materialsRef.current[newMaterial];
      
      const backgroundColors = {
        matcap: 0xffffff,
        depth: 0x000000,
        normal: 0xffffff
      };
      sceneRef.current.background = new THREE.Color(backgroundColors[newMaterial] || 0xffffff);
    }
  };

  const exportToPNG = () => {
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      const link = document.createElement('a');
      link.download = `model_${materialType}.png`;
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
    }
  };

  const animate = () => {
    if (controlsRef.current) {
      controlsRef.current.update();
    }
    
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
    
    requestAnimationFrame(animate);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="stl-viewer-container">
      <canvas 
        ref={canvasRef} 
        className="stl-viewer-canvas"
        style={{ width, height }}
      />
      
      {showControls && (
        <div className="stl-viewer-controls">
          <div className="control-group">
            <button 
              onClick={triggerFileInput}
              disabled={isLoading}
              className="load-button"
            >
              {isLoading ? 'Loading...' : 'Load STL File'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".stl"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>

          <div className="control-group">
            <label>Material:</label>
            <select 
              value={materialType} 
              onChange={(e) => handleMaterialChange(e.target.value)}
              className="material-select"
            >
              <option value="matcap">Matcap</option>
              <option value="depth">Depth</option>
              <option value="normal">Normal</option>
            </select>
          </div>

          <div className="control-group">
            <button onClick={exportToPNG} className="export-button">
              Export PNG
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default STLViewer;
