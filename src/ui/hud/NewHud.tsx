import React from "react";

export function NewHud() {
  // Overlay DOM com placeholders; sem funcionalidade nesta etapa
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
      {/* Top bar placeholder (ex: Budget) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          pointerEvents: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: 8,
            background: "rgba(255,255,255,0.95)",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <strong style={{ fontWeight: 800 }}>Top Placeholder</strong>
          <span style={{ color: "#475569" }}>Budget / Info</span>
        </div>
      </div>

      {/* Bottom-left toolbar placeholder */}
      <div style={{ position: "absolute", bottom: 50, left: 8, pointerEvents: "auto" }}>
        <div
          style={{
            display: "flex",
            gap: 8,
            background: "rgba(255,255,255,0.95)",
            padding: 8,
            borderRadius: 12,
            boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
          }}
        >
          {["Place", "Move", "Wall", "Floor", "Bulldoze", "Eyedropper"].map((label) => (
            <button
              key={label}
              style={{
                height: 44,
                minWidth: 64,
                padding: "0 12px",
                borderRadius: 10,
                border: "1px solid #e5e7eb",
                background: "#fff",
                fontWeight: 600,
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom-right catalog placeholder */}
      <div
        style={{ position: "absolute", bottom: 50, right: 8, width: 360, pointerEvents: "auto" }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.95)",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: 8,
            boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
            maxHeight: 260,
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Catálogo (placeholder)</div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 6,
              maxHeight: 220,
              overflow: "auto",
            }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 6,
                  padding: 8,
                  background: "#fff",
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 12 }}>Item {i + 1}</div>
                <div style={{ fontSize: 11, color: "#475569" }}>R$ —</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top-right inspector placeholder */}
      <div style={{ position: "absolute", top: 56, right: 8, width: 280, pointerEvents: "auto" }}>
        <div
          style={{
            background: "rgba(255,255,255,0.95)",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: 8,
            boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Inspector (placeholder)</div>
          <div style={{ fontSize: 12, color: "#475569" }}>Seleção atual: —</div>
        </div>
      </div>
    </div>
  );
}

export default NewHud;
