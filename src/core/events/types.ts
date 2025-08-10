export type AppEvents = {
  pointerNdc: { x: number; y: number };
  groundPoint: { x: number; y: number; z: number } | null;
  keyDown: { code: string; shift: boolean; alt: boolean; ctrl: boolean; meta: boolean };
  keyUp: { code: string; shift: boolean; alt: boolean; ctrl: boolean; meta: boolean };
  pointerDown: {
    button: number;
    ndc: { x: number; y: number };
    ground: { x: number; y: number; z: number } | null;
    hudTarget: boolean;
    shift: boolean;
    alt: boolean;
    ctrl: boolean;
    meta: boolean;
  };
  pointerUp: {
    button: number;
    ndc: { x: number; y: number };
    ground: { x: number; y: number; z: number } | null;
    hudTarget: boolean;
    shift: boolean;
    alt: boolean;
    ctrl: boolean;
    meta: boolean;
  };
  click: {
    button: number;
    ndc: { x: number; y: number };
    ground: { x: number; y: number; z: number } | null;
    hudTarget: boolean;
  };
};
