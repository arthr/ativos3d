/**
 * Módulo de Geometria
 *
 * Este módulo contém todas as implementações relacionadas à geometria 3D,
 * incluindo tipos, factories, operações, matemática e utilitários.
 */

// Tipos
export * from "./types";

// Factories
export { Vec2Factory } from "./factories/Vec2Factory";
export { Vec3Factory } from "./factories/Vec3Factory";

// Operações
export { Vec2Operations } from "./operations/Vec2Operations";
export { Vec3Operations } from "./operations/Vec3Operations";

// Matemática
export { Vec2Math } from "./math/Vec2Math";
export { Vec3Math } from "./math/Vec3Math";

// Utilitários
export { Vec2Utils } from "./utils/Vec2Utils";
export { Vec3Utils } from "./utils/Vec3Utils";
