import type { JSX } from "react";
import { Canvas } from "@react-three/fiber";
import { RoundedBox, Edges, ContactShadows, OrbitControls, Box } from "@react-three/drei";

export default function Object3DTest(): JSX.Element {
    return (
        <Canvas
            shadows
            camera={{ position: [6, 6, 8], fov: 45 }}
            style={{ width: "100vw", height: "100vh" }}
        >
            <color attach="background" args={["#f5f6f8"]} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 8, 4]} intensity={0.8} castShadow />

            {/* Piso */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[40, 40]} />
                <meshStandardMaterial color="honeydew" flatShading />
            </mesh>

            {/* Sofá */}
            <group position={[-2, 0.6, 2]}>
                <RoundedBox args={[4.2, 1.2, 1.8]} radius={0.08} castShadow>
                    <meshStandardMaterial color="white" flatShading />
                </RoundedBox>
                <group position={[0, 0.2, 0]}>
                    {[-1, 0, 1].map((i) => (
                        <RoundedBox
                            key={i}
                            args={[1.2, 0.5, 1.5]}
                            radius={0.06}
                            position={[i * 1.35, 0.4, 0]}
                            castShadow
                        >
                            <meshToonMaterial color="skyblue" />
                        </RoundedBox>
                    ))}
                </group>
                <Edges />
            </group>

            {/* Mesa */}
            <RoundedBox position={[0, 0.35, 0]} args={[1.8, 0.4, 1]} radius={0.06} castShadow>
                <meshStandardMaterial color="white" flatShading />
            </RoundedBox>

            {/* Rack + TV */}
            <group position={[3.5, 0.5, -2]}>
                <RoundedBox args={[2.6, 0.8, 0.6]} radius={0.06} castShadow>
                    <meshStandardMaterial color="white" flatShading />
                </RoundedBox>
                {/* Pés do rack */}
                <group position={[0, -0.5, 0]}>
                    {[-1, 0, 1].map((i) => (
                        <Box key={i} position={[i * 1, 0.1, 0]} args={[0.03, 0.2, 0.5]} castShadow>
                            <meshStandardMaterial color="sienna" flatShading />
                        </Box>
                    ))}
                </group>
                {/* TV */}
                <mesh position={[0, 1, 0]} castShadow>
                    <boxGeometry args={[2, 1.2, 0.06]} />
                    <meshToonMaterial color="black" />
                    {/* TV Screen */}
                    <group>
                        <Box position={[0, 0, 0.03]} args={[1.9, 1.1, 0.01]}>
                            <meshStandardMaterial color="gray" flatShading />
                        </Box>
                    </group>
                    {/* Power LED Indicator at bottom right */}
                    <group>
                        {/* Green LED */}
                        <Box position={[0.97, -0.57, 0.03]} args={[0.03, 0.03, 0.01]}>
                            <meshStandardMaterial color="green" flatShading />
                        </Box>
                    </group>
                    <Edges color="#666" />
                </mesh>
            </group>

            <ContactShadows
                position={[0, 0.1, 0]}
                opacity={0.35}
                near={-0.1}
                scale={50}
                resolution={1024}
                blur={0.025}
            />
            <OrbitControls makeDefault screenSpacePanning={false} />
        </Canvas>
    );
}
