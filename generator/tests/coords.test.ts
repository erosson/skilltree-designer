import { describe, expect, test } from '@jest/globals'
import * as C from '../src/coords'

test('create an angle', () => {
    const degs = C.degrees(180)
    const revs = C.revolutions(0.5)
    const rads = C.radians(Math.PI)
    // different units are considered equal
    expect(revs).toEqual(degs)
    expect(revs).toEqual(rads)
    expect(degs).toEqual(rads)
    // whole revolutions are equal, auto-normalized
    expect(C.revolutions(0)).toEqual(C.revolutions(1))
    expect(C.revolutions(0)).toEqual(C.revolutions(100))
    expect(C.revolutions(0)).not.toEqual(C.revolutions(0.5))
    expect(C.revolutions(0.5)).toEqual(C.revolutions(1.5))
    expect(C.revolutions(0)).toEqual(C.revolutions(-1))
    expect(C.revolutions(0.5)).toEqual(C.revolutions(-0.5))
    // addition works only when normalized
    expect(C.revolutions(1)).toEqual(C.add(C.revolutions(0.5), C.revolutions(0.5)))
})

const xys = { right: C.xy(1, 0), up: C.xy(0, 1), left: C.xy(-1, 0), down: C.xy(0, -1) }
const angles = { right: C.revolutions(0), up: C.revolutions(1 / 4), left: C.revolutions(2 / 4), down: C.revolutions(3 / 4) }
const polars = { right: C.polar(1, angles.right), up: C.polar(1, angles.up), left: C.polar(1, angles.left), down: C.polar(1, angles.down) }
const dirs = Object.keys(xys) as (keyof typeof xys)[]
const dirPairs: [C.XYCoords, C.PolarCoords][] = dirs.map(dir => [xys[dir], polars[dir]])

test.each(dirPairs)('toPolar (%s, %s)', (xy: C.XYCoords, polar: C.PolarCoords) => {
    expect(polar).not.toEqual(xy)
    expect(polar).toEqual(C.toPolar(xy))
})
test.each(dirPairs)('toXY (%s, %s)', (xy: C.XYCoords, polar: C.PolarCoords) => {
    expect(xy).not.toEqual(polar)
    expect(xy).toEqual(C.toXY(polar))
})