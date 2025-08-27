/**
 * Ponto de entrada principal da aplicação Ativos3D
 *
 * Este arquivo será o ponto de entrada quando a nova arquitetura estiver implementada.
 * Por enquanto, serve como placeholder para a estrutura futura.
 */
import React from "react";
import { createRoot } from "react-dom/client";
import { EventBus } from "@core/events/EventBus";
import { Application } from "./Application";
import { ApplicationProvider } from "@presentation/ApplicationProvider";
import { App } from "@presentation/App";

const eventBus = new EventBus();
export const application = new Application(eventBus);

// TODO: Configurar injeção de dependência
// TODO: Inicializar sistemas principais
// TODO: Montar interface do usuário

application.resolve("renderSystem").start();

const rootElement = document.getElementById("root") as HTMLElement;
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
        React.createElement(
            React.StrictMode,
            null,
            <ApplicationProvider application={application}>
                <App />
            </ApplicationProvider>,
        ),
    );
} else {
    console.error('Elemento com id "root" não encontrado.');
}
