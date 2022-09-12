import * as M from '../src/model'
import { output } from '../src/output'
import { svgs } from '../src/svg'
import * as fs from 'fs/promises'

const treeX = M.edges([
    M.node(),
    M.orbit([
        [0, M.node("a")],
        [2, M.node("b")],
        [5, M.node()],
        [10, M.node()],
    ], { radius: 10, slices: 12 })
], [
    M.edge("a", "b"),
])
const treeY = M.edges([
    M.node(),
    M.orbit([
        [0, M.node("c")],
        [2, M.node("d")],
        [5, M.node()],
        [10, M.node()],
    ], { radius: 10, slices: 12 })
], [
    M.edge("c", "d"),
])
const tree = M.edges([
    M.orbit([
        [4, treeX],
        [8, treeY],
    ], { radius: 20, slices: 12 })
], [
    M.edge("a", "c"),
    M.edge("b", "d"),
])

const svg = svgs(output([tree]))
export default svg
if (require.main === module) {
    fs.writeFile(`./dist/public/${require('path').basename(__filename)}.svg`, svg)
}