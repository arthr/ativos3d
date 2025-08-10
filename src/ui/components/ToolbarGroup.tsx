import React from "react";
import Panel from "./Panel";

export function ToolbarGroup({ children }: React.PropsWithChildren) {
  return (
    <Panel
      padded={true}
      style={{
        display: "flex",
        gap: 8,
        borderRadius: 12,
        boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
      }}
    >
      {children}
    </Panel>
  );
}

export default ToolbarGroup;
