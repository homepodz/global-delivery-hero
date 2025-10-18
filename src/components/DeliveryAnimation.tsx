import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Sphere, useTexture } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

// Globe component with realistic lighting
function Globe() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[2.5, 64, 64]} />
      <meshPhongMaterial 
        color="#3b82f6"
        emissive="#1e40af"
        emissiveIntensity={0.2}
        shininess={30}
        opacity={0.95}
        transparent
      />
      {/* Latitude lines */}
      <mesh>
        <torusGeometry args={[2.5, 0.005, 16, 100]} />
        <meshBasicMaterial color="#60a5fa" opacity={0.3} transparent />
      </mesh>
      <mesh rotation={[Math.PI / 6, 0, 0]}>
        <torusGeometry args={[2.5, 0.005, 16, 100]} />
        <meshBasicMaterial color="#60a5fa" opacity={0.3} transparent />
      </mesh>
      <mesh rotation={[-Math.PI / 6, 0, 0]}>
        <torusGeometry args={[2.5, 0.005, 16, 100]} />
        <meshBasicMaterial color="#60a5fa" opacity={0.3} transparent />
      </mesh>
      {/* Add minimalistic continents */}
      <Continents />
    </mesh>
  );
}

// Simplified continent shapes
function Continents() {
  return (
    <group>
      {/* North America-like shape */}
      <mesh position={[-0.8, 1.2, 1.8]} rotation={[0.3, 0.5, 0]}>
        <boxGeometry args={[0.6, 0.8, 0.1]} />
        <meshPhongMaterial color="#1e3a8a" opacity={0.4} transparent />
      </mesh>
      {/* Europe/Asia-like shape */}
      <mesh position={[1.2, 0.8, 1.5]} rotation={[0.2, -0.3, 0]}>
        <boxGeometry args={[1.2, 0.5, 0.1]} />
        <meshPhongMaterial color="#1e3a8a" opacity={0.4} transparent />
      </mesh>
      {/* South America-like shape */}
      <mesh position={[-0.5, -1.0, 2.0]} rotation={[-0.4, 0.2, 0]}>
        <boxGeometry args={[0.4, 0.7, 0.1]} />
        <meshPhongMaterial color="#1e3a8a" opacity={0.4} transparent />
      </mesh>
      {/* Africa-like shape */}
      <mesh position={[0.6, -0.3, 2.2]} rotation={[0.1, -0.1, 0]}>
        <boxGeometry args={[0.7, 0.9, 0.1]} />
        <meshPhongMaterial color="#1e3a8a" opacity={0.4} transparent />
      </mesh>
    </group>
  );
}

// Airplane following a curved path on globe
function Airplane() {
  const meshRef = useRef<THREE.Group>(null);
  const [progress, setProgress] = useState(0);

  useFrame((state, delta) => {
    setProgress((prev) => (prev + delta * 0.08) % 1);
    
    if (meshRef.current) {
      // Calculate position on globe surface along great circle
      const angle = progress * Math.PI * 1.5; // 270 degrees
      const radius = 2.6;
      
      // Start from one side, curve around to destination
      const x = Math.cos(angle) * radius * Math.cos(progress * Math.PI * 0.5);
      const y = Math.sin(progress * Math.PI * 0.5) * radius * 0.8;
      const z = Math.sin(angle) * radius * Math.cos(progress * Math.PI * 0.5);
      
      meshRef.current.position.set(x, y, z);
      
      // Rotate to follow path direction
      meshRef.current.lookAt(
        Math.cos(angle + 0.1) * radius,
        y + 0.1,
        Math.sin(angle + 0.1) * radius
      );
    }
  });

  return (
    <group ref={meshRef}>
      {/* Airplane body */}
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <coneGeometry args={[0.08, 0.25, 8]} />
        <meshPhongMaterial color="#f97316" emissive="#ea580c" emissiveIntensity={0.5} />
      </mesh>
      {/* Wings */}
      <mesh position={[-0.05, 0, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.08, 0.02, 0.35]} />
        <meshPhongMaterial color="#f97316" emissive="#ea580c" emissiveIntensity={0.3} />
      </mesh>
      {/* Tail */}
      <mesh position={[-0.15, 0.05, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.08, 0.12, 0.02]} />
        <meshPhongMaterial color="#f97316" emissive="#ea580c" emissiveIntensity={0.3} />
      </mesh>
      {/* Glow effect */}
      <pointLight color="#f97316" intensity={0.8} distance={1} />
    </group>
  );
}

