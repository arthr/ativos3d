import React from "react";
import { UI_COLORS, UI_RADII, UI_SHADOWS } from "./tokens";

export type PanelProps = React.PropsWithChildren<{
  style?: React.CSSProperties;
  padded?: boolean;
}>;

export function Panel({ children, style, padded = true }: PanelProps) {
  return (
    <div
      style={{
        background: UI_COLORS.surface,
        border: `1px solid ${UI_COLORS.border}`,
        borderRadius: UI_RADII.md,
        padding: padded ? 8 : 0,
        boxShadow: UI_SHADOWS.sm,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default Panel;
