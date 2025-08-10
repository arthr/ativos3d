import React from "react";
import { BudgetBar } from "../BudgetBar";
import { Toolbar } from "../Toolbar";
import CatalogContainer from "./Catalog/CatalogContainer";
import { Topbar } from "../Topbar";

export function HudRoot() {
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

      <div
        data-hud="true"
        style={{ position: "absolute", bottom: 50, left: 8, pointerEvents: "auto" }}
      >
        <Toolbar />
      </div>

      <div
        data-hud="true"
        style={{ position: "absolute", bottom: 50, right: 8, width: 360, pointerEvents: "auto" }}
      >
        <CatalogContainer />
      </div>
    </div>
  );
}

export default HudRoot;
