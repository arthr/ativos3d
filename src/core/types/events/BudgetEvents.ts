import type { EntityId } from "../Entity";

/**
 * Eventos de orçamento
 */
export interface BudgetEvents {
    budgetChanged: {
        funds: number;
        spent: number;
        available: number;
    };

    purchaseAttempted: {
        entityId: EntityId;
        cost: number;
        success: boolean;
    };

    budgetLimitReached: {
        required: number;
        available: number;
    };
}
