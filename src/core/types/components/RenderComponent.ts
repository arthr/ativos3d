import type { Component } from "@core/types/ecs/Component";

/**
 * Interface para componente de renderização 3D
 *
 * Define como uma entidade deve ser renderizada no espaço 3D,
 * incluindo modelo, textura, cor e configurações de material
 */
export interface RenderComponent extends Component {
    readonly type: "RenderComponent";

    /**
     * URL do modelo 3D (opcional - pode usar geometria primitiva)
     */
    readonly modelUrl?: string;

    /**
     * URL da textura (opcional - pode usar cor sólida)
     */
    readonly textureUrl?: string;

    /**
     * Cor base do objeto (formato hex ou nome CSS)
     */
    readonly color: string;

    /**
     * Se o objeto deve ser renderizado
     */
    readonly visible: boolean;

    /**
     * Nível de detalhe (LOD) para otimização
     */
    readonly lodLevel: number;

    /**
     * Configurações de material
     */
    readonly material: MaterialConfig;

    /**
     * Define a URL do modelo
     */
    setModelUrl(url: string): RenderComponent;

    /**
     * Remove o modelo (usa geometria primitiva)
     */
    removeModel(): RenderComponent;

    /**
     * Define a URL da textura
     */
    setTextureUrl(url: string): RenderComponent;

    /**
     * Remove a textura (usa cor sólida)
     */
    removeTexture(): RenderComponent;

    /**
     * Define a cor do objeto
     */
    setColor(color: string): RenderComponent;

    /**
     * Define a visibilidade do objeto
     */
    setVisible(visible: boolean): RenderComponent;

    /**
     * Define o nível de detalhe
     */
    setLodLevel(level: number): RenderComponent;

    /**
     * Define as configurações de material
     */
    setMaterial(material: MaterialConfig): RenderComponent;

    /**
     * Verifica se o componente é válido para renderização
     */
    isValid(): boolean;

    /**
     * Retorna se o objeto tem modelo customizado
     */
    hasCustomModel(): boolean;

    /**
     * Retorna se o objeto tem textura customizada
     */
    hasCustomTexture(): boolean;
}

/**
 * Configurações de material para renderização
 */
export interface MaterialConfig {
    /**
     * Tipo de material
     */
    readonly type: "basic" | "phong" | "lambert" | "standard" | "physical";

    /**
     * Opacidade (0-1)
     */
    readonly opacity: number;

    /**
     * Se o material é transparente
     */
    readonly transparent: boolean;

    /**
     * Se o material recebe sombras
     */
    readonly receiveShadow: boolean;

    /**
     * Se o material projeta sombras
     */
    readonly castShadow: boolean;

    /**
     * Rugosidade (0-1, para materiais PBR)
     */
    readonly roughness?: number;

    /**
     * Metalicidade (0-1, para materiais PBR)
     */
    readonly metalness?: number;
}

/**
 * Dados para criar um RenderComponent
 */
export interface RenderComponentData {
    modelUrl?: string | undefined;
    textureUrl?: string | undefined;
    color?: string;
    visible?: boolean;
    lodLevel?: number;
    material?: MaterialConfig;
}

/**
 * Configuração padrão para RenderComponent
 */
export const DEFAULT_RENDER: Required<Omit<RenderComponentData, "modelUrl" | "textureUrl">> = {
    color: "#ffffff",
    visible: true,
    lodLevel: 0,
    material: {
        type: "basic",
        opacity: 1.0,
        transparent: false,
        receiveShadow: true,
        castShadow: true,
    },
};

/**
 * Configuração padrão para MaterialConfig
 */
export const DEFAULT_MATERIAL: MaterialConfig = {
    type: "basic",
    opacity: 1.0,
    transparent: false,
    receiveShadow: true,
    castShadow: true,
};
