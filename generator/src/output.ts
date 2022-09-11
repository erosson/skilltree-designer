import * as M from './model'

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

export function output(e: M.Element): Tree {
    switch (e.type) {
        case M.ElementType.Node: return { nodes: [outputNode(e)], edges: [], groups: [] }
        case M.ElementType.EdgeGroup: return outputEdgeGroup(e)
        case M.ElementType.XYGroup: return outputXYGroup(e)
        case M.ElementType.OrbitGroup: return outputOrbitGroup(e)
        default: throw new Error(((exhaustive: never) => "unreachable")(e))
    }
}
function outputNode(n: M.Node): Node {
    return {
        id: n.id,
        x: 0,
        y: 0,
    }
}
function offsetXY([x, y]: M.XY, o: Tree): Tree {
    return {
        ...o,
        nodes: o.nodes.map(n => ({
            ...n,
            x: n.x + x,
            y: n.y + y
        })),
    }
}
function offsetPolar(radius: number, angleRadians: number, o: Tree): Tree {
    // like math classes:
    //   +y 
    // -x  +x
    //   -y
    // const theta = -(angleRadians - Math.PI / 2)

    // like html:
    //   -y 
    // -x  +x
    //   +y
    const theta = angleRadians - Math.PI / 2
    const x = Math.round(radius * Math.cos(theta))
    const y = Math.round(radius * Math.sin(theta))
    return offsetXY([x, y], o)
}
function merge(os: Tree[]): Tree {
    return {
        nodes: os.map(o => o.nodes).flat(),
        edges: os.map(o => o.edges).flat(),
        groups: os.map(o => o.groups).flat(),
    }
}
function outputEdgeGroup(g: M.EdgeGroup): Tree {
    const o = output(g.el)
    const out = {
        nodes: o.nodes,
        groups: o.groups,
        edges: o.edges.concat(g.edges.map(([a, b]) => ({ a, b }))),
    }
    // out.groups.push(...)
    return out
}
function outputXYGroup(g: M.XYGroup): Tree {
    const out = merge(g.els.map(([xy, el]) => offsetXY(xy, output(el))))
    // out.groups.push(...)
    return out
}
function outputOrbitGroup(g: M.OrbitGroup): Tree {
    const out = merge(g.orbits.map(o =>
        o.els.map(([slice, el]) =>
            offsetPolar(o.radius, 2 * Math.PI * slice / o.slices, output(el))
        )
    ).flat().concat(g.origin ? [output(g.origin)] : []))
    // out.groups.push(...)
    return out
}