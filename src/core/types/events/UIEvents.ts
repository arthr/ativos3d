import type { ToastVariant } from "../Common";

/**
 * Eventos de UI
 */
export interface UIEvents {
    toastShown: {
        id: string;
        message: string;
        variant: ToastVariant;
        duration?: number;
    };

    toastDismissed: { id: string };

    modalStateChanged: {
        modalId: string;
        opened: boolean;
        data?: unknown;
    };

    panelStateChanged: {
        panelId: string;
        opened: boolean;
    };
}
