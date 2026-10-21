# Knowledge: xyflow / React Flow
**Tipo:** referencial
**Status:** em construção — incrementar com nós customizados do projeto
**Versão:** 1.0
**Fonte:** documentação oficial + uso interno

> Este arquivo é consultado por skills procedurais quando a feature envolve canvas ou diagramas.
> NÃO é uma skill de execução — não define fluxo, define conhecimento.
> Incremente com padrões de uso interno conforme novos nós customizados forem criados.

---

## 1. Conceitos Fundamentais

### ReactFlow Provider
```typescript
import ReactFlow, { ReactFlowProvider } from '@xyflow/react'

// Sempre envolva em ReactFlowProvider quando precisar de acesso ao store fora do componente
<ReactFlowProvider>
  <DiagramCanvas />
</ReactFlowProvider>
```

### Tipos base
```typescript
import type { Node, Edge, NodeProps, EdgeProps } from '@xyflow/react'

// Node tipado
type DiagramNode = Node<{ label: string; status: string }, 'custom-type'>

// Edge tipada
type DiagramEdge = Edge<{ animated: boolean }>
```

---

## 2. Nós (Nodes)

### Estrutura de um nó customizado
```typescript
import { Handle, Position, type NodeProps } from '@xyflow/react'

type CustomNodeData = {
  label: string
  // campos customizados
}

export const CustomNode = ({ data, selected }: NodeProps<CustomNodeData>) => {
  return (
    <div className={`custom-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Top} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}
```

### Registrar nós customizados
```typescript
const nodeTypes = {
  'custom-type': CustomNode,
  // registre todos os tipos aqui
}

<ReactFlow nodeTypes={nodeTypes} ... />
```

### Handles
```typescript
// Handle de entrada
<Handle type="target" position={Position.Top} id="input" />

// Handle de saída
<Handle type="source" position={Position.Bottom} id="output" />

// Handle com posição customizada
<Handle
  type="source"
  position={Position.Right}
  style={{ top: '30%' }}
  id="conditional"
/>
```

---

## 3. Edges (Arestas)

### Edge customizada
```typescript
import { BaseEdge, EdgeLabelRenderer, getStraightPath, type EdgeProps } from '@xyflow/react'

export const CustomEdge = ({
  sourceX, sourceY, targetX, targetY,
  label, markerEnd, style
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getStraightPath({ sourceX, sourceY, targetX, targetY })

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div style={{ transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)` }}>
          {label}
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
```

### Tipos de path disponíveis
```typescript
import {
  getStraightPath,    // linha reta
  getBezierPath,      // curva bezier (default)
  getSmoothStepPath,  // degraus suavizados
  getSimpleBezierPath // bezier simplificado
} from '@xyflow/react'
```

---

## 4. Estado e Controle

### useReactFlow — acesso programático
```typescript
import { useReactFlow } from '@xyflow/react'

const { getNodes, getEdges, setNodes, setEdges, fitView, zoomIn, zoomOut } = useReactFlow()

// Atualizar dado de um nó específico
const updateNodeData = (nodeId: string, data: Partial<NodeData>) => {
  setNodes(nodes => nodes.map(node =>
    node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
  ))
}
```

### useNodesState / useEdgesState
```typescript
import { useNodesState, useEdgesState } from '@xyflow/react'

const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
```

### onConnect — criar edges via drag
```typescript
import { addEdge, type Connection } from '@xyflow/react'

const onConnect = useCallback((connection: Connection) => {
  setEdges(edges => addEdge(connection, edges))
}, [setEdges])
```

---

## 5. Eventos

```typescript
<ReactFlow
  onNodeClick={(event, node) => {}}
  onNodeDoubleClick={(event, node) => {}}
  onNodeDragStop={(event, node) => {}}   // ← persistir posição aqui
  onEdgeClick={(event, edge) => {}}
  onConnect={onConnect}
  onNodesDelete={(nodes) => {}}
  onEdgesDelete={(edges) => {}}
  onSelectionChange={({ nodes, edges }) => {}}
/>
```

---

## 6. Viewport e Câmera

```typescript
const { fitView, setViewport, getViewport } = useReactFlow()

// Ajustar zoom para mostrar todos os nós
fitView({ padding: 0.2, duration: 500 })

// Persistir e restaurar viewport
const viewport = getViewport() // { x, y, zoom }
setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 300 })
```

---

## 7. Serialização e Persistência

```typescript
// Exportar estado atual
const { toObject } = useReactFlow()
const flow = toObject() // { nodes, edges, viewport }

// Persistir
await saveUseCase.execute({ diagramId, flow: JSON.stringify(flow) })

// Restaurar
const { nodes, edges, viewport } = JSON.parse(savedFlow)
setNodes(nodes)
setEdges(edges)
setViewport(viewport)
```

---

## 8. Performance

```typescript
// Memorizar nodeTypes e edgeTypes FORA do componente
// ❌ errado — recria o objeto a cada render
const Component = () => (
  <ReactFlow nodeTypes={{ custom: CustomNode }} />
)

// ✅ correto — estável entre renders
const nodeTypes = { custom: CustomNode }
const Component = () => (
  <ReactFlow nodeTypes={nodeTypes} />
)
```

---

## 9. Nós Customizados do Projeto

> ⚠️ Seção em construção — adicione cada nó customizado conforme for criado.
> Inclua: tipo, props, handles, comportamento especial e exemplo de uso.

### Convenção de nomenclatura do projeto
```
[domain]-[role]-node     ex: diagram-task-node, diagram-status-node
[domain]-[role]-edge     ex: diagram-sequence-edge
```

### Nós implementados

```
// TODO — documente aqui cada nó customizado criado no projeto:
// - Nome e tipo registrado em nodeTypes
// - Interface de dados (NodeData type)
// - Handles disponíveis (id, tipo, posição)
// - Comportamentos especiais (status, assignees, references, docs)
// - Exemplo de instância
```

---

## 10. Integração com a Arquitetura do Projeto

### View-Model de diagrama
```typescript
// use-cases orquestram persistência — ReactFlow gerencia estado visual
export const useDiagramViewModel = (diagramId: string) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const { setViewport } = useReactFlow()

  const saveUseCase = makeSaveDiagramUseCase('front')
  const loadUseCase = makeLoadDiagramUseCase('front')

  // Debounce na persistência — não salva a cada pixel de drag
  const handleSave = useDebouncedCallback(async () => {
    const flow = { nodes, edges }
    await saveUseCase.execute({ diagramId, flow })
  }, 1000)

  const onNodeDragStop = () => handleSave()

  return { nodes, edges, onNodesChange, onEdgesChange, onNodeDragStop }
}
```

### Zustand para estado de seleção e interação
```typescript
// Estado de UI pesado (seleção múltipla, modo de edição, painel lateral)
// fica no store — não no view-model
interface DiagramStore {
  selectedNodes: string[]
  editingNode: string | null
  sidebarOpen: boolean
  setSelectedNodes: (ids: string[]) => void
  openNodeEditor: (id: string) => void
}
```
