import type { ValidationResult } from "@core/types/ecs/Component";
import type {
    ToolComponent as IToolComponent,
    ToolComponentData,
} from "@core/types/components/ToolComponent";
import type { ToolType, ModeType } from "@core/types";
import { DEFAULT_TOOL, MODES, TOOLS } from "@core/types/components/ToolComponent";
import { BaseComponent } from "./BaseComponent";

/**
 * Componente de estado de ferramenta
 *
 * Armazena a ferramenta e o modo de operação atuais.
 * Todas as modificações retornam uma nova instância para manter imutabilidade.
 */
export class ToolComponent extends BaseComponent implements IToolComponent {
    public readonly type = "ToolComponent";

    public readonly tool: ToolType;
    public readonly mode: ModeType;

    constructor(data: ToolComponentData = {}) {
        super("ToolComponent");
        this.tool = data.tool ?? DEFAULT_TOOL.tool;
        this.mode = data.mode ?? DEFAULT_TOOL.mode;
    }

    /** Define a ferramenta ativa */
    public setTool(tool: ToolType): ToolComponent {
        return this.withChanges({ tool });
    }

    /** Define o modo ativo */
    public setMode(mode: ModeType): ToolComponent {
        return this.withChanges({ mode });
    }

    /** Verifica se os dados do componente são válidos */
    public isValid(): boolean {
        const validation = this.validate();
        return validation.isValid;
    }

    /** Validação específica do ToolComponent */
    public override validate(): ValidationResult {
        const baseValidation = super.validate();
        const errors: string[] = [...baseValidation.errors];
        const warnings: string[] = [...(baseValidation.warnings || [])];

        if (!this.isValidTool(this.tool)) {
            errors.push("Ferramenta inválida");
        }

        if (!this.isValidMode(this.mode)) {
            errors.push("Modo inválido");
        }

        return {
            isValid: errors.length === 0,
            errors,
            ...(warnings.length > 0 ? { warnings } : {}),
        };
    }

    /** Cria uma cópia do componente */
    public override clone(): ToolComponent {
        return this.withChanges({});
    }

    /** Verifica se dois ToolComponents são iguais */
    public override equals(other: ToolComponent): boolean {
        return super.equals(other) && this.tool === other.tool && this.mode === other.mode;
    }

    /** Converte o componente para string */
    public override toString(): string {
        return `ToolComponent(tool:${this.tool}, mode:${this.mode})`;
    }

    /** Cria nova instância com mudanças específicas */
    private withChanges(changes: Partial<ToolComponentData>): ToolComponent {
        return new ToolComponent({
            tool: changes.tool ?? this.tool,
            mode: changes.mode ?? this.mode,
        });
    }

    /** Verifica se a ferramenta é válida */
    private isValidTool(tool: ToolType): boolean {
        return TOOLS.includes(tool);
    }

    /** Verifica se o modo é válido */
    private isValidMode(mode: ModeType): boolean {
        return MODES.includes(mode);
    }
}
