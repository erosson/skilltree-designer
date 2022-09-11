import * as React from 'react'
import * as ReactDOM from 'react-dom/server'
import { node } from './model'
import * as O from './output'

export function svg(tree: O.Tree): React.ReactElement {
    const nodesById = Object.fromEntries(tree.nodes.map(n => [n.id, n]))
    const xs = tree.nodes.map(n => n.x)
    const ys = tree.nodes.map(n => n.y)
    const minX = Math.min(...xs) - 5
    const maxX = Math.max(...xs) + 5
    const minY = Math.min(...ys) - 5
    const maxY = Math.max(...ys) + 5
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}>
        {tree.nodes.map(renderNode)}
        {tree.edges.map(edge => renderEdge(edge, nodesById))}
    </svg>
}
export function svgs(tree: O.Tree): string {
    return ReactDOM.renderToString(svg(tree))
}

function renderNode(node: O.Node): React.ReactElement {
    return <circle key={node.id} cx={node.x} cy={node.y} r={3} />
}
function renderEdge(edge: O.Edge, nodesById: { [id: string]: O.Node }): React.ReactElement {
    const a = nodesById[edge.a]
    const b = nodesById[edge.b]
    return <line key={JSON.stringify([edge.a, edge.b])} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="black" />
}