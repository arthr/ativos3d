import type { JSX } from "react";
import type { EntityId } from "@core/types/ecs/EntityId";
import type { RenderComponent as IRenderComponent } from "@core/types/components/RenderComponent";
import type { TransformComponent as ITransformComponent } from "@core/types/components/TransformComponent";
import type { Texture } from "three";
import { Suspense } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { useApplication } from "@presentation/hooks/useApplication";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/**
 * Item que representa um objeto renderizável na cena.
 * Responsável por emitir eventos de interação e aplicar transformações.
 */
export function ObjectItem({
    entityId,
    render,
    transform,
}: {
    readonly entityId: EntityId;
    readonly render: IRenderComponent;
    readonly transform?: ITransformComponent;
}): JSX.Element {
    const { eventBus } = useApplication();

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

    function handleDown(): void {
        eventBus.emit("entitySelected", { entityId });
    }
    function handleOver(): void {
        eventBus.emit("entityHovered", { entityId });
    }
    function handleOut(): void {
        eventBus.emit("entityUnhovered", { entityId });
    }

    return (
        <group position={position} rotation={rotation} scale={scale}>
            <Suspense fallback={null}>
                {render.modelUrl ? (
                    <ModelNode
                        url={render.modelUrl ?? ""}
                        color={render.color}
                        textureUrl={render.textureUrl ?? ""}
                        material={matProps}
                        visible={render.visible}
                        onPointerDown={handleDown}
                        onPointerOver={handleOver}
                        onPointerOut={handleOut}
                    />
                ) : (
                    <BoxNode
                        color={render.color}
                        material={matProps}
                        visible={render.visible}
                        onPointerDown={handleDown}
                        onPointerOver={handleOver}
                        onPointerOut={handleOut}
                    />
                )}
            </Suspense>
        </group>
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
    onPointerOut,
}: {
    readonly color: string;
    readonly material: Record<string, unknown>;
    readonly visible: boolean;
    readonly onPointerDown: () => void;
    readonly onPointerOver: () => void;
    readonly onPointerOut: () => void;
}): JSX.Element {
    return (
        <mesh
            visible={visible}
            castShadow
            receiveShadow
            onPointerDown={onPointerDown}
            onPointerOver={onPointerOver}
            onPointerOut={onPointerOut}
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
    onPointerOut,
}: {
    readonly url: string;
    readonly color: string;
    readonly textureUrl?: string;
    readonly material: Record<string, unknown>;
    readonly visible: boolean;
    readonly onPointerDown: () => void;
    readonly onPointerOver: () => void;
    readonly onPointerOut: () => void;
}): JSX.Element {
    const gltf = useLoader(GLTFLoader, url);
    const [map] = useTexture(textureUrl ? [textureUrl] : []) as Texture[];
    return (
        <primitive
            object={gltf.scene.clone()}
            visible={visible}
            onPointerDown={onPointerDown}
            onPointerOver={onPointerOver}
            onPointerOut={onPointerOut}
        >
            <meshStandardMaterial attach="material" color={color} map={map ?? null} {...material} />
        </primitive>
    );
}

// Dica de performance: cache GLTF
useGLTF.preload?.("/models/example.gltf");
