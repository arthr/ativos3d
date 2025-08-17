/**
 * Setup global para testes
 */

import '@testing-library/jest-dom';

// Declaração global para TypeScript
declare global {
  var THREE: any;
  var useThree: any;
  var create: any;
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
    setFromCamera() {}
    intersectObjects() {
      return [];
    }
  },
  Camera: class {
    constructor() {}
  },
  Scene: class {
    children: any[];
    
    constructor() {
      this.children = [];
    }
    add() {}
    remove() {}
  },
  WebGLRenderer: class {
    constructor() {}
    setSize() {}
    render() {}
  },
};

// Mock do React Three Fiber
(global as any).useThree = () => ({
  camera: new (global as any).THREE.Camera(),
  scene: new (global as any).THREE.Scene(),
  gl: new (global as any).THREE.WebGLRenderer(),
});

// Mock do Zustand
(global as any).create = () => () => ({});
