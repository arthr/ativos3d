import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Stage } from "../systems/render/Stage";
import { Grid } from "../systems/render/Grid";
import { ObjectsLayer } from "../systems/render/ObjectsLayer";
import { WallsLayer } from "../systems/render/WallsLayer";
import { FloorLayer } from "../systems/render/FloorLayer";
import { Hud } from "../ui/hud";
import { PlaceObjectTool } from "../systems/tools/PlaceObjectTool";
import { MoveRotateTool } from "../systems/tools/MoveRotateTool";
import { WallTool } from "../systems/tools/WallTool";
import { PaintFloorTool } from "../systems/tools/PaintFloorTool";
import { BulldozeTool } from "../systems/tools/BulldozeTool";
import { EyedropperTool } from "../systems/tools/EyedropperTool";

export function App() {
  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Canvas gl={{ antialias: true }} shadows dpr={[1, 2]}>
        <color attach="background" args={[0xf3f4f6]} />
        <Suspense fallback={null}>
          <Stage />
          <Grid />
          <FloorLayer />
          <WallsLayer />
          <ObjectsLayer />
          <PlaceObjectTool />
          <MoveRotateTool />
          <WallTool />
          <PaintFloorTool />
          <BulldozeTool />
          <EyedropperTool />
        </Suspense>
      </Canvas>
      <Hud />
    </div>
  );
}

export default App;
