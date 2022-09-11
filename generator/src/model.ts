export type Element = Node | Group
export enum ElementType {
    Node = "node",
    EdgeGroup = "edge",
    XYGroup = "xy",
    OrbitGroup = "orbit",
}

export interface Node {
    type: ElementType.Node
    id: NodeId
    body: object
}
export type NodeId = string & { readonly __tag: unique symbol }
export type Edge = [NodeId, NodeId]

export type Group = EdgeGroup | XYGroup | OrbitGroup

export interface EdgeGroup {
    type: ElementType.EdgeGroup
    edges: Edge[]
    el: Element
}
export interface XYGroup {
    type: ElementType.XYGroup
    els: [XY, Element][]
}
export type XY = [number, number]

export interface OrbitGroup {
    type: ElementType.OrbitGroup
    orbits: Orbit[]
    origin?: Element
}
export interface Orbit {
    radius: number
    slices: number
    els: [number, Element][]
}

let _autoNodeId: number = 0
function autoNodeId(): NodeId {
    _autoNodeId += 1
    return `_node_${_autoNodeId}` as NodeId
}

export function node(id: string | NodeId, body: object): Node
export function node(id: string | NodeId): Node
export function node(body: object): Node
export function node(): Node
export function node(idOrBody?: string | NodeId | object, body: object = {}): Node {
    if (idOrBody === undefined) {
        return { type: ElementType.Node, id: autoNodeId(), body }
    }
    else if (typeof idOrBody === 'string') {
        return { type: ElementType.Node, id: idOrBody as NodeId, body }
    }
    else {
        return { type: ElementType.Node, id: autoNodeId(), body: idOrBody as object }
    }
}
export function edge(a: string | NodeId, b: string | NodeId): Edge {
    return [a as NodeId, b as NodeId]
}
export function edges(el: Element, edges: Edge[]): EdgeGroup {
    const ids: Set<NodeId> = new Set(getDescendantNodes(el).map(n => n.id));
    console.log(JSON.stringify(el, null, 2))
    for (let edge of edges) {
        for (let v of edge) {
            if (!ids.has(v)) {
                throw new Error(`can't have edge to nonexistent node: ${v}. available: ${Array.from(ids)}`)
            }
        }
    }
    return { type: ElementType.EdgeGroup, edges, el }
}
export function xy(els: [XY, Element][]): XYGroup {
    return { type: ElementType.XYGroup, els }
}
export function orbits(orbs: Orbit[], origin?: Element): OrbitGroup {
    return { type: ElementType.OrbitGroup, orbits: orbs, origin }
}
export function orbit(els: [number, Element][], { radius, slices }: { radius: number, slices: number }): Orbit {
    return { radius, slices, els }
}

function getChildren(el: Element): Element[] {
    switch (el.type) {
        case ElementType.Node: return []
        case ElementType.EdgeGroup: return [el.el]
        case ElementType.XYGroup: return el.els.map(([xy, e]) => e).flat()
        case ElementType.OrbitGroup: return el.orbits.map(o => o.els.map(([slice, e]) => e)).flat().concat(el.origin ? [el.origin] : []).flat()
        default: throw new Error(((exhaustive: never) => "unreachable")(el))
    }
}
export function getDescendantNodes(el: Element): Node[] {
    switch (el.type) {
        case ElementType.Node: return [el]
        default: return getChildren(el).map(getDescendantNodes).flat()
    }
}
export function getDescendantEdges(el: Element): Edge[] {
    switch (el.type) {
        case ElementType.EdgeGroup: return el.edges
        default: return getChildren(el).map(getDescendantEdges).flat()
    }
}