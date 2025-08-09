import { Command } from "../store/useStore";

export function executeCommand(cmd: Command, push: (c: Command) => void) {
	cmd.execute();
	push(cmd);
}
