import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Stage } from "../systems/render/Stage";
import { Grid } from "../systems/render/Grid";
import { ObjectsLayer } from "../systems/render/ObjectsLayer";
import { WallsLayer } from "../systems/render/WallsLayer";
import { FloorLayer } from "../systems/render/FloorLayer";
import { Hud } from "../ui/hud";
import { ToolManager } from "../systems/tools/ToolManager";
import { createPlaceStrategy } from "../systems/tools/strategies/PlaceStrategy";
import { createMoveStrategy } from "../systems/tools/strategies/MoveStrategy";
import { createWallStrategy } from "../systems/tools/strategies/WallStrategy";
import { createFloorStrategy } from "../systems/tools/strategies/FloorStrategy";
import { createBulldozeStrategy } from "../systems/tools/strategies/BulldozeStrategy";
import { createEyedropperStrategy } from "../systems/tools/strategies/EyedropperStrategy";

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
          <ToolManager
            strategies={{
              place: (ctx) => createPlaceStrategy(ctx),
              move: (ctx) => createMoveStrategy(ctx),
              wall: (ctx) => createWallStrategy(ctx),
              floor: (ctx) => createFloorStrategy(ctx),
              bulldoze: (ctx) => createBulldozeStrategy(ctx),
              eyedropper: (ctx) => createEyedropperStrategy(ctx),
            }}
          />
        </Suspense>
      </Canvas>
      <Hud />
    </div>
  );
}

export default App;
