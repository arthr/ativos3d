import { describe, it, expect } from "vitest";
import { RenderComponent } from "@domain/components";
import type { MaterialConfig } from "@core/types/components/RenderComponent";

describe("RenderComponent", () => {
    describe("Criação", () => {
        it("deve criar um RenderComponent com valores padrão", () => {
            const component = new RenderComponent();

            expect(component.type).toBe("RenderComponent");
            expect(component.color).toBe("#ffffff");
            expect(component.visible).toBe(true);
            expect(component.lodLevel).toBe(0);
            expect(component.material.type).toBe("basic");
            expect(component.material.opacity).toBe(1.0);
            expect(component.material.transparent).toBe(false);
            expect(component.material.receiveShadow).toBe(true);
            expect(component.material.castShadow).toBe(true);
        });

        it("deve criar um RenderComponent com dados customizados", () => {
            const data = {
                color: "#ff0000",
                visible: false,
                lodLevel: 2,
                modelUrl: "https://example.com/model.glb",
                textureUrl: "https://example.com/texture.jpg",
                material: {
                    type: "phong" as const,
                    opacity: 0.8,
                    transparent: true,
                    receiveShadow: false,
                    castShadow: false,
                },
            };

            const component = new RenderComponent(data);

            expect(component.color).toBe("#ff0000");
            expect(component.visible).toBe(false);
            expect(component.lodLevel).toBe(2);
            expect(component.modelUrl).toBe("https://example.com/model.glb");
            expect(component.textureUrl).toBe("https://example.com/texture.jpg");
            expect(component.material.type).toBe("phong");
            expect(component.material.opacity).toBe(0.8);
            expect(component.material.transparent).toBe(true);
            expect(component.material.receiveShadow).toBe(false);
            expect(component.material.castShadow).toBe(false);
        });
    });

    describe("Métodos de modificação", () => {
        it("deve definir a URL do modelo", () => {
            const component = new RenderComponent();
            const newComponent = component.setModelUrl("https://example.com/model.glb");

            expect(newComponent.modelUrl).toBe("https://example.com/model.glb");
            expect(newComponent).not.toBe(component); // Imutabilidade
        });

        it("deve remover o modelo", () => {
            const component = new RenderComponent({ modelUrl: "https://example.com/model.glb" });
            const newComponent = component.removeModel();

            expect(newComponent.modelUrl).toBe("");
            expect(newComponent).not.toBe(component);
        });

        it("deve definir a URL da textura", () => {
            const component = new RenderComponent();
            const newComponent = component.setTextureUrl("https://example.com/texture.jpg");

            expect(newComponent.textureUrl).toBe("https://example.com/texture.jpg");
            expect(newComponent).not.toBe(component);
        });

        it("deve remover a textura", () => {
            const component = new RenderComponent({
                textureUrl: "https://example.com/texture.jpg",
            });
            const newComponent = component.removeTexture();

            expect(newComponent.textureUrl).toBe("");
            expect(newComponent).not.toBe(component);
        });

        it("deve definir a cor", () => {
            const component = new RenderComponent();
            const newComponent = component.setColor("#00ff00");

            expect(newComponent.color).toBe("#00ff00");
            expect(newComponent).not.toBe(component);
        });

        it("deve definir a visibilidade", () => {
            const component = new RenderComponent();
            const newComponent = component.setVisible(false);

            expect(newComponent.visible).toBe(false);
            expect(newComponent).not.toBe(component);
        });

        it("deve definir o nível de LOD", () => {
            const component = new RenderComponent();
            const newComponent = component.setLodLevel(3);

            expect(newComponent.lodLevel).toBe(3);
            expect(newComponent).not.toBe(component);
        });

        it("deve definir o material", () => {
            const component = new RenderComponent();
            const newMaterial: MaterialConfig = {
                type: "standard",
                opacity: 0.5,
                transparent: true,
                receiveShadow: false,
                castShadow: true,
                roughness: 0.8,
                metalness: 0.2,
            };

            const newComponent = component.setMaterial(newMaterial);

            expect(newComponent.material).toEqual(newMaterial);
            expect(newComponent).not.toBe(component);
        });
    });

    describe("Métodos de verificação", () => {
        it("deve verificar se tem modelo customizado", () => {
            const componentWithoutModel = new RenderComponent();
            const componentWithModel = new RenderComponent({
                modelUrl: "https://example.com/model.glb",
            });

            expect(componentWithoutModel.hasCustomModel()).toBe(false);
            expect(componentWithModel.hasCustomModel()).toBe(true);
        });

        it("deve verificar se tem textura customizada", () => {
            const componentWithoutTexture = new RenderComponent();
            const componentWithTexture = new RenderComponent({
                textureUrl: "https://example.com/texture.jpg",
            });

            expect(componentWithoutTexture.hasCustomTexture()).toBe(false);
            expect(componentWithTexture.hasCustomTexture()).toBe(true);
        });

        it("deve verificar se é válido", () => {
            const validComponent = new RenderComponent();
            expect(validComponent.isValid()).toBe(true);
        });
    });

    describe("Validação", () => {
        it("deve validar cor inválida", () => {
            const component = new RenderComponent({ color: "invalid-color" });
            const validation = component.validate();

            expect(validation.isValid).toBe(false);
            expect(validation.errors).toContain("Cor inválida");
        });

        it("deve validar LOD inválido", () => {
            const component = new RenderComponent({ lodLevel: 10 });
            const validation = component.validate();

            expect(validation.isValid).toBe(false);
            expect(validation.errors).toContain("Nível de LOD deve estar entre 0 e 5");
        });

        it("deve validar URL do modelo inválida", () => {
            const component = new RenderComponent({ modelUrl: "invalid-url" });
            const validation = component.validate();

            expect(validation.isValid).toBe(false);
            expect(validation.errors).toContain("URL do modelo inválida");
        });

        it("deve validar URL da textura inválida", () => {
            const component = new RenderComponent({ textureUrl: "invalid-url" });
            const validation = component.validate();

            expect(validation.isValid).toBe(false);
            expect(validation.errors).toContain("URL da textura inválida");
        });

        it("deve validar opacidade inválida", () => {
            const component = new RenderComponent({
                material: {
                    type: "basic",
                    opacity: 1.5,
                    transparent: false,
                    receiveShadow: true,
                    castShadow: true,
                },
            });
            const validation = component.validate();

            expect(validation.isValid).toBe(false);
            expect(validation.errors).toContain("Opacidade deve estar entre 0 e 1");
        });

        it("deve validar rugosidade inválida", () => {
            const component = new RenderComponent({
                material: {
                    type: "standard",
                    opacity: 1.0,
                    transparent: false,
                    receiveShadow: true,
                    castShadow: true,
                    roughness: 1.5,
                },
            });
            const validation = component.validate();

            expect(validation.isValid).toBe(false);
            expect(validation.errors).toContain("Rugosidade deve estar entre 0 e 1");
        });

        it("deve validar metalicidade inválida", () => {
            const component = new RenderComponent({
                material: {
                    type: "standard",
                    opacity: 1.0,
                    transparent: false,
                    receiveShadow: true,
                    castShadow: true,
                    metalness: -0.5,
                },
            });
            const validation = component.validate();

            expect(validation.isValid).toBe(false);
            expect(validation.errors).toContain("Metalicidade deve estar entre 0 e 1");
        });

        it("deve emitir aviso para material transparente com opacidade total", () => {
            const component = new RenderComponent({
                material: {
                    type: "basic",
                    opacity: 1.0,
                    transparent: true,
                    receiveShadow: true,
                    castShadow: true,
                },
            });
            const validation = component.validate();

            expect(validation.isValid).toBe(true);
            expect(validation.warnings).toContain(
                "Material transparente com opacidade total pode causar problemas de renderização",
            );
        });
    });

    describe("Métodos de comparação", () => {
        it("deve verificar igualdade entre componentes", () => {
            const component1 = new RenderComponent({
                color: "#ff0000",
                visible: true,
                lodLevel: 1,
                modelUrl: "https://example.com/model.glb",
            });

            const component2 = new RenderComponent({
                color: "#ff0000",
                visible: true,
                lodLevel: 1,
                modelUrl: "https://example.com/model.glb",
            });

            const component3 = new RenderComponent({
                color: "#00ff00",
                visible: true,
                lodLevel: 1,
                modelUrl: "https://example.com/model.glb",
            });

            expect(component1.equals(component2)).toBe(true);
            expect(component1.equals(component3)).toBe(false);
        });

        it("deve clonar o componente", () => {
            const component = new RenderComponent({
                color: "#ff0000",
                visible: false,
                lodLevel: 2,
                modelUrl: "https://example.com/model.glb",
                textureUrl: "https://example.com/texture.jpg",
            });

            const cloned = component.clone();

            expect(cloned).not.toBe(component);
            expect(cloned.color).toBe(component.color);
            expect(cloned.visible).toBe(component.visible);
            expect(cloned.lodLevel).toBe(component.lodLevel);
            expect(cloned.modelUrl).toBe(component.modelUrl);
            expect(cloned.textureUrl).toBe(component.textureUrl);
        });
    });

    describe("Métodos estáticos", () => {
        it("deve criar componente com cor específica", () => {
            const component = RenderComponent.withColor("#00ff00");

            expect(component.color).toBe("#00ff00");
            expect(component.visible).toBe(true);
            expect(component.lodLevel).toBe(0);
        });

        it("deve criar componente com modelo específico", () => {
            const component = RenderComponent.withModel("https://example.com/model.glb");

            expect(component.modelUrl).toBe("https://example.com/model.glb");
            expect(component.color).toBe("#ffffff");
            expect(component.visible).toBe(true);
        });

        it("deve criar componente com textura específica", () => {
            const component = RenderComponent.withTexture("https://example.com/texture.jpg");

            expect(component.textureUrl).toBe("https://example.com/texture.jpg");
            expect(component.color).toBe("#ffffff");
            expect(component.visible).toBe(true);
        });

        it("deve criar componente invisível", () => {
            const component = RenderComponent.invisible();

            expect(component.visible).toBe(false);
            expect(component.color).toBe("#ffffff");
            expect(component.lodLevel).toBe(0);
        });

        it("deve criar componente com material específico", () => {
            const material: MaterialConfig = {
                type: "standard",
                opacity: 0.8,
                transparent: true,
                receiveShadow: false,
                castShadow: true,
                roughness: 0.5,
                metalness: 0.3,
            };

            const component = RenderComponent.withMaterial(material);

            expect(component.material).toEqual(material);
            expect(component.color).toBe("#ffffff");
            expect(component.visible).toBe(true);
        });
    });

    describe("ToString", () => {
        it("deve retornar string representativa", () => {
            const component = new RenderComponent({
                color: "#ff0000",
                visible: true,
                lodLevel: 2,
                modelUrl: "https://example.com/model.glb",
                textureUrl: "https://example.com/texture.jpg",
            });

            const result = component.toString();

            expect(result).toContain("RenderComponent");
            expect(result).toContain("color:#ff0000");
            expect(result).toContain("visible:true");
            expect(result).toContain("lod:2");
            expect(result).toContain("model:https://example.com/model.glb");
            expect(result).toContain("texture:https://example.com/texture.jpg");
        });

        it("deve mostrar 'none' para modelo e textura ausentes", () => {
            const component = new RenderComponent();

            const result = component.toString();

            expect(result).toContain("model:none");
            expect(result).toContain("texture:none");
        });
    });
});
