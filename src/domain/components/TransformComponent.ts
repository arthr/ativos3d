import type { ValidationResult } from "@core/types/Component";
import type {
    TransformComponent as ITransformComponent,
    TransformComponentData,
} from "@core/types/components/TransformComponent";
import type { Vec3 } from "@core/geometry";
import { BaseComponent } from "@domain/components";
import { Vec3Factory, Vec3Operations } from "@core/geometry";

/**
 * Componente de transformação 3D
 *
 * Gerencia a posição, rotação e escala de uma entidade no espaço 3D.
 * Todas as operações retornam uma nova instância para manter imutabilidade.
 */
export class TransformComponent extends BaseComponent implements ITransformComponent {
    public readonly type = "TransformComponent";

    public readonly position: Vec3;
    public readonly rotation: Vec3;
    public readonly scale: Vec3;

    constructor(data: TransformComponentData = {}) {
        super("TransformComponent");

        // Aplica valores padrão se não fornecidos
        this.position = data.position || Vec3Factory.create(0, 0, 0);
        this.rotation = data.rotation || Vec3Factory.create(0, 0, 0);
        this.scale = data.scale || Vec3Factory.create(1, 1, 1);
    }

    /**
     * Move a entidade para uma nova posição
     */
    public translate(delta: Vec3): TransformComponent {
        const newPosition = Vec3Operations.add(this.position, delta);
        return new TransformComponent({
            position: newPosition,
            rotation: this.rotation,
            scale: this.scale,
        });
    }

    /**
     * Define a posição absoluta
     */
    public setPosition(position: Vec3): TransformComponent {
        return new TransformComponent({
            position,
            rotation: this.rotation,
            scale: this.scale,
        });
    }

    /**
     * Rotaciona a entidade
     */
    public rotate(delta: Vec3): TransformComponent {
        const newRotation = Vec3Operations.add(this.rotation, delta);
        return new TransformComponent({
            position: this.position,
            rotation: newRotation,
            scale: this.scale,
        });
    }

    /**
     * Define a rotação absoluta
     */
    public setRotation(rotation: Vec3): TransformComponent {
        return new TransformComponent({
            position: this.position,
            rotation,
            scale: this.scale,
        });
    }

    /**
     * Escala a entidade
     */
    public scaleBy(factor: number): TransformComponent {
        const newScale = Vec3Operations.multiply(this.scale, factor);
        return new TransformComponent({
            position: this.position,
            rotation: this.rotation,
            scale: newScale,
        });
    }

    /**
     * Define a escala absoluta
     */
    public setScale(scale: Vec3): TransformComponent {
        return new TransformComponent({
            position: this.position,
            rotation: this.rotation,
            scale,
        });
    }

    /**
     * Aplica uma transformação completa
     */
    public setTransform(transform: {
        position?: Vec3;
        rotation?: Vec3;
        scale?: Vec3;
    }): TransformComponent {
        return new TransformComponent({
            position: transform.position ?? this.position,
            rotation: transform.rotation ?? this.rotation,
            scale: transform.scale ?? this.scale,
        });
    }

    /**
     * Retorna a transformação como objeto
     */
    public getTransform(): { position: Vec3; rotation: Vec3; scale: Vec3 } {
        return {
            position: this.position,
            rotation: this.rotation,
            scale: this.scale,
        };
    }

    /**
     * Verifica se a transformação é válida
     */
    public isValid(): boolean {
        const validation = this.validate();
        return validation.isValid;
    }

    /**
     * Validação específica do TransformComponent
     */
    public override validate(): ValidationResult {
        const baseValidation = super.validate();
        const errors: string[] = [...baseValidation.errors];
        const warnings: string[] = [...(baseValidation.warnings || [])];

        // Validação de posição
        if (!this.isValidVec3(this.position)) {
            errors.push("Posição inválida");
        }

        // Validação de rotação
        if (!this.isValidVec3(this.rotation)) {
            errors.push("Rotação inválida");
        }

        // Validação de escala
        if (!this.isValidVec3(this.scale)) {
            errors.push("Escala inválida");
        }

        // Verifica se a escala não é zero (causaria problemas de renderização)
        if (this.scale.x === 0 || this.scale.y === 0 || this.scale.z === 0) {
            errors.push("Escala não pode ser zero");
        }

        // Verifica se a escala é negativa
        if (this.scale.x < 0 || this.scale.y < 0 || this.scale.z < 0) {
            errors.push("Escala não pode ser negativa.");
        }

        // Verifica se a escala é muito pequena (pode causar problemas)
        if (
            Math.abs(this.scale.x) < 0.001 ||
            Math.abs(this.scale.y) < 0.001 ||
            Math.abs(this.scale.z) < 0.001
        ) {
            warnings.push("Escala muito pequena pode causar problemas de renderização");
        }

        // Verifica se a escala é muito grande (pode causar problemas)
        if (
            Math.abs(this.scale.x) > 1000 ||
            Math.abs(this.scale.y) > 1000 ||
            Math.abs(this.scale.z) > 1000
        ) {
            warnings.push("Escala muito grande pode causar problemas de performance");
        }

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
    public override clone(): TransformComponent {
        return new TransformComponent({
            position: this.position,
            rotation: this.rotation,
            scale: this.scale,
        });
    }

    /**
     * Verifica se dois TransformComponents são guais
     */
    public override equals(other: TransformComponent): boolean {
        return (
            super.equals(other) &&
            this.position.x === other.position.x &&
            this.position.y === other.position.y &&
            this.position.z === other.position.z &&
            this.rotation.x === other.rotation.x &&
            this.rotation.y === other.rotation.y &&
            this.rotation.z === other.rotation.z &&
            this.scale.x === other.scale.x &&
            this.scale.y === other.scale.y &&
            this.scale.z === other.scale.z
        );
    }

    /**
     * Converte para string (para debugging)
     */
    public override toString(): string {
        return `TransformComponent(pos:(${this.position.x},${this.position.y},${this.position.z}), rot:(${this.rotation.x},${this.rotation.y},${this.rotation.z}), scale:(${this.scale.x},${this.scale.y},${this.scale.z}))`;
    }

    /**
     * Factory method para criar um TransformComponent
     */
    public static create(data: TransformComponentData = {}): TransformComponent {
        return new TransformComponent(data);
    }

    /**
     * Cria um TransformComponent com posição específica
     */
    public static atPosition(position: Vec3): TransformComponent {
        return new TransformComponent({ position });
    }

    /**
     * Cria um TransformComponent com rotação específica
     */
    public static withRotation(rotation: Vec3): TransformComponent {
        return new TransformComponent({ rotation });
    }

    /**
     * Cria um TransformComponent com escala específica
     */
    public static withScale(scale: Vec3): TransformComponent {
        return new TransformComponent({ scale });
    }

    /**
     * Verifica se um Vec3 é válido
     */
    private isValidVec3(vec: Vec3): boolean {
        return (
            typeof vec.x === "number" &&
            typeof vec.y === "number" &&
            typeof vec.z === "number" &&
            !isNaN(vec.x) &&
            !isNaN(vec.y) &&
            !isNaN(vec.z) &&
            isFinite(vec.x) &&
            isFinite(vec.y) &&
            isFinite(vec.z)
        );
    }
}