// 3D Warehouse that appears at destination
function Warehouse() {
  const meshRef = useRef<THREE.Group>(null);
  const [visible, setVisible] = useState(false);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(true);
      setScale(1);
      setTimeout(() => {
        setScale(0);
        setTimeout(() => setVisible(false), 500);
      }, 4000);
    }, 12000);
    
    setTimeout(() => {
      setVisible(true);
      setScale(1);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, visible ? scale : 0, 0.1));
    }
  });

  return (
    <group ref={meshRef} position={[2.0, 0.5, 1.5]}>
      {/* Warehouse building */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.4, 0.3, 0.35]} />
        <meshPhongMaterial color="#6b7280" />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 0.35, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.28, 0.15, 4]} />
        <meshPhongMaterial color="#4b5563" />
      </mesh>
      {/* Door */}
      <mesh position={[0.21, 0.05, 0]}>
        <boxGeometry args={[0.02, 0.15, 0.12]} />
        <meshPhongMaterial color="#1f2937" />
      </mesh>
      {/* Location pin above warehouse */}
      <mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshPhongMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <coneGeometry args={[0.04, 0.12, 8]} />
        <meshPhongMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

// Delivery truck traveling on globe surface
function DeliveryTruck() {
  const meshRef = useRef<THREE.Group>(null);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive(true);
      setProgress(0);
      setTimeout(() => setActive(false), 4000);
    }, 12000);
    
    setTimeout(() => {
      setActive(true);
      setProgress(0);
    }, 8500);

    return () => clearInterval(interval);
  }, []);

  useFrame((state, delta) => {
    if (active) {
      setProgress((prev) => Math.min(prev + delta * 0.15, 1));
    }
    
    if (meshRef.current && active) {
      // Path from warehouse to house on globe surface
      const startAngle = 0.3;
      const endAngle = -0.8;
      const angle = startAngle + (endAngle - startAngle) * progress;
      const radius = 2.65;
      
      const x = Math.cos(angle) * radius * 1.5;
      const y = 0.3 + Math.sin(progress * Math.PI) * 0.3;
      const z = Math.sin(angle) * radius;
      
      meshRef.current.position.set(x, y, z);
      meshRef.current.rotation.y = -angle + Math.PI / 2;
      
      // Scale based on perspective
      const perspectiveScale = 0.8 + Math.sin(progress * Math.PI) * 0.2;
      meshRef.current.scale.setScalar(perspectiveScale);
    }
  });

  if (!active && progress === 0) return null;

  return (
    <group ref={meshRef}>
      {/* Truck cabin */}
      <mesh position={[0.08, 0.08, 0]}>
        <boxGeometry args={[0.12, 0.12, 0.16]} />
        <meshPhongMaterial color="#f97316" />
      </mesh>
      {/* Truck cargo */}
      <mesh position={[-0.08, 0.08, 0]}>
        <boxGeometry args={[0.15, 0.12, 0.16]} />
        <meshPhongMaterial color="#fb923c" />
      </mesh>
      {/* Wheels */}
      <mesh position={[0.05, 0, 0.09]}>
        <cylinderGeometry args={[0.04, 0.04, 0.03, 16]} />
        <meshPhongMaterial color="#1f2937" />
      </mesh>
      <mesh position={[0.05, 0, -0.09]}>
        <cylinderGeometry args={[0.04, 0.04, 0.03, 16]} />
        <meshPhongMaterial color="#1f2937" />
      </mesh>
      <mesh position={[-0.1, 0, 0.09]}>
        <cylinderGeometry args={[0.04, 0.04, 0.03, 16]} />
        <meshPhongMaterial color="#1f2937" />
      </mesh>
      <mesh position={[-0.1, 0, -0.09]}>
        <cylinderGeometry args={[0.04, 0.04, 0.03, 16]} />
        <meshPhongMaterial color="#1f2937" />
      </mesh>
      <pointLight color="#f97316" intensity={0.5} distance={0.8} />
    </group>
  );
}

