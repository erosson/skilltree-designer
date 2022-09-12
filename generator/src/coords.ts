import { assertNever } from './util'
import * as A from './angle'
export * from './angle'

export enum CoordsType {
    XY = "coords:xy",
    Polar = "coords:polar",
}
export type Coords = XYCoords | PolarCoords

export interface XYCoords {
    type: CoordsType.XY
    x: number
    y: number
}
export interface PolarCoords {
    type: CoordsType.Polar
    r: number
    angle: A.Angle
}
function abszero(v: number): number {
    return v === 0 ? 0 : v
}
function round(v: number): number {
    return abszero(Math.round(v))
}
export function xy(x: number, y: number): XYCoords {
    return { type: CoordsType.XY, x: round(x), y: round(y) }
}
export function polar(r: number, angle: A.Angle): PolarCoords {
    return { type: CoordsType.Polar, r: round(r), angle }
}

export function toXY(c: Coords): XYCoords {
    switch (c.type) {
        case CoordsType.XY: return c
        case CoordsType.Polar: return xy(c.r * A.cos(c.angle), c.r * A.sin(c.angle))
        default: throw assertNever(c)
    }
}
export function toPolar(c: Coords): PolarCoords {
    switch (c.type) {
        case CoordsType.Polar: return c
        case CoordsType.XY: return polar(Math.sqrt(c.x * c.x + c.y * c.y), A.atan2(c.y, c.x))
        default: throw assertNever(c)
    }
}

export function offset(a: Coords, b: Coords): Coords {
    a = toXY(a)
    b = toXY(b)
    return xy(a.x + b.x, a.y + b.y)
}
export function rotate(c: Coords, a: A.Angle): Coords {
    c = toPolar(c)
    return polar(c.r, A.add(c.angle, a))
}