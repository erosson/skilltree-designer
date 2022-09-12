import * as M from '../src/model'
import { output } from '../src/output'
import { svgs } from '../src/svg'
import * as fs from 'fs/promises'

const tree = M.edgesLoop([
    M.orbit([
        [0, M.node()],
        [2, M.node()],
        [4, M.node()],
        [6, M.node()],
        [8, M.node()],
        [10, M.node()],
    ], { radius: 10, slices: 12 })
])

const svg = svgs(output([tree]))
export default svg
if (require.main === module) {
    fs.writeFile(`./dist/public/${require('path').basename(__filename)}.svg`, svg)
}