// 3D House at final destination
function House() {
  const meshRef = useRef<THREE.Group>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(true);
    }, 12000);
    
    setTimeout(() => setVisible(true), 8000);

    return () => clearInterval(interval);
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(
        THREE.MathUtils.lerp(meshRef.current.scale.x, visible ? 1 : 0, 0.1)
      );
    }
  });

  return (
    <group ref={meshRef} position={[-2.2, 0.3, 1.8]} scale={0}>
      {/* House base */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[0.35, 0.25, 0.3]} />
        <meshPhongMaterial color="#e5e7eb" />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 0.32, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.25, 0.18, 4]} />
        <meshPhongMaterial color="#3b82f6" />
      </mesh>
      {/* Door */}
      <mesh position={[0.18, 0.08, 0]}>
        <boxGeometry args={[0.02, 0.12, 0.08]} />
        <meshPhongMaterial color="#f97316" />
      </mesh>
      {/* Windows */}
      <mesh position={[0.18, 0.15, 0.08]}>
        <boxGeometry args={[0.02, 0.05, 0.05]} />
        <meshPhongMaterial color="#93c5fd" emissive="#3b82f6" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0.18, 0.15, -0.08]}>
        <boxGeometry args={[0.02, 0.05, 0.05]} />
        <meshPhongMaterial color="#93c5fd" emissive="#3b82f6" emissiveIntensity={0.3} />
      </mesh>
      {/* Chimney */}
      <mesh position={[0.08, 0.38, -0.08]}>
        <boxGeometry args={[0.05, 0.12, 0.05]} />
        <meshPhongMaterial color="#ef4444" />
      </mesh>
    </group>
  );
}

// Floating packages around the scene
function FloatingPackages() {
  return (
    <group>
      <FloatingPackage position={[-1.5, 2, 1]} delay={0} />
      <FloatingPackage position={[2, 1.5, -1]} delay={0.5} />
      <FloatingPackage position={[1, -2, 1.5]} delay={1} />
      <FloatingPackage position={[-2, -1, -1.5]} delay={1.5} />
    </group>
  );
}

function FloatingPackage({ position, delay }: { position: [number, number, number]; delay: number }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + delay) * 0.2;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      <mesh>
        <boxGeometry args={[0.15, 0.15, 0.15]} />
        <meshPhongMaterial color="#d97706" />
      </mesh>
      {/* Package tape */}
      <mesh>
        <boxGeometry args={[0.16, 0.03, 0.16]} />
        <meshPhongMaterial color="#fbbf24" />
      </mesh>
    </group>
  );
}

// Camera animation
function CameraController() {
  const [phase, setPhase] = useState(0);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    // Cinematic camera movement
    state.camera.position.x = Math.sin(t * 0.1) * 1.5;
    state.camera.position.y = 2 + Math.sin(t * 0.15) * 0.5;
    state.camera.position.z = 6 + Math.cos(t * 0.1) * 0.5;
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

const DeliveryAnimation = () => {
  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [0, 2, 6], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        {/* Lighting setup for premium look */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
        <directionalLight position={[-3, 3, -3]} intensity={0.4} color="#3b82f6" />
        <pointLight position={[0, 0, 0]} intensity={0.5} color="#60a5fa" />
        
        {/* Main 3D scene elements */}
        <Globe />
        <Airplane />
        <Warehouse />
        <DeliveryTruck />
        <House />
        <FloatingPackages />
        
        {/* Camera animation */}
        <CameraController />
        
        {/* Subtle fog for depth */}
        <fog attach="fog" args={['#f8fafc', 8, 15]} />
      </Canvas>
      
      {/* Subtle glow effect behind globe */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

export default DeliveryAnimation;
