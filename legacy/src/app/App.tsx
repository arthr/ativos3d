import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { StageLayer } from "../systems/render/StageLayer";
import { GridLayer } from "../systems/render/GridLayer";
import { ObjectsLayer } from "../systems/render/ObjectsLayer";
import { WallsLayer } from "../systems/render/WallsLayer";
import { FloorLayer } from "../systems/render/FloorLayer";
import { HudRoot } from "../ui/hud";
import { ToolManager } from "../systems/tools/ToolManager";
import { PlaceStrategy } from "../systems/tools/strategies/PlaceStrategy";
import { MoveStrategy } from "../systems/tools/strategies/MoveStrategy";
import { WallStrategy } from "../systems/tools/strategies/WallStrategy";
import { FloorStrategy } from "../systems/tools/strategies/FloorStrategy";
import { BulldozeStrategy } from "../systems/tools/strategies/BulldozeStrategy";
import { EyedropperStrategy } from "../systems/tools/strategies/EyedropperStrategy";
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
              place: PlaceStrategy,
              move: MoveStrategy,
              wall: WallStrategy,
              floor: FloorStrategy,
              bulldoze: BulldozeStrategy,
              eyedropper: EyedropperStrategy,
            }}
          />
        </Suspense>
      </Canvas>
      <HudRoot />
    </div>
  );
}

export default App;
