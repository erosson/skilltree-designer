import { describe, expect, test } from '@jest/globals'
import * as M from '../src/model'

//test('jest typechecks', () => {
//    const x: number = "three"
//})
test('create a node', () => {
    const n = M.node()
    expect(n.type).toEqual(M.ElementType.Node)
})
test('create an edge offset', () => {
    const n = M.node()
    const m = M.node()
    // const es = M.edges([n, m], M.edge(n.id, m.id))
})