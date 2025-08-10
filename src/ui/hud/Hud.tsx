import React from "react";
import { BudgetBar } from "../BudgetBar";
import { Toolbar } from "../Toolbar";
import { CatalogHud } from "./CatalogHud";
import { InspectorHud } from "./InspectorHud";
import { Topbar } from "../Topbar";

export function Hud() {
  // Overlay DOM com componentes reais; containers apenas posicionam e liberam eventos
  return (
    <div
      data-hud-root
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      {/* Topbar com controles e abaixo BudgetBar */}
      <div
        data-hud="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          pointerEvents: "auto",
        }}
      >
        <Topbar />
        <BudgetBar />
      </div>

      {/* Bottom-left toolbar */}
      <div
        data-hud="true"
        style={{ position: "absolute", bottom: 50, left: 8, pointerEvents: "auto" }}
      >
        <Toolbar />
      </div>

      {/* Bottom-right catalog */}
      <div
        data-hud="true"
        style={{ position: "absolute", bottom: 50, right: 8, width: 360, pointerEvents: "auto" }}
      >
        <CatalogHud />
      </div>

      {/* Top-right inspector */}
      <div
        data-hud="true"
        style={{ position: "absolute", top: 56, right: 8, width: 280, pointerEvents: "auto" }}
      >
        <InspectorHud />
      </div>
    </div>
  );
}

export default Hud;
