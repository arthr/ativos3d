import React from "react";
import { UI_COLORS, UI_RADII, UI_SHADOWS } from "./tokens";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
};

export function Button({ active = false, style, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      style={{
        height: 24,
        minWidth: 24,
        fontSize: 10,
        padding: "0 10px",
        borderRadius: UI_RADII.sm,
        border: `1px solid ${UI_COLORS.border}`,
        background: active ? UI_COLORS.primaryBg : UI_COLORS.surface,
        fontWeight: active ? 800 : 600,
        textTransform: "capitalize",
        transition: "background-color 140ms ease, box-shadow 140ms ease, transform 120ms ease",
        boxShadow: active ? UI_SHADOWS.sm : undefined,
        // hover/active states via inline + rest.onMouse* podem sobrepor
        ...(rest.disabled ? { opacity: 0.6, cursor: "not-allowed" } : { cursor: "pointer" }),
        ...style,
      }}
      onMouseEnter={(e) => {
        if (rest.onMouseEnter) rest.onMouseEnter(e);
        const target = e.currentTarget as HTMLButtonElement;
        if (!rest.disabled && !active) {
          target.style.background = "#f8fafc";
          target.style.boxShadow = UI_SHADOWS.sm;
        }
      }}
      onMouseLeave={(e) => {
        if (rest.onMouseLeave) rest.onMouseLeave(e);
        if (active) return;
        const target = e.currentTarget as HTMLButtonElement;
        target.style.background = active ? UI_COLORS.primaryBg : UI_COLORS.surface;
        target.style.boxShadow = "";
        target.style.transform = "";
      }}
      onMouseDown={(e) => {
        if (rest.onMouseDown) rest.onMouseDown(e);
        const target = e.currentTarget as HTMLButtonElement;
        target.style.transform = "translateY(1px)";
      }}
      onMouseUp={(e) => {
        if (rest.onMouseUp) rest.onMouseUp(e);
        const target = e.currentTarget as HTMLButtonElement;
        target.style.transform = "";
      }}
    />
  );
}

export default Button;
