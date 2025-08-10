import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { StageLayer } from "../systems/render/StageLayer";
import { GridLayer } from "../systems/render/GridLayer";
import { ObjectsLayer } from "../systems/render/ObjectsLayer";
import { WallsLayer } from "../systems/render/WallsLayer";
import { FloorLayer } from "../systems/render/FloorLayer";
import { HudRoot } from "../ui/hud";
import { ToolManager } from "../systems/tools/ToolManager";
import { createPlaceStrategy } from "../systems/tools/strategies/PlaceStrategy";
import { createMoveStrategy } from "../systems/tools/strategies/MoveStrategy";
import { createWallStrategy } from "../systems/tools/strategies/WallStrategy";
import { createFloorStrategy } from "../systems/tools/strategies/FloorStrategy";
import { createBulldozeStrategy } from "../systems/tools/strategies/BulldozeStrategy";
import { createEyedropperStrategy } from "../systems/tools/strategies/EyedropperStrategy";
import { SelectedInspector } from "../ui/inworld/Inspector";
import { InputController } from "../systems/controllers/InputController";
import { Perf } from "r3f-perf";

export function App() {
  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Canvas gl={{ antialias: true }} shadows dpr={[1, 2]} linear={true}>
        <color attach="background" args={[0xf3f4f6]} />
        <Suspense fallback={null}>
          {/* Debug: Performance monitor */}
          <Perf position="top-left" style={{ zIndex: 1000, marginTop: 90 }} />

          {/* Mediator de input: único por Canvas/App */}
          <InputController />
          <StageLayer />
          <GridLayer />
          <FloorLayer />
          <WallsLayer />
          <ObjectsLayer />
          <SelectedInspector />
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
      <HudRoot />
    </div>
  );
}

export default App;
