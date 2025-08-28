import type { JSX } from "react";
import { useFrame } from "@react-three/fiber";
import { application } from "@/applicationInstance";

/**
 * Provider que integra o RenderLoop ao ciclo de frames do R3F.
 */
export function RenderLoopProvider(): JSX.Element {
    const renderLoop = application.resolve("renderLoop");
    useFrame((_, delta) => {
        renderLoop.tick(delta);
    });
    return <></>;
}
