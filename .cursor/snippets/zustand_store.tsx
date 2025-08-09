import { create } from "zustand";

interface AppState {
	tool: string;
	selectedObjectId?: string;
	lot: Lot;
	undoStack: Command[];
	redoStack: Command[];
	setTool: (tool: string) => void;
}

export const useStore = create<AppState>((set) => ({
	tool: "place",
	lot: {
		width: 20,
		height: 20,
		objects: [],
		walls: [],
		floor: [],
		budget: { funds: 1000, spent: 0 },
		version: 1,
	},
	undoStack: [],
	redoStack: [],
	setTool: (tool) => set({ tool }),
}));
