/**
 * Setup global para testes
 */

import "@testing-library/jest-dom";

interface Vector3 {
    x: number;
    y: number;
    z: number;
}

interface Raycaster {
    setFromCamera: () => void;
    intersectObjects: () => unknown[];
}

interface Camera {}

interface Scene {
    children: unknown[];
    add: (...objects: unknown[]) => void;
    remove: (...objects: unknown[]) => void;
}

interface WebGLRenderer {
    setSize: () => void;
    render: () => void;
}

interface ThreeMock {
    Vector3: new (x?: number, y?: number, z?: number) => Vector3;
    Raycaster: new () => Raycaster;
    Camera: new () => Camera;
    Scene: new () => Scene;
    WebGLRenderer: new () => WebGLRenderer;
}

interface UseThreeResult {
    camera: Camera;
    scene: Scene;
    gl: WebGLRenderer;
}

type UseThree = () => UseThreeResult;
type Create = <T>() => () => T;

declare global {
    var THREE: ThreeMock;
    var useThree: UseThree;
    var create: Create;
}

// Mock do Three.js para testes
global.THREE = {
    Vector3: class {
        x: number;
        y: number;
        z: number;

        constructor(x = 0, y = 0, z = 0) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
    },
    Raycaster: class {
        constructor() {}
        setFromCamera(): void {}
        intersectObjects(): unknown[] {
            return [];
        }
    },
    Camera: class {},
    Scene: class {
        children: unknown[];

        constructor() {
            this.children = [];
        }
        add(...objects: unknown[]): void {
            this.children.push(...objects);
        }
        remove(...objects: unknown[]): void {
            this.children = this.children.filter((child) => !objects.includes(child));
        }
    },
    WebGLRenderer: class {
        constructor() {}
        setSize(): void {}
        render(): void {}
    },
} as ThreeMock;

// Mock do React Three Fiber
(global as { useThree: UseThree }).useThree = () => ({
    camera: new global.THREE.Camera(),
    scene: new global.THREE.Scene(),
    gl: new global.THREE.WebGLRenderer(),
});

// Mock do Zustand
(global as { create: Create }).create =
    <T>() =>
    () =>
        ({}) as T;
