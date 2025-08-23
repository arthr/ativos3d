import type { ValidationResult } from "@core/types/Component";
import type {
    RenderComponent as IRenderComponent,
    RenderComponentData,
    MaterialConfig,
} from "@core/types/components/RenderComponent";
import { BaseComponent } from "./BaseComponent";
import { DEFAULT_RENDER } from "@core/types/components/RenderComponent";

/**
 * Componente de renderização 3D
 *
 * Gerencia como uma entidade deve ser renderizada no espaço 3D,
 * incluindo modelo, textura, cor e configurações de material.
 * Todas as operações retornam uma nova instância para manter imutabilidade.
 */
export class RenderComponent extends BaseComponent implements IRenderComponent {
    public readonly type = "RenderComponent";

    public readonly modelUrl?: string;
    public readonly textureUrl?: string;
    public readonly color: string;
    public readonly visible: boolean;
    public readonly lodLevel: number;
    public readonly material: MaterialConfig;

    constructor(data: RenderComponentData = {}) {
        super("RenderComponent");

        // Aplica valores padrão se não fornecidos
        this.modelUrl = data.modelUrl ?? "";
        this.textureUrl = data.textureUrl ?? "";
        this.color = data.color ?? DEFAULT_RENDER.color;
        this.visible = data.visible ?? DEFAULT_RENDER.visible;
        this.lodLevel = data.lodLevel ?? DEFAULT_RENDER.lodLevel;
        this.material = data.material ?? DEFAULT_RENDER.material;
    }

    /**
     * Define a URL do modelo
     */
    public setModelUrl(url: string): RenderComponent {
        return this.withChanges({ modelUrl: url });
    }

    /**
     * Remove o modelo (usa geometria primitiva)
     */
    public removeModel(): RenderComponent {
        return this.withChanges({ modelUrl: "" });
    }

    /**
     * Define a URL da textura
     */
    public setTextureUrl(url: string): RenderComponent {
        return this.withChanges({ textureUrl: url });
    }

    /**
     * Remove a textura (usa cor sólida)
     */
    public removeTexture(): RenderComponent {
        return this.withChanges({ textureUrl: "" });
    }

    /**
     * Define a cor do objeto
     */
    public setColor(color: string): RenderComponent {
        return this.withChanges({ color });
    }

    /**
     * Define a visibilidade do objeto
     */
    public setVisible(visible: boolean): RenderComponent {
        return this.withChanges({ visible });
    }

    /**
     * Define o nível de detalhe
     */
    public setLodLevel(level: number): RenderComponent {
        return this.withChanges({ lodLevel: level });
    }

    /**
     * Define as configurações de material
     */
    public setMaterial(material: MaterialConfig): RenderComponent {
        return this.withChanges({ material });
    }

    /**
     * Verifica se o componente é válido para renderização
     */
    public isValid(): boolean {
        const validation = this.validate();
        return validation.isValid;
    }

    /**
     * Retorna se o objeto tem modelo customizado
     */
    public hasCustomModel(): boolean {
        return this.modelUrl !== undefined && this.modelUrl.trim() !== "";
    }

    /**
     * Retorna se o objeto tem textura customizada
     */
    public hasCustomTexture(): boolean {
        return this.textureUrl !== undefined && this.textureUrl.trim() !== "";
    }

    /**
     * Validação específica do RenderComponent
     */
    public override validate(): ValidationResult {
        const baseValidation = super.validate();
        const errors: string[] = [...baseValidation.errors];
        const warnings: string[] = [...(baseValidation.warnings || [])];

        // Validação de cor
        if (!this.isValidColor(this.color)) {
            errors.push("Cor inválida");
        }

        // Validação de LOD
        if (this.lodLevel < 0 || this.lodLevel > 5) {
            errors.push("Nível de LOD deve estar entre 0 e 5");
        }

        // Validação de URLs
        if (this.modelUrl && !this.isValidUrl(this.modelUrl)) {
            errors.push("URL do modelo inválida");
        }

        if (this.textureUrl && !this.isValidUrl(this.textureUrl)) {
            errors.push("URL da textura inválida");
        }

        // Validação de material
        const materialValidation = this.validateMaterial();
        errors.push(...materialValidation.errors);
        warnings.push(...materialValidation.warnings);

        const result: ValidationResult = {
            isValid: errors.length === 0,
            errors,
        };

        if (warnings.length > 0) {
            result.warnings = warnings;
        }

        return result;
    }

