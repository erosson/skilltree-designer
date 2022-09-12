import * as M from './model'
import * as C from './coords'
import { assertNever } from './util'

export interface Node {
    id: M.NodeId
    x: number
    y: number
}
export interface Edge {
    a: M.NodeId
    b: M.NodeId
}
// TODO: define groups like XYGroup<El>. For input, El = Node. For output, El = NodeId, and there's a top-level list of nodes. Need to remove edge list from groups too though...
export type Group = any // TODO
export interface Tree {
    nodes: Node[]
    edges: Edge[]
    groups: Group[]
}

export function output(es: M.Element[]): Tree {
    return merge(es.map(output_))
}
function output_(e: M.Element): Tree {
    switch (e.type) {
        case M.ElementType.Node: return { nodes: [outputNode(e)], edges: [], groups: [] }
        case M.ElementType.Edges: return outputEdges(e)
        case M.ElementType.Offset: return outputOffset(e)
        case M.ElementType.Orbit: return output(M.orbitToOffsets(e))
        default: throw assertNever(e)
    }
}
function outputNode(n: M.Node): Node {
    return {
        id: n.id,
        x: 0,
        y: 0,
    }
}
function offsetXY(c: C.XYCoords, o: Tree): Tree {
    return {
        ...o,
        nodes: o.nodes.map(n => ({
            ...n,
            x: n.x + c.x,
            y: n.y + c.y
        })),
    }
}
function offset(c: C.Coords, o: Tree): Tree {
    return offsetXY(C.toXY(c), o)
}
function merge(os: Tree[]): Tree {
    return {
        nodes: os.map(o => o.nodes).flat(),
        edges: os.map(o => o.edges).flat(),
        groups: os.map(o => o.groups).flat(),
    }
}
function outputEdges(g: M.Edges): Tree {
    const o = output(g.els)
    const out = {
        nodes: o.nodes,
        groups: o.groups,
        edges: o.edges.concat(g.edges.map(([a, b]) => ({ a, b }))),
    }
    // out.groups.push(...)
    return out
}
function outputOffset(g: M.Offset): Tree {
    const out = offset(g.offset, output(g.els))
    // out.groups.push(...)
    return out
}