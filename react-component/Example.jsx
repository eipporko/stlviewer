import React from 'react';
import STLViewer from './STLViewer';

const App = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>My React App with STL Viewer</h1>
      
      {/* Basic usage */}
      <div style={{ marginBottom: '20px' }}>
        <h2>STL Viewer</h2>
        <STLViewer 
          width={800} 
          height={600} 
          showControls={true}
        />
      </div>

      {/* Multiple viewers */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div>
          <h3>Viewer 1</h3>
          <STLViewer 
            width={400} 
            height={300} 
            showControls={true}
          />
        </div>
        
        <div>
          <h3>Viewer 2 (No Controls)</h3>
          <STLViewer 
            width={400} 
            height={300} 
            showControls={false}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
