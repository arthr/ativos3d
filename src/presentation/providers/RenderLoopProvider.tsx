import type { JSX } from "react";
import { useFrame } from "@react-three/fiber";
import { useApplication } from "../hooks/useApplication";

/**
 * Provider que integra o RenderLoop ao ciclo de frames do R3F.
 */
export function RenderLoopProvider(): JSX.Element {
    const { renderLoop } = useApplication();
    useFrame((_, delta) => {
        renderLoop.tick(delta);
    });
    return <></>;
}
