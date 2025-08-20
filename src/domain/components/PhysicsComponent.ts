import type { ValidationResult } from "@core/types/Component";
import type {
    PhysicsComponent as IPhysicsComponent,
    PhysicsComponentData,
} from "@core/types/components/PhysicsComponent";
import type { Vec3 } from "@core/geometry";
import { BaseComponent } from "@domain/components";
import { Vec3Factory, Vec3Operations } from "@core/geometry";
import { DEFAULT_PHYSICS } from "@core/types/components/PhysicsComponent";

/**
 * Componente de física básica
 *
 * Controla propriedades físicas simples como massa, velocidade e aceleração.
 * Todas as operações retornam uma nova instância para manter imutabilidade.
 */
export class PhysicsComponent extends BaseComponent implements IPhysicsComponent {
    public readonly type = "PhysicsComponent";

    public readonly mass: number;
    public readonly velocity: Vec3;
    public readonly acceleration: Vec3;
    public readonly useGravity: boolean;

    constructor(data: PhysicsComponentData = {}) {
        super("PhysicsComponent");

        this.mass = data.mass ?? DEFAULT_PHYSICS.mass;
        this.velocity = data.velocity ?? Vec3Factory.create(0, 0, 0);
        this.acceleration = data.acceleration ?? Vec3Factory.create(0, 0, 0);
        this.useGravity = data.useGravity ?? DEFAULT_PHYSICS.useGravity;
    }

    /**
     * Define a massa do objeto
     */
    public setMass(mass: number): PhysicsComponent {
        return this.withChanges({ mass });
    }

    /**
     * Define a velocidade do objeto
     */
    public setVelocity(velocity: Vec3): PhysicsComponent {
        return this.withChanges({ velocity });
    }

    /**
     * Define a aceleração do objeto
     */
    public setAcceleration(acceleration: Vec3): PhysicsComponent {
        return this.withChanges({ acceleration });
    }

    /**
     * Aplica uma força ao objeto
     */
    public applyForce(force: Vec3): PhysicsComponent {
        if (this.mass === 0) {
            return this;
        }
        const delta = Vec3Operations.divide(force, this.mass);
        return this.withChanges({ acceleration: Vec3Operations.add(this.acceleration, delta) });
    }

    /**
     * Integra velocidade com base na aceleração
     */
    public integrate(deltaTime: number): PhysicsComponent {
        const newVelocity = Vec3Operations.add(
            this.velocity,
            Vec3Operations.multiply(this.acceleration, deltaTime),
        );
        return this.withChanges({
            velocity: newVelocity,
            acceleration: Vec3Factory.create(0, 0, 0),
        });
    }

    /**
     * Retorna se o objeto é estático
     */
    public isStatic(): boolean {
        return this.mass === 0 || !isFinite(this.mass);
    }

    /**
     * Verifica se os dados físicos são válidos
     */
    public isValid(): boolean {
        const validation = this.validate();
        return validation.isValid;
    }

    /**
     * Validação específica do PhysicsComponent
     */
    public override validate(): ValidationResult {
        const baseValidation = super.validate();
        const errors: string[] = [...baseValidation.errors];
        const warnings: string[] = [...(baseValidation.warnings || [])];

        if (this.mass <= 0 || !isFinite(this.mass)) {
            errors.push("Massa deve ser positiva e finita");
        }

        if (!Vec3Operations.isValid(this.velocity)) {
            errors.push("Velocidade inválida");
        }

        if (!Vec3Operations.isValid(this.acceleration)) {
            errors.push("Aceleração inválida");
        }

        return {
            isValid: errors.length === 0,
            errors,
            ...(warnings.length > 0 ? { warnings } : {}),
        };
    }

    /**
     * Cria uma cópia do componente
     */
    public override clone(): PhysicsComponent {
        return this.withChanges({});
    }

    /**
     * Verifica se dois PhysicsComponents são iguais
     */
    public override equals(other: PhysicsComponent): boolean {
        return (
            super.equals(other) &&
            this.mass === other.mass &&
            Vec3Operations.equals(this.velocity, other.velocity) &&
            Vec3Operations.equals(this.acceleration, other.acceleration) &&
            this.useGravity === other.useGravity
        );
    }

    /**
     * Converte para string (para debugging)
     */
    public override toString(): string {
        return `PhysicsComponent(mass:${this.mass}, vel:(${this.velocity.x},${this.velocity.y},${this.velocity.z}), acc:(${this.acceleration.x},${this.acceleration.y},${this.acceleration.z}), gravity:${this.useGravity})`;
    }

    /**
     * Cria uma nova instância com mudanças específicas
     */
    private withChanges(changes: Partial<PhysicsComponentData>): PhysicsComponent {
        return new PhysicsComponent({
            mass: changes.mass ?? this.mass,
            velocity: changes.velocity ?? this.velocity,
            acceleration: changes.acceleration ?? this.acceleration,
            useGravity: changes.useGravity ?? this.useGravity,
        });
    }

    /**
     * Factory method para criar PhysicsComponent
     */
    public static create(data: PhysicsComponentData = {}): PhysicsComponent {
        return new PhysicsComponent(data);
    }
}
