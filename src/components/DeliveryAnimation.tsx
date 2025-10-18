import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

// Helper function to get position on sphere surface
function getPositionOnSphere(longitude: number, latitude: number, radius: number) {
  const phi = (90 - latitude) * (Math.PI / 180);
  const theta = (longitude + 180) * (Math.PI / 180);
  
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  
  return new THREE.Vector3(x, y, z);
}

// Helper to get surface normal at position
function getSurfaceNormal(position: THREE.Vector3) {
  return position.clone().normalize();
}

// Realistic Globe with latitude/longitude lines
function Globe() {
  const globeRef = useRef<THREE.Group>(null);
  const [time, setTime] = useState(0);
  
  useFrame((state, delta) => {
    setTime((t) => t + delta);
    if (globeRef.current) {
      // Slow rotation on tilted axis
      globeRef.current.rotation.y = time * 0.05;
    }
  });

  return (
    <group ref={globeRef} rotation={[0.2, 0, 0.1]}>
      {/* Main globe sphere */}
      <mesh>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshPhongMaterial 
          color="#1e40af"
          emissive="#0f172a"
          emissiveIntensity={0.15}
          shininess={60}
          specular="#60a5fa"
          transparent
          opacity={0.98}
        />
      </mesh>

      {/* Ocean gradient overlay */}
      <mesh>
        <sphereGeometry args={[2.51, 64, 64]} />
        <meshBasicMaterial 
          color="#3b82f6"
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Latitude lines (horizontal circles) */}
      {[-60, -30, 0, 30, 60].map((lat, i) => {
        const radius = 2.52;
        const y = Math.sin((lat * Math.PI) / 180) * radius;
        const circleRadius = Math.cos((lat * Math.PI) / 180) * radius;
        
        return (
          <mesh key={`lat-${i}`} rotation={[Math.PI / 2, 0, 0]} position={[0, y, 0]}>
            <torusGeometry args={[circleRadius, 0.004, 8, 64]} />
            <meshBasicMaterial color="#ffffff" opacity={0.25} transparent />
          </mesh>
        );
      })}

      {/* Longitude lines (vertical circles) */}
      {[0, 30, 60, 90, 120, 150].map((lon, i) => (
        <mesh key={`lon-${i}`} rotation={[0, (lon * Math.PI) / 180, 0]}>
          <torusGeometry args={[2.52, 0.004, 8, 64]} />
          <meshBasicMaterial color="#ffffff" opacity={0.25} transparent />
        </mesh>
      ))}

      {/* Simplified continents */}
      <Continents />

      {/* Subtle atmosphere glow */}
      <mesh>
        <sphereGeometry args={[2.65, 32, 32]} />
        <meshBasicMaterial
          color="#60a5fa"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

// Minimalistic continent shapes
function Continents() {
  const continents = [
    { lon: -100, lat: 45, scale: [0.7, 0.9, 0.05] }, // North America
    { lon: 15, lat: 50, scale: [1.1, 0.6, 0.05] }, // Europe
    { lon: 75, lat: 20, scale: [0.8, 0.7, 0.05] }, // Asia
    { lon: 20, lat: 0, scale: [0.6, 0.9, 0.05] }, // Africa
    { lon: -60, lat: -15, scale: [0.5, 0.8, 0.05] }, // South America
    { lon: 135, lat: -25, scale: [0.6, 0.5, 0.05] }, // Australia
  ];

  return (
    <group>
      {continents.map((continent, i) => {
        const pos = getPositionOnSphere(continent.lon, continent.lat, 2.53);
        const normal = getSurfaceNormal(pos);
        
        // Create rotation to align with surface
        const up = new THREE.Vector3(0, 1, 0);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(up, normal);
        const euler = new THREE.Euler().setFromQuaternion(quaternion);
        
        return (
          <mesh
            key={i}
            position={pos}
            rotation={[euler.x, euler.y, euler.z]}
          >
            <boxGeometry args={continent.scale as [number, number, number]} />
            <meshPhongMaterial 
              color="#0c4a6e"
              transparent
              opacity={0.5}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Airplane following great-circle path on globe
function Airplane({ onComplete }: { onComplete: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const [progress, setProgress] = useState(0);

  // Flight path coordinates
  const startLon = -100;
  const startLat = 40;
  const endLon = 15;
  const endLat = 50;

  useFrame((state, delta) => {
    const newProgress = progress + delta * 0.08;
    setProgress(newProgress);

    if (newProgress >= 1 && onComplete) {
      onComplete();
    }

    if (groupRef.current && newProgress < 1) {
      // Interpolate along great circle
      const lon = startLon + (endLon - startLon) * newProgress;
      const lat = startLat + (endLat - startLat) * newProgress + 
                  Math.sin(newProgress * Math.PI) * 8; // Arc over the globe
      
      const radius = 2.65;
      const position = getPositionOnSphere(lon, lat, radius);
      const normal = getSurfaceNormal(position);
      
      groupRef.current.position.copy(position);
      
      // Orient plane tangent to surface and facing direction of travel
      const nextLon = lon + 2;
      const nextLat = lat + (endLat - startLat) * 0.02;
      const nextPos = getPositionOnSphere(nextLon, nextLat, radius);
      const direction = nextPos.clone().sub(position).normalize();
      
      const up = normal;
      const right = new THREE.Vector3().crossVectors(up, direction).normalize();
      const forward = new THREE.Vector3().crossVectors(right, up).normalize();
      
      const matrix = new THREE.Matrix4();
      matrix.makeBasis(right, up, forward);
      groupRef.current.quaternion.setFromRotationMatrix(matrix);
    }
  });

  if (progress > 1) return null;

  return (
    <group ref={groupRef}>
      {/* Plane fuselage */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.06, 0.25, 8]} />
        <meshPhongMaterial color="#f97316" emissive="#ea580c" emissiveIntensity={0.4} />
      </mesh>
      {/* Wings */}
      <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.4, 0.02, 0.08]} />
        <meshPhongMaterial color="#fb923c" emissive="#f97316" emissiveIntensity={0.3} />
      </mesh>
      {/* Tail fin */}
      <mesh position={[-0.12, 0.05, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.02, 0.08, 0.06]} />
        <meshPhongMaterial color="#f97316" />
      </mesh>
      {/* Glow */}
      <pointLight color="#f97316" intensity={1.5} distance={1.2} />
    </group>
  );
}

// Flight path trail
function FlightPathTrail() {
  const startLon = -100;
  const startLat = 40;
  const endLon = 15;
  const endLat = 50;
  const points: THREE.Vector3[] = [];
  
  for (let i = 0; i <= 50; i++) {
    const t = i / 50;
    const lon = startLon + (endLon - startLon) * t;
    const lat = startLat + (endLat - startLat) * t + Math.sin(t * Math.PI) * 8;
    points.push(getPositionOnSphere(lon, lat, 2.58));
  }
  
  const curve = new THREE.CatmullRomCurve3(points);
  const tubeGeometry = new THREE.TubeGeometry(curve, 50, 0.008, 8, false);
  
  return (
    <mesh geometry={tubeGeometry}>
      <meshPhongMaterial 
        color="#60a5fa"
        transparent
        opacity={0.4}
        emissive="#3b82f6"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}

// 3D Warehouse on globe surface
function Warehouse({ visible }: { visible: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const lon = 15;
  const lat = 50;
  const radius = 2.5;

  useFrame(() => {
    if (groupRef.current) {
      const targetScale = visible ? 1 : 0;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  const position = getPositionOnSphere(lon, lat, radius);
  const normal = getSurfaceNormal(position);
  const up = new THREE.Vector3(0, 1, 0);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(up, normal);
  const euler = new THREE.Euler().setFromQuaternion(quaternion);

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={[euler.x, euler.y, euler.z]}
      scale={0}
    >
      {/* Building */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.3, 0.35, 0.35]} />
        <meshPhongMaterial color="#64748b" />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.32, 0.05, 0.37]} />
        <meshPhongMaterial color="#475569" />
      </mesh>
      {/* Entrance */}
      <mesh position={[0.16, 0.1, 0]}>
        <boxGeometry args={[0.02, 0.2, 0.15]} />
        <meshPhongMaterial color="#1e293b" />
      </mesh>
      {/* Location pin */}
      <mesh position={[0, 0.65, 0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshPhongMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <coneGeometry args={[0.035, 0.15, 8]} />
        <meshPhongMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.5} />
      </mesh>
      <pointLight color="#ef4444" intensity={0.8} distance={1} position={[0, 0.65, 0]} />
    </group>
  );
}

// Delivery truck path trail
function TruckPathTrail({ visible }: { visible: boolean }) {
  const startLon = 15;
  const startLat = 50;
  const endLon = -60;
  const endLat = -15;
  const points: THREE.Vector3[] = [];
  
  for (let i = 0; i <= 50; i++) {
    const t = i / 50;
    const lon = startLon + (endLon - startLon) * t;
    const lat = startLat + (endLat - startLat) * t + Math.sin(t * Math.PI) * 10;
    points.push(getPositionOnSphere(lon, lat, 2.58));
  }
  
  const curve = new THREE.CatmullRomCurve3(points);
  const tubeGeometry = new THREE.TubeGeometry(curve, 50, 0.008, 8, false);
  
  return (
    <mesh geometry={tubeGeometry}>
      <meshPhongMaterial 
        color="#fbbf24"
        transparent
        opacity={visible ? 0.4 : 0}
        emissive="#f59e0b"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}

// Delivery truck following surface
function DeliveryTruck({ active }: { active: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const [progress, setProgress] = useState(0);

  const startLon = 15;
  const startLat = 50;
  const endLon = -60;
  const endLat = -15;

  useFrame((state, delta) => {
    if (active) {
      setProgress((p) => Math.min(p + delta * 0.12, 1));
    } else {
      setProgress(0);
    }

    if (groupRef.current && active && progress < 1) {
      const lon = startLon + (endLon - startLon) * progress;
      const lat = startLat + (endLat - startLat) * progress + 
                  Math.sin(progress * Math.PI) * 10;
      
      const radius = 2.58;
      const position = getPositionOnSphere(lon, lat, radius);
      const normal = getSurfaceNormal(position);
      
      groupRef.current.position.copy(position);
      
      // Orient truck tangent to surface
      const nextLon = lon + 2;
      const nextLat = lat + (endLat - startLat) * 0.02;
      const nextPos = getPositionOnSphere(nextLon, nextLat, radius);
      const direction = nextPos.clone().sub(position).normalize();
      
      const up = normal;
      const right = new THREE.Vector3().crossVectors(up, direction).normalize();
      const forward = new THREE.Vector3().crossVectors(right, up).normalize();
      
      const matrix = new THREE.Matrix4();
      matrix.makeBasis(right, up, forward);
      groupRef.current.quaternion.setFromRotationMatrix(matrix);
      groupRef.current.rotateY(Math.PI / 2);
    }
  });

  if (!active) return null;

  return (
    <group ref={groupRef}>
      {/* Cabin */}
      <mesh position={[0.06, 0.05, 0]}>
        <boxGeometry args={[0.1, 0.1, 0.14]} />
        <meshPhongMaterial color="#f97316" />
      </mesh>
      {/* Cargo container */}
      <mesh position={[-0.08, 0.06, 0]}>
        <boxGeometry args={[0.16, 0.12, 0.14]} />
        <meshPhongMaterial color="#fb923c" />
      </mesh>
      {/* Wheels */}
      <mesh position={[0.04, -0.02, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.02, 12]} />
        <meshPhongMaterial color="#1f2937" />
      </mesh>
      <mesh position={[0.04, -0.02, -0.08]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.02, 12]} />
        <meshPhongMaterial color="#1f2937" />
      </mesh>
      <mesh position={[-0.1, -0.02, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.02, 12]} />
        <meshPhongMaterial color="#1f2937" />
      </mesh>
      <mesh position={[-0.1, -0.02, -0.08]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.02, 12]} />
        <meshPhongMaterial color="#1f2937" />
      </mesh>
      {/* Headlights glow */}
      <pointLight color="#fbbf24" intensity={0.8} distance={0.8} position={[0.12, 0, 0]} />
    </group>
  );
}

// 3D House at destination
function House({ visible }: { visible: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const lon = -60;
  const lat = -15;
  const radius = 2.5;

  useFrame(() => {
    if (groupRef.current) {
      const targetScale = visible ? 1 : 0.3;
      const currentScale = groupRef.current.scale.x;
      groupRef.current.scale.setScalar(
        THREE.MathUtils.lerp(currentScale, targetScale, 0.1)
      );
    }
  });

  const position = getPositionOnSphere(lon, lat, radius);
  const normal = getSurfaceNormal(position);
  const up = new THREE.Vector3(0, 1, 0);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(up, normal);
  const euler = new THREE.Euler().setFromQuaternion(quaternion);

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={[euler.x, euler.y, euler.z]}
      scale={0.3}
    >
      {/* House walls */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.3, 0.3, 0.28]} />
        <meshPhongMaterial color="#e5e7eb" />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 0.35, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.22, 0.2, 4]} />
        <meshPhongMaterial color="#3b82f6" />
      </mesh>
      {/* Door */}
      <mesh position={[0.16, 0.08, 0]}>
        <boxGeometry args={[0.02, 0.15, 0.1]} />
        <meshPhongMaterial color="#f97316" />
      </mesh>
      {/* Windows */}
      <mesh position={[0.16, 0.18, 0.08]}>
        <boxGeometry args={[0.02, 0.06, 0.06]} />
        <meshPhongMaterial 
          color="#93c5fd"
          emissive="#3b82f6"
          emissiveIntensity={0.3}
        />
      </mesh>
      <mesh position={[0.16, 0.18, -0.08]}>
        <boxGeometry args={[0.02, 0.06, 0.06]} />
        <meshPhongMaterial 
          color="#93c5fd"
          emissive="#3b82f6"
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Chimney */}
      <mesh position={[0.08, 0.42, -0.08]}>
        <boxGeometry args={[0.04, 0.1, 0.04]} />
        <meshPhongMaterial color="#dc2626" />
      </mesh>
    </group>
  );
}

// Cinematic camera controller
function CameraController({ phase }: { phase: number }) {
  useFrame((state) => {
    const camera = state.camera;
    const t = state.clock.elapsedTime * 0.15;

    if (phase === 0) {
      // Initial view - front angle
      camera.position.x = Math.sin(t) * 0.5;
      camera.position.y = 2.5 + Math.sin(t * 0.8) * 0.3;
      camera.position.z = 7;
    } else if (phase === 1) {
      // Following plane - orbit view
      const angle = t * 0.8;
      camera.position.x = Math.cos(angle) * 5;
      camera.position.y = 2.8 + Math.sin(t * 0.5) * 0.4;
      camera.position.z = Math.sin(angle) * 5;
    } else if (phase === 2) {
      // Warehouse approach - closer view
      camera.position.x = 3 + Math.sin(t * 0.5) * 0.5;
      camera.position.y = 2.2;
      camera.position.z = 5 + Math.cos(t * 0.5) * 0.5;
    } else {
      // Truck journey - following orbit
      const angle = t * 0.6 + Math.PI;
      camera.position.x = Math.cos(angle) * 5.5;
      camera.position.y = 2 + Math.sin(t * 0.6) * 0.5;
      camera.position.z = Math.sin(angle) * 5.5;
    }

    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Main animation component
const DeliveryAnimation = () => {
  const [phase, setPhase] = useState(0);
  const [showWarehouse, setShowWarehouse] = useState(false);
  const [truckActive, setTruckActive] = useState(false);
  const [showHouse, setShowHouse] = useState(true);

  useEffect(() => {
    // Phase 0: Plane appears and flies (0-8s)
    const phase1Timer = setTimeout(() => {
      setPhase(1);
      setShowWarehouse(true);
    }, 8000);

    // Phase 2: Warehouse visible, truck starts (8-9s)
    const phase2Timer = setTimeout(() => {
      setPhase(2);
      setTruckActive(true);
    }, 9000);

    // Phase 3: Truck journey (9-18s)
    const phase3Timer = setTimeout(() => {
      setPhase(3);
    }, 12000);

    // Reset loop (18s)
    const resetTimer = setTimeout(() => {
      setPhase(0);
      setShowWarehouse(false);
      setTruckActive(false);
    }, 20000);

    return () => {
      clearTimeout(phase1Timer);
      clearTimeout(phase2Timer);
      clearTimeout(phase3Timer);
      clearTimeout(resetTimer);
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [0, 2.5, 7], fov: 40 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        {/* Premium lighting setup */}
        <ambientLight intensity={0.3} />
        <directionalLight 
          position={[8, 6, 5]} 
          intensity={1.2} 
          color="#ffffff"
          castShadow
        />
        <directionalLight 
          position={[-5, 3, -4]} 
          intensity={0.4} 
          color="#3b82f6"
        />
        <hemisphereLight 
          color="#60a5fa" 
          groundColor="#1e40af" 
          intensity={0.5}
        />
        
        {/* Scene elements */}
        <Globe />
        <FlightPathTrail />
        <TruckPathTrail visible={truckActive} />
        {phase === 0 && <Airplane onComplete={() => setShowWarehouse(true)} />}
        <Warehouse visible={showWarehouse} />
        <DeliveryTruck active={truckActive} />
        <House visible={showHouse} />
        
        {/* Cinematic camera */}
        <CameraController phase={phase} />
      </Canvas>
      
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none -z-10" />
    </div>
  );
};

export default DeliveryAnimation;
