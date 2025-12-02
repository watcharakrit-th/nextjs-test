"use client";

import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid, Stage, Text } from "@react-three/drei";
import * as THREE from "three";

// Define available models
type ModelType = "Cube" | "Sphere" | "Torus" | "Cone";

const MODELS: ModelType[] = ["Cube", "Sphere", "Torus", "Cone"];

const PrintingObject = ({
  type,
  progress,
}: {
  type: ModelType;
  progress: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Animate the printing effect (scaling up from bottom)
  useFrame(() => {
    if (meshRef.current) {
      // Scale Y based on progress (0 to 1)
      meshRef.current.scale.y = Math.max(0.01, progress);
      // Adjust position Y so it grows from the floor up
      // Default height is roughly 1 or 2 units depending on geometry
      // We want the bottom to stay at y=0.
      // If height is 2 (like sphere radius 1), center is at 0.
      // We need to shift it up by scale * height / 2?
      // Actually, easier to just position the mesh so its origin is at the bottom.
      // But standard geometries are centered.
      // Let's just move it up.
      // For a unit cube (size 1), center is 0. Bottom is -0.5.
      // If we scale Y, we want bottom to stay at 0.
      // New center Y = (original_center_y * scale) + (something to keep bottom fixed)
      // Easier approach: Put geometry in a group that is shifted up, or use geometry.translate
    }
  });

  // Material that looks like plastic filament
  const material = new THREE.MeshStandardMaterial({
    color: "#ff6600",
    roughness: 0.5,
    metalness: 0.1,
  });

  let geometry;
  switch (type) {
    case "Cube":
      geometry = <boxGeometry args={[1.5, 1.5, 1.5]} />;
      break;
    case "Sphere":
      geometry = <sphereGeometry args={[1, 32, 32]} />;
      break;
    case "Torus":
      geometry = <torusGeometry args={[0.8, 0.3, 16, 100]} />;
      break;
    case "Cone":
      geometry = <coneGeometry args={[1, 2, 32]} />;
      break;
  }

  return (
    <group position={[0, 0, 0]}>
      {/* Ghost/Wireframe of the full model to show what's coming */}
      <mesh position={[0, 1, 0]}>
        {geometry}
        <meshBasicMaterial color="#333" wireframe transparent opacity={0.1} />
      </mesh>

      {/* The actual printed part */}
      <mesh ref={meshRef} position={[0, (progress * 1.5) / 2, 0]} castShadow receiveShadow>
        {/* Note: Position calculation above is rough approximation. 
            For precise "growth from bottom", we'd ideally use a clipping plane.
            But scaling is simpler for this demo. 
            We need to adjust position Y to keep the bottom anchored.
            If we assume the object is roughly height 1.5 to 2.
         */}
         {/* Let's try a different trick: Use a clipping plane for a true "printing" effect */}
         {geometry}
         <meshStandardMaterial 
            color="#ff9900" 
            roughness={0.4}
            clippingPlanes={[new THREE.Plane(new THREE.Vector3(0, -1, 0), progress * 2)]}
            // The plane normal points down (0,-1,0). 
            // The constant moves the plane up/down.
            // Wait, standard clipping logic: renders only what is on the side of the normal.
            // We want to render everything BELOW a certain Y level.
            // So normal should be (0, -1, 0) -> points down.
            // Constant determines the plane position along the normal.
            // Let's re-think.
            // Plane: Ax + By + Cz + D = 0.
            // Point (x,y,z) is visible if Ax+By+Cz+D > 0.
            // We want visible if y < current_height.
            // So -y + current_height > 0  =>  -y > -current_height => y < current_height.
            // So Normal = (0, -1, 0). Constant = current_height.
         />
      </mesh>
      
      {/* Nozzle Head simulation */}
      <mesh position={[0, progress * 2 + 0.2, 0]} rotation={[Math.PI, 0, 0]}>
         <coneGeometry args={[0.1, 0.3, 16]} />
         <meshStandardMaterial color="#888" />
      </mesh>
    </group>
  );
};

// Wrapper to handle the clipping plane logic which needs access to the renderer
const PrinterScene = ({ model, progress }: { model: ModelType; progress: number }) => {
    // We need to enable local clipping on the renderer, but R3F does this by default usually?
    // Actually we need to set `localClippingEnabled = true` on the renderer.
    // We can do this in the <Canvas> onCreated prop.
    
    // Let's use a simpler scaling approach for robustness if clipping is tricky without setup.
    // But clipping is cooler. Let's try scaling first as fallback if I was unsure, 
    // but I'll go with a Clipping Plane approach because it's more "3D Printer" like.
    
    // Actually, let's stick to the Clipping Plane.
    // We need a plane that moves up from y=0 to y=2.
    
    const clipPlane = React.useMemo(() => {
        const plane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
        return plane;
    }, []);

    useFrame(() => {
        // Animate the plane constant
        // Max height approx 2
        clipPlane.constant = progress * 2.5; 
    });

    let geometry;
    switch (model) {
        case "Cube": geometry = <boxGeometry args={[1.5, 1.5, 1.5]} />; break;
        case "Sphere": geometry = <sphereGeometry args={[1, 32, 32]} />; break;
        case "Torus": geometry = <torusGeometry args={[0.8, 0.3, 16, 100]} />; break;
        case "Cone": geometry = <coneGeometry args={[1, 2, 32]} />; break;
    }

    return (
        <group>
            {/* The Object being printed */}
            <mesh position={[0, 1, 0]} castShadow receiveShadow>
                {geometry}
                <meshStandardMaterial 
                    color="#ff8800" 
                    roughness={0.2} 
                    metalness={0.5}
                    clippingPlanes={[clipPlane]}
                    clipShadows={true}
                    side={THREE.DoubleSide}
                />
            </mesh>
            
            {/* Cap/Fill for the cut surface (optional, complex to do perfectly without stencil buffer) */}
            {/* We'll skip the cap for now, standard clipping leaves it open which looks like infill :) */}

            {/* Nozzle */}
            <group position={[0.8 * Math.cos(Date.now() * 0.005), progress * 2.5, 0.8 * Math.sin(Date.now() * 0.005)]}>
                <mesh rotation={[Math.PI, 0, 0]}>
                    <coneGeometry args={[0.1, 0.4, 16]} />
                    <meshStandardMaterial color="#aaa" metalness={0.8} roughness={0.2} />
                </mesh>
                {/* Gantry / Rail visual (simplified) */}
                <mesh position={[0, 0.2, 0]}>
                    <boxGeometry args={[0.5, 0.1, 0.1]} />
                    <meshStandardMaterial color="#444" />
                </mesh>
            </group>
        </group>
    );
};

export default function Printer3D() {
  const [selectedModel, setSelectedModel] = useState<ModelType>("Cube");
  const [progress, setProgress] = useState(0);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPrinting) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 1) {
            setIsPrinting(false);
            return 1;
          }
          return prev + 0.005; // Printing speed
        });
      }, 16);
    }
    return () => clearInterval(interval);
  }, [isPrinting]);

  const handlePrint = (model: ModelType) => {
    setSelectedModel(model);
    setProgress(0);
    setIsPrinting(true);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-4xl mx-auto p-4 bg-stone-900/80 rounded-xl text-white backdrop-blur-md border border-stone-700">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-yellow-200 bg-clip-text text-transparent">
        3D Printer Simulation
      </h2>

      <div className="w-full h-[400px] bg-black/50 rounded-lg overflow-hidden relative border border-stone-800 shadow-inner">
        <Canvas
          shadows
          camera={{ position: [4, 4, 4], fov: 50 }}
          gl={{ localClippingEnabled: true }} // IMPORTANT for clipping planes
        >
          <color attach="background" args={["#1a1a1a"]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} castShadow />
          <spotLight
            position={[5, 10, 5]}
            angle={0.3}
            penumbra={1}
            intensity={2}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />

          <group position={[0, -1, 0]}>
             {/* Print Bed */}
            <Grid
              renderOrder={-1}
              position={[0, 0, 0]}
              infiniteGrid
              cellSize={0.5}
              sectionSize={2.5}
              fadeDistance={20}
              sectionColor="#444"
              cellColor="#222"
            />
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
                <planeGeometry args={[10, 10]} />
                <meshStandardMaterial color="#111" roughness={0.8} />
            </mesh>

            <PrinterScene model={selectedModel} progress={progress} />
          </group>

          <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
        </Canvas>
        
        {/* Overlay Stats */}
        <div className="absolute top-4 left-4 font-mono text-xs text-green-400 bg-black/70 p-2 rounded">
            <div>STATUS: {isPrinting ? "PRINTING..." : "READY"}</div>
            <div>TEMP: {isPrinting ? "210°C" : "25°C"}</div>
            <div>PROGRESS: {(progress * 100).toFixed(1)}%</div>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap justify-center">
        {MODELS.map((model) => (
          <button
            key={model}
            onClick={() => handlePrint(model)}
            disabled={isPrinting && selectedModel === model}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedModel === model
                ? "bg-orange-500 text-black shadow-[0_0_15px_rgba(249,115,22,0.5)]"
                : "bg-stone-700 hover:bg-stone-600 text-gray-200"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isPrinting && selectedModel === model ? "Printing..." : `Print ${model}`}
          </button>
        ))}
      </div>
    </div>
  );
}
