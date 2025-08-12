import { useCallback } from "react";
import { useStore } from "../../../../store/useStore";
import { useEventBus } from "../../../../core/events";
import { executeCommand } from "../../../../core/commandStack";
import type { MoveState } from "./state";

export function useMoveEvents(state: MoveState) {
  // Início imediato do modo "pré-movimento": selecionado define âncora de origem
  const handleDown = useCallback(() => {
    const { activeTool, selectedIds } = useStore.getState();
    if (activeTool !== "move" || !selectedIds.length) return;
    const id = selectedIds[0];
    const obj = useStore.getState().objects.find((o) => o.id === id);
    if (!obj) return;
    state.startPosRef.current = { x: obj.pos.x, y: obj.pos.y, z: obj.pos.z };
  }, [state]);

  const handleUp = useCallback(() => {
    // Commit da movimentação quando soltar o botão: aplica mudança definitiva
    const { activeTool, selectedIds } = useStore.getState();
    if (activeTool !== "move" || !selectedIds.length) return;
    const id = selectedIds[0];
    if (!state.startPosRef.current || !state.lastPosRef.current) return;
    const from = { ...state.startPosRef.current };
    const to = { ...state.lastPosRef.current };
    const moved = from.x !== to.x || from.y !== to.y || from.z !== to.z;
    if (!moved) return;
    const cmd = {
      description: "move-object",
      execute: () =>
        useStore.setState((s) => ({
          objects: s.objects.map((o) =>
            o.id === id ? { ...o, pos: { x: to.x, y: to.y, z: to.z } } : o,
          ),
        })),
      undo: () =>
        useStore.setState((s) => ({
          objects: s.objects.map((o) =>
            o.id === id ? { ...o, pos: { x: from.x, y: from.y, z: from.z } } : o,
          ),
        })),
    };
    executeCommand(cmd, useStore.getState().pushCommand);
  }, [state]);

  const handleKeyDown = useCallback(({ code, shift }: { code: string; shift: boolean }) => {
    const { activeTool, selectedIds } = useStore.getState();
    if (activeTool !== "move" || !selectedIds.length) return;
    if (code.toLowerCase?.() === "keyr" || code === "KeyR") {
      const id = selectedIds[0];
      const cmd = {
        description: "rotate-object",
        execute: () =>
          useStore.setState((s) => ({
            objects: s.objects.map((o) =>
              o.id === id
                ? { ...o, rot: { ...o.rot, y: (o.rot.y + (shift ? 270 : 90)) % 360 } }
                : o,
            ),
          })),
        undo: () =>
          useStore.setState((s) => ({
            objects: s.objects.map((o) =>
              o.id === id
                ? { ...o, rot: { ...o.rot, y: (o.rot.y - (shift ? 270 : 90) + 360) % 360 } }
                : o,
            ),
          })),
      };
      executeCommand(cmd, useStore.getState().pushCommand);
    }
    if (code === "Escape") {
      useStore.setState({ selectedIds: [] });
    }
  }, []);

  useEventBus("pointerDown", handleDown);
  useEventBus("pointerUp", handleUp);
  useEventBus("keyDown", handleKeyDown);
}
