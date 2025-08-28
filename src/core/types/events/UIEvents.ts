import type { ToastVariant } from "../ui/UITypes";

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

    /**
     * Visibilidade do Gizmo (orientação) alterada via UI
     */
    gizmoVisibilityChanged: {
        show: boolean;
    };

    /**
     * Configuração da Grid alterada via UI (DeveloperPanel)
     */
    gridConfigChanged: {
        followCamera?: boolean;
        infiniteGrid?: boolean;
    };
}
