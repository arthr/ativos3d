import React from "react";
import { UI_COLORS, UI_RADII } from "./tokens";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
};

export function Button({ active = false, style, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      style={{
        height: 32,
        minWidth: 44,
        padding: "0 10px",
        borderRadius: UI_RADII.sm,
        border: `1px solid ${UI_COLORS.border}`,
        background: active ? UI_COLORS.primaryBg : UI_COLORS.surface,
        fontWeight: active ? 800 : 600,
        textTransform: "capitalize",
        ...style,
      }}
    />
  );
}

export default Button;
