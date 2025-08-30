import type { ValidationResult } from "@core/types/ecs/Component";
import type { WallComponent as IWallComponent, WallComponentData } from "@core/types/components/WallComponent";
import type { Vec3 } from "@core/geometry";
import { Vec3Math, Vec3Factory } from "@core/geometry";
import { BaseComponent } from "./BaseComponent";

/**
 * Componente de domínio para representar Paredes.
 *
 * Mantém start, end e height de forma imutável. Fornece validação básica.
 */
export class WallComponent extends BaseComponent implements IWallComponent {
    public readonly type = "WallComponent";

    public readonly start: Vec3;
    public readonly end: Vec3;
    public readonly height: number;
    public readonly thickness?: number;

    constructor(data: WallComponentData) {
        super("WallComponent");
        this.start = data.start ?? Vec3Factory.create(0, 0, 0);
        this.end = data.end ?? Vec3Factory.create(1, 0, 0);
        this.height = data.height ?? 2.5;
        this.thickness = data.thickness ?? 0.12;
    }

    /** Define novo ponto inicial (imutável) */
    public setStart(start: Vec3): WallComponent {
        return this.withChanges({ start });
    }

    /** Define novo ponto final (imutável) */
    public setEnd(end: Vec3): WallComponent {
        return this.withChanges({ end });
    }

    /** Define nova altura (imutável) */
    public setHeight(height: number): WallComponent {
        return this.withChanges({ height });
    }

    /** Define nova espessura (imutável) */
    public setThickness(thickness: number): WallComponent {
        return this.withChanges({ thickness });
    }

    /** Retorna se os dados da parede são válidos */
    public isValid(): boolean {
        return this.validate().isValid;
    }

    /** Validação específica do WallComponent */
    public override validate(): ValidationResult {
        const base = super.validate();
        const errors: string[] = [...base.errors];
        const warnings: string[] = [...(base.warnings || [])];

        // Altura deve ser positiva
        if (!(typeof this.height === "number") || !isFinite(this.height) || this.height <= 0) {
            errors.push("Altura da parede deve ser > 0");
        }

        // start e end devem ser Vec3 válidos e não coincidentes
        if (!this.isValidVec3(this.start)) errors.push("Ponto inicial inválido");
        if (!this.isValidVec3(this.end)) errors.push("Ponto final inválido");

        const length = Vec3Math.distance(this.start, this.end);
        if (length <= 0) {
            errors.push("Pontos de parede não podem ser coincidentes");
        }

        // Validação de espessura (se definida)
        if (this.thickness !== undefined) {
            if (!(typeof this.thickness === "number") || !isFinite(this.thickness) || this.thickness <= 0) {
                errors.push("Espessura da parede deve ser > 0");
            }
        }

        const result: ValidationResult = { isValid: errors.length === 0, errors };
        if (warnings.length) result.warnings = warnings;
        return result;
    }

    /** Cria uma cópia do componente */
    public override clone(): WallComponent {
        return this.withChanges({});
    }

    /** Verifica igualdade estrutural */
    public override equals(other: WallComponent): boolean {
        return (
            super.equals(other) &&
            this.areVec3Equal(this.start, other.start) &&
            this.areVec3Equal(this.end, other.end) &&
            this.height === other.height &&
            this.thickness === other.thickness
        );
    }

    /** Factory method */
    public static create(data: WallComponentData): WallComponent {
        return new WallComponent(data);
    }

    private withChanges(changes: Partial<WallComponentData>): WallComponent {
        return new WallComponent({
            start: changes.start ?? this.start,
            end: changes.end ?? this.end,
            height: changes.height ?? this.height,
            thickness: changes.thickness ?? this.thickness,
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
