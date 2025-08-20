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
        return this.withChanges({ position: Vec3Operations.add(this.position, delta) });
    }

    /**
     * Define a posição absoluta
     */
    public setPosition(position: Vec3): TransformComponent {
        return this.withChanges({ position });
    }

    /**
     * Rotaciona a entidade
     */
    public rotate(delta: Vec3): TransformComponent {
        return this.withChanges({ rotation: Vec3Operations.add(this.rotation, delta) });
    }

    /**
     * Define a rotação absoluta
     */
    public setRotation(rotation: Vec3): TransformComponent {
        return this.withChanges({ rotation });
    }

    /**
     * Escala a entidade
     */
    public scaleBy(factor: number): TransformComponent {
        return this.withChanges({ scale: Vec3Operations.multiply(this.scale, factor) });
    }

    /**
     * Define a escala absoluta
     */
    public setScale(scale: Vec3): TransformComponent {
        return this.withChanges({ scale });
    }

    /**
     * Aplica uma transformação completa
     */
    public setTransform(transform: {
        position?: Vec3;
        rotation?: Vec3;
        scale?: Vec3;
    }): TransformComponent {
        return this.withChanges(transform);
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

        // Validação específica de escala
        const scaleValidation = this.validateScale();
        errors.push(...scaleValidation.errors);
        warnings.push(...scaleValidation.warnings);

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
        return this.withChanges({});
    }

    /**
     * Verifica se dois TransformComponents são iguais
     */
    public override equals(other: TransformComponent): boolean {
        return (
            super.equals(other) &&
            this.areVec3Equal(this.position, other.position) &&
            this.areVec3Equal(this.rotation, other.rotation) &&
            this.areVec3Equal(this.scale, other.scale)
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
     * Cria nova instância com mudanças específicas
     */
    private withChanges(changes: Partial<TransformComponentData>): TransformComponent {
        return new TransformComponent({
            position: changes.position ?? this.position,
            rotation: changes.rotation ?? this.rotation,
            scale: changes.scale ?? this.scale,
        });
    }

    /**
     * Validação específica de escala
     */
    private validateScale(): { errors: string[]; warnings: string[] } {
        const errors: string[] = [];
        const warnings: string[] = [];

        const { x, y, z } = this.scale;

        // Verifica se a escala não é zero
        if (x === 0 || y === 0 || z === 0) {
            errors.push("Escala não pode ser zero");
        }

        // Verifica se a escala é negativa
        if (x < 0 || y < 0 || z < 0) {
            errors.push("Escala não pode ser negativa.");
        }

        const minScale = 0.001;
        const maxScale = 1000;

        // Verifica se a escala é muito pequena
        if (Math.abs(x) < minScale || Math.abs(y) < minScale || Math.abs(z) < minScale) {
            warnings.push("Escala muito pequena pode causar problemas de renderização");
        }

        // Verifica se a escala é muito grande
        if (Math.abs(x) > maxScale || Math.abs(y) > maxScale || Math.abs(z) > maxScale) {
            warnings.push("Escala muito grande pode causar problemas de performance");
        }

        return { errors, warnings };
    }

    /**
     * Verifica se dois Vec3 são iguais
     */
    private areVec3Equal(a: Vec3, b: Vec3): boolean {
        return a.x === b.x && a.y === b.y && a.z === b.z;
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
