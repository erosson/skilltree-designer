import { flushSync } from 'react-dom'
import * as M from './model'
import { output } from './output'
import { svgs } from './svg'
import * as fs from 'fs/promises'

const treeX = M.edges(M.orbits([
    M.orbit([
        [0, M.node("a")],
        [2, M.node("b")],
        [5, M.node()],
        [10, M.node()],
    ], { radius: 10, slices: 12 })
], M.node()), [
    M.edge("a", "b"),
])
const treeY = M.edges(M.orbits([
    M.orbit([
        [0, M.node("c")],
        [2, M.node("d")],
        [5, M.node()],
        [10, M.node()],
    ], { radius: 10, slices: 12 })
], M.node()), [
    M.edge("c", "d"),
])
const tree = M.edges(M.orbits([
    M.orbit([
        [4, treeX],
        [8, treeY],
    ], { radius: 20, slices: 12 })
]), [
    M.edge("a", "c"),
    M.edge("b", "d"),
])

fs.writeFile("./dist/example.svg", svgs(output(tree)))