    /**
     * Cria uma cópia do componente
     */
    public override clone(): RenderComponent {
        return this.withChanges({});
    }

    /**
     * Verifica se dois RenderComponents são iguais
     */
    public override equals(other: RenderComponent): boolean {
        return (
            super.equals(other) &&
            this.modelUrl === other.modelUrl &&
            this.textureUrl === other.textureUrl &&
            this.color === other.color &&
            this.visible === other.visible &&
            this.lodLevel === other.lodLevel &&
            this.materialEquals(this.material, other.material)
        );
    }

    /**
     * Converte para string (para debugging)
     */
    public override toString(): string {
        return `RenderComponent(color:${this.color}, visible:${this.visible}, lod:${this.lodLevel}, model:${this.modelUrl || "none"}, texture:${this.textureUrl || "none"})`;
    }

    /**
     * Factory method para criar um RenderComponent
     */
    public static create(data: RenderComponentData = {}): RenderComponent {
        return new RenderComponent(data);
    }

    /**
     * Cria um RenderComponent com cor específica
     */
    public static withColor(color: string): RenderComponent {
        return new RenderComponent({ color });
    }

    /**
     * Cria um RenderComponent com modelo específico
     */
    public static withModel(modelUrl: string): RenderComponent {
        return new RenderComponent({ modelUrl });
    }

    /**
     * Cria um RenderComponent com textura específica
     */
    public static withTexture(textureUrl: string): RenderComponent {
        return new RenderComponent({ textureUrl });
    }

    /**
     * Cria um RenderComponent invisível
     */
    public static invisible(): RenderComponent {
        return new RenderComponent({ visible: false });
    }

    /**
     * Cria um RenderComponent com material específico
     */
    public static withMaterial(material: MaterialConfig): RenderComponent {
        return new RenderComponent({ material });
    }

    /**
     * Cria nova instância com mudanças específicas
     */
    private withChanges(changes: Partial<RenderComponentData>): RenderComponent {
        const data: RenderComponentData = {
            modelUrl: changes.modelUrl ?? this.modelUrl,
            textureUrl: changes.textureUrl ?? this.textureUrl,
            color: changes.color ?? this.color,
            visible: changes.visible ?? this.visible,
            lodLevel: changes.lodLevel ?? this.lodLevel,
            material: changes.material ?? this.material,
        };

        return new RenderComponent(data);
    }

    /**
     * Validação específica de material
     */
    private validateMaterial(): { errors: string[]; warnings: string[] } {
        const errors: string[] = [];
        const warnings: string[] = [];

        const { opacity, transparent, roughness, metalness } = this.material;

        // Validação de opacidade
        if (opacity < 0 || opacity > 1) {
            errors.push("Opacidade deve estar entre 0 e 1");
        }

        // Validação de rugosidade (se presente)
        if (roughness !== undefined && (roughness < 0 || roughness > 1)) {
            errors.push("Rugosidade deve estar entre 0 e 1");
        }

        // Validação de metalicidade (se presente)
        if (metalness !== undefined && (metalness < 0 || metalness > 1)) {
            errors.push("Metalicidade deve estar entre 0 e 1");
        }

        // Avisos sobre transparência
        if (transparent && opacity === 1) {
            warnings.push(
                "Material transparente com opacidade total pode causar problemas de renderização",
            );
        }

        return { errors, warnings };
    }

    /**
     * Verifica se uma cor é válida
     */
    private isValidColor(color: string): boolean {
        // Verifica se é um nome de cor CSS válido ou hex
        const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$|^[a-zA-Z]+$/;
        return colorRegex.test(color) && color.trim() !== "";
    }

    /**
     * Verifica se uma URL é válida
     */
    private isValidUrl(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Verifica se dois materiais são iguais
     */
    private materialEquals(a: MaterialConfig, b: MaterialConfig): boolean {
        return (
            a.type === b.type &&
            a.opacity === b.opacity &&
            a.transparent === b.transparent &&
            a.receiveShadow === b.receiveShadow &&
            a.castShadow === b.castShadow &&
            a.roughness === b.roughness &&
            a.metalness === b.metalness
        );
    }
}
