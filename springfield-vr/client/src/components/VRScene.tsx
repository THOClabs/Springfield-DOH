/**
 * VR Scene Component
 * The 3D environment rendered in WebXR
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { 
  Environment, 
  Sky, 
  Text, 
  useTexture,
  Float,
  Sparkles
} from '@react-three/drei';
import { useXR, Interactive } from '@react-three/xr';
import * as THREE from 'three';
import { useSpringfieldStore } from '../store';

// Scene configurations
const SCENE_CONFIGS: Record<string, {
  skyColor: string;
  groundColor: string;
  ambientColor: string;
  fogColor: string;
}> = {
  'simpson-living-room': {
    skyColor: '#87CEEB',
    groundColor: '#8B4513',
    ambientColor: '#FFF8DC',
    fogColor: '#FFE4C4'
  },
  'frinks-lab': {
    skyColor: '#1a1a2e',
    groundColor: '#2d2d44',
    ambientColor: '#00ff88',
    fogColor: '#1a1a2e'
  },
  'burns-office': {
    skyColor: '#2d2d44',
    groundColor: '#4a3728',
    ambientColor: '#ffd700',
    fogColor: '#2d2d44'
  },
  'elementary-playground': {
    skyColor: '#87CEEB',
    groundColor: '#228B22',
    ambientColor: '#FFFACD',
    fogColor: '#87CEEB'
  },
  'moes-tavern': {
    skyColor: '#1a1a1a',
    groundColor: '#3d2817',
    ambientColor: '#ff6600',
    fogColor: '#1a1a1a'
  },
  default: {
    skyColor: '#87CEEB',
    groundColor: '#90EE90',
    ambientColor: '#FFFFFF',
    fogColor: '#87CEEB'
  }
};

// Character placeholder component
function Character({ name, position }: { name: string; position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Character colors (Simpsons yellow for Simpsons family)
  const characterColors: Record<string, string> = {
    homer: '#FFD90F',
    marge: '#FFD90F',
    bart: '#FFD90F',
    lisa: '#FFD90F',
    maggie: '#FFD90F',
    burns: '#E8E8E8',
    frink: '#90EE90',
    moe: '#DEB887',
    ralph: '#FFD90F',
    default: '#4169E1'
  };
  
  const color = characterColors[name] || characterColors.default;
  
  // Gentle floating animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });
  
  return (
    <group position={position}>
      {/* Character body (simplified) */}
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh ref={meshRef}>
          <capsuleGeometry args={[0.3, 0.8, 4, 8]} />
          <meshStandardMaterial color={color} />
        </mesh>
        
        {/* Name label */}
        <Text
          position={[0, 1.2, 0]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </Text>
      </Float>
      
      {/* Interaction sparkles */}
      <Sparkles
        count={20}
        scale={1.5}
        size={2}
        speed={0.3}
        color={color}
      />
    </group>
  );
}

// Ground plane
function Ground({ color }: { color: string }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

// Scene title display
function SceneTitle({ title, narrative }: { title: string; narrative: string }) {
  return (
    <group position={[0, 3, -5]}>
      <Text
        fontSize={0.4}
        color="#ffd700"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {title}
      </Text>
      <Text
        position={[0, -0.5, 0]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={6}
      >
        {narrative}
      </Text>
    </group>
  );
}

// Main VR Scene
export function VRScene() {
  const { currentScene, currentCharacter, session } = useSpringfieldStore();
  const { isPresenting } = useXR();
  
  // Get scene config
  const sceneConfig = useMemo(() => {
    if (!currentScene) return SCENE_CONFIGS.default;
    return SCENE_CONFIGS[currentScene.scene] || SCENE_CONFIGS.default;
  }, [currentScene]);
  
  // Character positions in scene
  const characterPositions: [number, number, number][] = [
    [0, 0, -3],
    [-2, 0, -4],
    [2, 0, -4],
    [-3, 0, -5],
    [3, 0, -5]
  ];
  
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} color={sceneConfig.ambientColor} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 5, 0]} intensity={0.5} color={sceneConfig.ambientColor} />
      
      {/* Sky */}
      <Sky 
        sunPosition={[100, 20, 100]} 
        turbidity={8}
        rayleigh={2}
      />
      
      {/* Fog */}
      <fog attach="fog" args={[sceneConfig.fogColor, 10, 50]} />
      
      {/* Ground */}
      <Ground color={sceneConfig.groundColor} />
      
      {/* Scene Title */}
      {currentScene && (
        <SceneTitle 
          title={session?.episode.title || 'Springfield VR'} 
          narrative={currentScene.narrative}
        />
      )}
      
      {/* Characters in scene */}
      {currentScene?.characters.map((characterId, index) => (
        <Character
          key={characterId}
          name={characterId}
          position={characterPositions[index] || [0, 0, -3]}
        />
      ))}
      
      {/* Current character highlighted */}
      {currentCharacter && (
        <group position={[0, 0, -2]}>
          <Sparkles
            count={50}
            scale={3}
            size={4}
            speed={0.5}
            color="#ffd700"
          />
        </group>
      )}
      
      {/* VR-specific adjustments */}
      {isPresenting && (
        <>
          {/* Adjust for VR scale */}
          <group scale={1.2}>
            {/* VR-specific UI elements would go here */}
          </group>
        </>
      )}
    </>
  );
}
