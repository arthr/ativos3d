 ## Visão geral rápida
   Já aplica bem Strategy (ferramentas), Command (undo/redo) e Observer/Mediator (eventBus + InputController)
   Pontos de acoplamento e regras concentradas podem se beneficiar de Chain of Responsibility, Factory/Registry, Decorator e abstrações por interface

## Recomendações priorizadas (com arquivos)
   - [x] 1) Chain of Responsibility para validação de colocação
     - Onde: `src/core/placement.ts`
     - Problema: função única valida vários aspectos; vai crescer (bounds, colisão, paredes, clearance)
     - Proposta: pipeline de validadores encadeados e composáveis
       
       ```ts
       export interface PlacementValidator {
         validate(ctx: PlacementContext): ValidationResult;
       }

       export class BoundsValidator implements PlacementValidator { /* ... */ }
       export class CollisionValidator implements PlacementValidator { /* usa índice */ }
       export class ClearanceValidator implements PlacementValidator { /* opcional */ }
       export class NeedsWallValidator implements PlacementValidator { /* portas/janelas */ }

       export function createPlacementPipeline(validators: PlacementValidator[]) {
         return (ctx: PlacementContext): ValidationResult => {
           for (const v of validators) {
             const r = v.validate(ctx);
             if (!r.ok) return r;
           }
           return { ok: true };
         };
       }
       ```
     - Impacto: simplifica evolução das regras e habilita testes unitários independentes por regra

   - [x] 2) Abstrair índice espacial por Strategy
     - Onde: `src/core/spatialIndex.ts`, `src/core/sceneIndex.ts` e usos em Place/Move/Wall
     - Problema: implementação única (grid hashing) — difícil trocar por quadtree/octree sem tocar em várias áreas
     - Proposta: interface `SpatialQueryIndex` e fábricas para escolher implementação por cena/tamanho
       
       ```ts
       export interface SpatialQueryIndex {
         insert(aabb: Aabb): void;
         query(aabb: Aabb): Aabb[];
         clear(): void;
       }
       ```
     - Impacto: evolução de performance sem alterar estratégias/ferramentas

   - [ ] 3) Command “transacional” e coalescimento de drag
     - Onde: `src/core/commandStack.ts`, `src/systems/tools/strategies/MoveStrategy.tsx`, `src/store/useStore.ts`
     - Problema: drag move atual atualiza por frame e commita no pointerUp (ok), mas coalescimento/descrição estão na estratégia
     - Proposta: util de execução
       - `runAndRecord(cmd)` para padronizar execução/registro
       - Evoluir para begin/commit transiente no futuro para composições
     - Impacto: histórico limpo, menor acoplamento nas estratégias

   - [x] 4) Decorator para orçamento
     - Onde: `src/store/useStore.ts` (budget) + comandos que alteram cena em Place/Bulldoze
     - Problema: atualização de `budget.spent` espalhada
     - Proposta: `withBudget(cmd, delta)` aplica/verifica orçamento no execute/undo
       
       ```ts
       export function withBudget(cmd: Command, delta: number): Command {
         return {
           description: cmd.description,
           execute: () => {
             cmd.execute();
             useStore.setState(s => ({ budget: { ...s.budget, spent: s.budget.spent + delta }}));
           },
           undo: () => {
             cmd.undo();
             useStore.setState(s => ({ budget: { ...s.budget, spent: s.budget.spent - delta }}));
           }
         };
       }
       ```
     - Impacto: regras financeiras centralizadas e auditáveis

   - [ ] 5) Inversão de dependência no ToolContext
     - Onde: `src/systems/tools/ToolManager.tsx`, `src/systems/tools/strategies/*`, `src/core/events.ts`
     - Problema: estratégias dependem de singletons (`eventBus`, `useStore.getState()`)
     - Proposta: injetar `events`, seletores e executores de comando via `ToolContext`
     - Impacto: testes facilitados e menor acoplamento

   - [ ] 6) Factory/Registry para estratégias de ferramenta
     - Onde: `src/app/App.tsx`, `src/systems/tools/ToolManager.tsx`
     - Problema: registro hardcoded no `App`
     - Proposta: `ToolRegistry` com `register(tool, factory)` e `get(tool)`; permite lazy-load/code-splitting
     - Impacto: escalabilidade e build modular

   - [ ] 7) State Pattern (opcional) para modos
     - Onde: `src/core/modeMachine.ts`
     - Problema: regras de transição/permitidos podem crescer
     - Proposta: pequena máquina de estados com `enter/exit` por modo (ou lib leve)
     - Impacto: evolução segura e previsível

   - [ ] 8) Flyweight/Cache para materiais/instâncias
     - Onde: `src/systems/render/*`
     - Situação atual: uso de `<Instances>` já ajuda
     - Proposta: `MaterialCache`/`GeometryCache` para compartilhar por cor/definição
     - Impacto: performance em lotes grandes

 - [ ] Pequenos ajustes táticos
   - [ ] `ToolContext` incluir `events`, `select` e `dispatch` mínimos; evitar expor store inteira
   - [x] Garantir cleanup padronizado de listeners em todas estratégias (já bem encaminhado)
   - [ ] `serialization.ts`: preparar version bump e migradores por Strategy

 ## Próximos passos sugeridos (ordem de entrega)
   - [ ] Evoluir Command “transacional”: `runAndRecord` e/ou `begin/commit` para drags compostos
   - [ ] Estender `ToolContext` (injetar `events` e exec de `Command`) e remover dependência de singletons
   - [ ] Opcional: `ToolRegistry` e lazy-load de estratégias
   - [ ] `serialization` com migradores versionados

 ## Trechos do código atual relevantes
   - Strategy das ferramentas em `ToolManager`
     
     ```ts
     export function ToolManager({ strategies }: { strategies: Record<Tool, StrategyFactory> }) {
       const { camera, gl, scene } = useThree();
       const activeTool = useStore((s) => s.activeTool);
       const [current, setCurrent] = useState<ToolStrategy | null>(null);
       const cleanupRef = useRef<(() => void) | undefined>(undefined);
       const ctx = useMemo<ToolContext>(() => ({ camera, gl, scene }), [camera, gl, scene]);

       useEffect(() => {
         if (cleanupRef.current) cleanupRef.current();
         current?.onDeactivate?.();
         const factory = strategies[activeTool];
         if (!factory) { setCurrent(null); return; }
         const instance = factory(ctx);
         const cleanup = instance.onActivate(ctx);
         cleanupRef.current = typeof cleanup === "function" ? cleanup : undefined;
         setCurrent(instance);
         return () => { if (cleanupRef.current) cleanupRef.current(); instance.onDeactivate?.(); };
       }, [activeTool, ctx, strategies]);
     }
     ```

   - Command centralizado
     
     ```ts
     export function executeCommand(cmd: Command, push: (c: Command) => void): void {
       cmd.execute();
       push(cmd);
     }
     ```

   - Event bus tipado
     
     ```ts
     export class EventManager<EventMap extends Record<string, unknown>> {
       private listeners: { [K in keyof EventMap]?: Array<(payload: EventMap[K]) => void> } = {};
       on<K extends keyof EventMap>(event: K, listener: (payload: EventMap[K]) => void): Unsubscribe {
         const arr = (this.listeners[event] ??= []);
         arr.push(listener);
         return () => this.off(event, listener);
       }
       /* ... */
     }
     ```

   - Validação atual (candidata a Chain of Responsibility)
     
     ```ts
     export function validatePlacement(/* ... */): ValidationResult {
       /* bounds + colisão com objetos */
       return { ok: true };
     }
     ```

   - Uso do índice espacial (candidato a Strategy)
     
     ```ts
     export function buildObjectAabbIndex(/* ... */): SpatialQueryIndex { /* ... */ }
     ```

   - Strategy de Place (onde o pipeline entraria)
     
     ```ts
     const valid = fastOk && validatePlacement(/* ctx */).ok;
     ```

   - Strategy de Move (coalescimento no pointerUp → único Command)
     
     ```ts
     const offUp = eventBus.on("pointerUp", () => {
       if (moved) executeCommand(cmd, useStore.getState().pushCommand);
     });
     ```

 ## Status
   - [x] Chain of Responsibility em `placement` (com façade)
   - [x] SpatialQueryIndex (Strategy + fábrica) e `sceneIndex` atualizado
   - [x] `withBudget` aplicado em Place/Bulldoze com validação de saldo e toasts
   - [x] Event bus refatorado para SRP com façade (`core/events/*`)
   - [x] Camera Strategy + `useCameraGestures` em `StageLayer`
   - [x] Correção de posicionamento em `ObjectsLayer` compatível com yaw 90°/270°
   - [x] Sistema de Toast global (limite 5, animações entrada/saída)
   - [x] Hover/press feedback em `Button`
   - [ ] Command transacional (runAndRecord / begin-commit)
   - [ ] DI em `ToolContext`
   - [ ] ToolRegistry
   - [ ] Migradores de `serialization`

 Em resumo
   Plano para: Chain of Responsibility em `placement`, Strategy para índice espacial, Decorator para orçamento, melhorias em Command, DI em `ToolContext`, e Factory/Registry
   Pontos exatos no código indicados, com esboços para guiar implementação
   
