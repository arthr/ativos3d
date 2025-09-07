import type { JSX } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls, Grid } from "@react-three/drei";
import SofaModel from "@presentation/models/SofaModel";
import CoffeeTableModel from "@presentation/models/CoffeTableModel";
import RackWithTVModel from "@presentation/models/RackWithTVModel";
import OfficeDeskModel from "@presentation/models/OfficeDeskModel";
import OfficeChairModel from "@presentation/models/OfficeChairModel";

export default function Object3DTest(): JSX.Element {
    const gridSize: [number, number] = [40, 40];
    const gridConfig = {
        cellSize: 0.5,
        cellThickness: 1,
        cellColor: "#6f6f6f",
        sectionSize: 3,
        sectionThickness: 1.2,
        sectionColor: "#ddd",
        fadeDistance: 30,
        fadeStrength: 1,
        followCamera: false,
        infiniteGrid: false,
    };
    return (
        <Canvas
            shadows="soft"
            camera={{ position: [6, 6, 8], fov: 45 }}
            style={{ width: "100vw", height: "100vh" }}
        >
            <color attach="background" args={["#f5f6f8"]} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 8, 4]} intensity={0.8} castShadow />

            {/* Piso */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[40, 40]} />
                <meshToonMaterial color="honeydew" />
            </mesh>

            {/* POSIÇÕES PADRÃO (pivô no piso) */}
            <SofaModel position={[0, 0, 3]} scale={[0.6, 0.6, 0.6]} />
            <CoffeeTableModel position={[0, 0, 0]} />
            <RackWithTVModel position={[0, 0, -2]} />
            <OfficeDeskModel position={[0, 0, -4]} />
            <OfficeChairModel position={[0, 0, -6]} />

            <ContactShadows
                position={[0, 0.01, 0]}
                opacity={0.25}
                near={-0.1}
                scale={50}
                resolution={1024}
                blur={0.025}
            />
            <Grid position={[0, 0.01, 0]} args={gridSize} {...gridConfig} />
            <OrbitControls makeDefault screenSpacePanning={false} />
        </Canvas>
    );
}
