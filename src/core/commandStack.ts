import { Command } from "../store/useStore";

export function executeCommand(cmd: Command, push: (c: Command) => void): void {
  const result = cmd.execute();
  if (result === false) return;
  push(cmd);
}
