import type { ValidationResult } from "@core/types/ecs/Component";
import type { FloorComponent as IFloorComponent, FloorComponentData } from "@core/types/components/FloorComponent";
import type { Vec3 } from "@core/geometry";
import { Vec3Factory } from "@core/geometry";
import { BaseComponent } from "./BaseComponent";

/**
 * Componente de domínio para representar Pisos.
 *
 * Mantém position, size e material de forma imutável. Fornece validação básica.
 */
export class FloorComponent extends BaseComponent implements IFloorComponent {
    public readonly type = "FloorComponent";

    public readonly position: Vec3;
    public readonly size: Vec3;
    public readonly material: string;

    constructor(data: FloorComponentData) {
        super("FloorComponent");
        this.position = data.position ?? Vec3Factory.create(0, 0, 0);
        this.size = data.size ?? Vec3Factory.create(1, 0.1, 1);
        this.material = data.material ?? "default";
    }

    /** Define nova posição (imutável) */
    public setPosition(position: Vec3): FloorComponent {
        return this.withChanges({ position });
    }

    /** Define novo tamanho (imutável) */
    public setSize(size: Vec3): FloorComponent {
        return this.withChanges({ size });
    }

    /** Define novo material (imutável) */
    public setMaterial(material: string): FloorComponent {
        return this.withChanges({ material });
    }

    /** Retorna se os dados do piso são válidos */
    public isValid(): boolean {
        return this.validate().isValid;
    }

    /** Validação específica do FloorComponent */
    public override validate(): ValidationResult {
        const base = super.validate();
        const errors: string[] = [...base.errors];
        const warnings: string[] = [...(base.warnings || [])];

        // position e size devem ser Vec3 válidos
        if (!this.isValidVec3(this.position)) errors.push("Posição do piso inválida");
        if (!this.isValidVec3(this.size)) errors.push("Tamanho do piso inválido");

        // Dimensões devem ser positivas
        if (!(this.size.x > 0 && this.size.y > 0 && this.size.z > 0)) {
            errors.push("Dimensões do piso devem ser > 0");
        }

        // Material não pode ser vazio
        if (typeof this.material !== "string" || this.material.trim() === "") {
            errors.push("Material do piso inválido");
        }

        const result: ValidationResult = { isValid: errors.length === 0, errors };
        if (warnings.length) result.warnings = warnings;
        return result;
    }

    /** Cria uma cópia do componente */
    public override clone(): FloorComponent {
        return this.withChanges({});
    }

    /** Verifica igualdade estrutural */
    public override equals(other: FloorComponent): boolean {
        return (
            super.equals(other) &&
            this.areVec3Equal(this.position, other.position) &&
            this.areVec3Equal(this.size, other.size) &&
            this.material === other.material
        );
    }

    /** Factory method */
    public static create(data: FloorComponentData): FloorComponent {
        return new FloorComponent(data);
    }

    private withChanges(changes: Partial<FloorComponentData>): FloorComponent {
        return new FloorComponent({
            position: changes.position ?? this.position,
            size: changes.size ?? this.size,
            material: changes.material ?? this.material,
        });
    }

    private areVec3Equal(a: Vec3, b: Vec3): boolean {
        return a.x === b.x && a.y === b.y && a.z === b.z;
    }

    private isValidVec3(v: Vec3): boolean {
        return (
            typeof v.x === "number" && typeof v.y === "number" && typeof v.z === "number" &&
            isFinite(v.x) && isFinite(v.y) && isFinite(v.z)
        );
    }
}

