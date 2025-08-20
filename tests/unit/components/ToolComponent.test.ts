import { describe, it, expect } from "vitest";
import { ToolComponent } from "@domain/components";
import type { ToolType } from "@core/types";

describe("ToolComponent", () => {
    describe("Criação", () => {
        it("deve criar ToolComponent com valores padrão", () => {
            const component = new ToolComponent();

            expect(component.type).toBe("ToolComponent");
            expect(component.tool).toBe("view");
            expect(component.mode).toBe("view");
        });

        it("deve criar ToolComponent com dados customizados", () => {
            const component = new ToolComponent({ tool: "move", mode: "build" });

            expect(component.tool).toBe("move");
            expect(component.mode).toBe("build");
        });
    });

    describe("Métodos de modificação", () => {
        it("deve definir a ferramenta", () => {
            const component = new ToolComponent();
            const newComponent = component.setTool("select");

            expect(newComponent.tool).toBe("select");
            expect(newComponent).not.toBe(component);
        });

        it("deve definir o modo", () => {
            const component = new ToolComponent();
            const newComponent = component.setMode("buy");

            expect(newComponent.mode).toBe("buy");
            expect(newComponent).not.toBe(component);
        });
    });

    describe("Validação", () => {
        it("deve detectar ferramenta inválida", () => {
            const invalid = new ToolComponent({ tool: "" as ToolType });
            expect(invalid.isValid()).toBe(false);
        });
    });

    describe("Utilitários", () => {
        it("deve verificar igualdade", () => {
            const c1 = new ToolComponent({ tool: "move", mode: "build" });
            const c2 = new ToolComponent({ tool: "move", mode: "build" });
            const c3 = new ToolComponent({ tool: "delete", mode: "build" });

            expect(c1.equals(c2)).toBe(true);
            expect(c1.equals(c3)).toBe(false);
        });

        it("deve clonar componente", () => {
            const component = new ToolComponent({ tool: "wall", mode: "build" });
            const clone = component.clone();

            expect(clone).not.toBe(component);
            expect(clone.tool).toBe("wall");
            expect(clone.mode).toBe("build");
        });
    });
});
