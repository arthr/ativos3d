export interface Command {
  execute(): void;
  undo(): void;
  description: string;
}

export class CommandStack {
  private undoStack: Command[] = [];
  private redoStack: Command[] = [];

  push(cmd: Command) {
    cmd.execute();
    this.undoStack.push(cmd);
    this.redoStack.length = 0;
  }

  undo() {
    const cmd = this.undoStack.pop();
    if (!cmd) return;
    cmd.undo();
    this.redoStack.push(cmd);
  }

  redo() {
    const cmd = this.redoStack.pop();
    if (!cmd) return;
    cmd.execute();
    this.undoStack.push(cmd);
  }

  canUndo() {
    return this.undoStack.length > 0;
  }
  canRedo() {
    return this.redoStack.length > 0;
  }
}
