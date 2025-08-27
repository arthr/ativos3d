import { DeveloperPanel } from "@presentation/panels/DeveloperPanel";

/**
 * Componente principal da aplicação
 */
export function App() {
    const params = new URLSearchParams(window.location.search);
    const showDebug = import.meta.env.DEV && params.has("debug");

    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            Ativos3D
            {showDebug && <DeveloperPanel />}
        </div>
    );
}

export default App;
