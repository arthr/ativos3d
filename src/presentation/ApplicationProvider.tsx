import React, { createContext, useContext } from "react";
import type { JSX } from "react";
import type { Application } from "../Application";

/**
 * Fornece a instância da aplicação para a árvore React.
 */
const ApplicationContext = createContext<Application | null>(null);

interface ApplicationProviderProps {
    readonly application: Application;
    readonly children: React.ReactNode;
}

/**
 * Componente responsável por expor a aplicação via contexto React.
 */
export function ApplicationProvider({
    application,
    children,
}: ApplicationProviderProps): JSX.Element {
    return (
        <ApplicationContext.Provider value={application}>{children}</ApplicationContext.Provider>
    );
}

/**
 * Hook para acessar a instância da aplicação.
 */
export function useApplication(): Application {
    const context = useContext(ApplicationContext);
    if (!context) {
        throw new Error("useApplication deve ser utilizado dentro de ApplicationProvider");
    }
    return context;
}
