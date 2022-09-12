import * as C from './coords'
import { assertNever } from './util'

export type Element = Node | Edges | Offset | Orbit | Rotate
export enum ElementType {
    Node = "node",
    Edges = "edges",
    Offset = "offset",
    Orbit = "orbit",
    Rotate = "rotate",
}

export interface Node {
    type: ElementType.Node
    id: NodeId
    body: object
}
export type NodeId = string & { readonly __tag: unique symbol }

export type Edge = [NodeId, NodeId]
export interface Edges {
    type: ElementType.Edges
    edges: Edge[]
    els: Element[]
}
export interface Offset {
    type: ElementType.Offset
    offset: C.Coords
    els: Element[]
}
export interface Rotate {
    type: ElementType.Rotate
    angle: C.Angle
    els: Element[]
}

/**
 * Path of Exile-style orbits
 * 
 * PoE builds much of their skill trees using orbits. An orbit has a radius and a number of "slices"; each element specifies which slice it's placed on.
 * Forcing radius to be set in one place and having consistent slice sizes seems to do a nice job of keeping their trees looking nice.
 */
export interface Orbit {
    type: ElementType.Orbit
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
export function edges(els: Element[], edges: Edge[]): Edges {
    const ids: Set<NodeId> = new Set(getDescendantNodes(els).map(n => n.id));
    for (let edge of edges) {
        for (let v of edge) {
            if (!ids.has(v)) {
                throw new Error(`can't have edge to nonexistent node: ${v}. available: ${Array.from(ids)}`)
            }
        }
    }
    return { type: ElementType.Edges, edges, els }
}
function edgeLoop_(els: Element[]): Edge[] {
    const nodes = getDescendantNodes(els)
    return nodes.map((node, i) => edge(node.id, nodes[(i + 1) % nodes.length].id))
}
export function edgesLoop(els: Element[]): Edges {
    return edges(els, edgeLoop_(els))
}
export function edgesLine(els: Element[]): Edges {
    return edges(els, edgeLoop_(els).slice(0, -1))
}
export function offset(els: Element[], offset: C.Coords): Offset {
    return { type: ElementType.Offset, els, offset }
}
export function orbit(els: [number, Element][], { radius, slices }: { radius: number, slices: number }): Orbit {
    return { type: ElementType.Orbit, radius, slices, els }
}
export function orbitToOffsets(os: Orbit): Offset[] {
    return os.els.map(([slice, el]) => {
        // angles go counterclockwise, and start from straight-right
        // poe-style orbits go clockwise, and start from straight-up
        const angle = C.revolutions(-slice / os.slices - 1 / 4)
        const off = C.polar(os.radius, angle)
        return offset([el], off)
    })
}

function getChildren(el: Element): Element[] {
    switch (el.type) {
        case ElementType.Node: return []
        case ElementType.Edges: return el.els
        case ElementType.Offset: return el.els
        case ElementType.Orbit: return el.els.map(([slice, el]) => el)
        case ElementType.Rotate: return el.els
        default: throw assertNever(el)
    }
}

function getNodesWithAncestors_(el: Element): [Node, Element[]][] {
    switch (el.type) {
        case ElementType.Node: return [[el, []]]
        default: return getChildren(el).map(getNodesWithAncestors_).flat().map(([c, as]) => [c, [...as, el]])
    }
}
export function getNodesWithAncestors(els: Element[]): [Node, Element[]][] {
    return els.map(getNodesWithAncestors_).flat()
}
export function getDescendantNodes(els: Element[]): Node[] {
    return getNodesWithAncestors(els).map(([c, as]) => c)
}

function getEdgesWithAncestors_(el: Element): [Edge, Element[]][] {
    switch (el.type) {
        case ElementType.Edges: return el.edges.map(e => [e, []])
        default: return getChildren(el).map(getEdgesWithAncestors_).flat().map(([c, as]) => [c, [...as, el]])
    }
}
export function getEdgesWithAncestors(els: Element[]): [Edge, Element[]][] {
    return els.map(getEdgesWithAncestors_).flat()
}
export function getDescendantEdges(els: Element[]): Edge[] {
    return getEdgesWithAncestors(els).map(([c, as]) => c)
}