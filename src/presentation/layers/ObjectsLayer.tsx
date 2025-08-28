import { Suspense, useCallback } from "react";
import type { JSX } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { useRenderObjects } from "@presentation/hooks/useRenderObjects";
import { useApplication } from "@presentation/hooks/useApplication";

/**
 * ObjectsLayer: materializa RenderComponents do domínio em nós R3F.
 * Usa TransformComponent se disponível para posição/rotação/escala.
 */
/**
 * ObjectsLayer: materializa RenderComponents do domínio em nós R3F.
 * - Usa TransformComponent se disponível para posição/rotação/escala.
 * - Suporta modelo via GLTF (modelUrl) ou geometria primitiva.
 * - Emite eventos de interação no EventBus: objectSelected / objectHovered.
 */
export function ObjectsLayer(): JSX.Element {
    const { list } = useRenderObjects();
    const { eventBus } = useApplication();

    return (
        <>
            {list.map(({ entityId, render, transform }) => {
                const position: [number, number, number] = transform
                    ? [transform.position.x, transform.position.y, transform.position.z]
                    : [0, 0, 0];
                const rotation: [number, number, number] = transform
                    ? [transform.rotation.x, transform.rotation.y, transform.rotation.z]
                    : [0, 0, 0];
                const scale: [number, number, number] = transform
                    ? [transform.scale.x, transform.scale.y, transform.scale.z]
                    : [1, 1, 1];

                const matProps = materialProps(render.material);
                const handleDown = useCallback(() => {
                    eventBus.emit("objectSelected", { entityId });
                }, [eventBus, entityId]);
                const handleOver = useCallback(() => {
                    eventBus.emit("objectHovered", { entityId });
                }, [eventBus, entityId]);

                return (
                    <group key={entityId} position={position} rotation={rotation} scale={scale}>
                        <Suspense fallback={null}>
                            {render.modelUrl ? (
                                <ModelNode
                                    url={render.modelUrl}
                                    color={render.color}
                                    textureUrl={render.textureUrl}
                                    material={matProps}
                                    visible={render.visible}
                                    onPointerDown={handleDown}
                                    onPointerOver={handleOver}
                                />
                            ) : (
                                <BoxNode
                                    color={render.color}
                                    material={matProps}
                                    visible={render.visible}
                                    onPointerDown={handleDown}
                                    onPointerOver={handleOver}
                                />
                            )}
                        </Suspense>
                    </group>
                );
            })}
        </>
    );
}

/**
 * Mapeia a configuração de material do domínio para props do material R3F.
 */
function materialProps(material: {
    type: "basic" | "phong" | "lambert" | "standard" | "physical";
    opacity: number;
    transparent: boolean;
    receiveShadow: boolean;
    castShadow: boolean;
    roughness?: number;
    metalness?: number;
}): Record<string, unknown> {
    // Mantemos uma superfície comum usando meshStandardMaterial; ignoramos tipos específicos.
    // Early return para simplicidade e legibilidade.
    return {
        opacity: material.opacity,
        transparent: material.transparent,
        roughness: material.roughness ?? 0.8,
        metalness: material.metalness ?? 0.0,
    };
}

/**
 * Node com geometria primitiva (box) para fallback rápido.
 */
function BoxNode({
    color,
    material,
    visible,
    onPointerDown,
    onPointerOver,
}: {
    readonly color: string;
    readonly material: Record<string, unknown>;
    readonly visible: boolean;
    readonly onPointerDown: () => void;
    readonly onPointerOver: () => void;
}): JSX.Element {
    return (
        <mesh
            visible={visible}
            castShadow
            receiveShadow
            onPointerDown={onPointerDown}
            onPointerOver={onPointerOver}
        >
            <boxGeometry />
            <meshStandardMaterial color={color} {...material} />
        </mesh>
    );
}

/**
 * Node que carrega um GLTF quando `url` é fornecida.
 */
function ModelNode({
    url,
    color,
    textureUrl,
    material,
    visible,
    onPointerDown,
    onPointerOver,
}: {
    readonly url: string;
    readonly color: string;
    readonly textureUrl?: string;
    readonly material: Record<string, unknown>;
    readonly visible: boolean;
    readonly onPointerDown: () => void;
    readonly onPointerOver: () => void;
}): JSX.Element {
    const gltf = useGLTF(url, true);
    const map = textureUrl ? useTexture(textureUrl) : undefined;
    return (
        <primitive
            object={(gltf as any).scene.clone()}
            visible={visible}
            onPointerDown={onPointerDown}
            onPointerOver={onPointerOver}
        >
            {/* Aplica material básico na raiz se possível */}
            {/* Em modelos complexos, materiais específicos dos meshes prevalecem */}
            <meshStandardMaterial attach="material" color={color} map={map as any} {...material} />
        </primitive>
    );
}

// Dica de performance: cache GLTF
useGLTF.preload?.("/models/example.gltf");
