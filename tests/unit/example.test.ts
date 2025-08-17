import { describe, it, expect } from "vitest";

describe("Configuração de Testes", () => {
    it("deve funcionar corretamente", () => {
        expect(true).toBe(true);
    });

    it("deve suportar operações matemáticas", () => {
        expect(2 + 2).toBe(4);
    });

    it("deve suportar strings", () => {
        expect("hello").toBe("hello");
    });
});
