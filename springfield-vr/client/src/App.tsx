/**
 * Springfield VR Client - Main App
 */

import React, { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { XR, VRButton } from '@react-three/xr';
import { useSpringfieldStore } from './store';
import { ProblemInput } from './components/ProblemInput';
import { VRScene } from './components/VRScene';
import { HUD } from './components/HUD';

export function App() {
  const { session, isLoading, error } = useSpringfieldStore();
  
  // Show problem input if no session
  if (!session) {
    return <ProblemInput />;
  }
  
  return (
    <>
      {/* VR Button */}
      <VRButton 
        className="vr-button"
        enterOnly={false}
        exitOnly={false}
      />
      
      {/* 3D Canvas with XR support */}
      <Canvas>
        <XR>
          <VRScene />
        </XR>
      </Canvas>
      
      {/* 2D HUD overlay */}
      <HUD />
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="loading-screen">
          <h1>🍩 Loading...</h1>
          <div className="loading-spinner"></div>
        </div>
      )}
      
      {/* Error display */}
      {error && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255,0,0,0.8)',
          color: 'white',
          padding: '1rem 2rem',
          borderRadius: '8px',
          zIndex: 1000
        }}>
          {error}
        </div>
      )}
    </>
  );
}
