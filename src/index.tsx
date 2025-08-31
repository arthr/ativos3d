/**
 * Ponto de entrada principal da aplicação Ativos3D
 *
 * Este arquivo será o ponto de entrada quando a nova arquitetura estiver implementada.
 * Por enquanto, serve como placeholder para a estrutura futura.
 */
import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "@presentation/App";
import "./index.css";
import { initializeApplication } from "./applicationInstance";

// TODO: Configurar injeção de dependência
// TODO: Inicializar sistemas principais
// TODO: Montar interface do usuário

const rootElement = document.getElementById("root") as HTMLElement;
if (rootElement) {
    initializeApplication({ width: window.innerWidth, height: window.innerHeight }, window);
    const root = createRoot(rootElement);
    root.render(React.createElement(React.StrictMode, null, React.createElement(App, null)));
} else {
    throw new Error('Elemento com id "root" não encontrado.');
}
