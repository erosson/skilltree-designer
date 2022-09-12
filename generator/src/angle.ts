export type Angle = number & { readonly __tag: unique symbol }

export function revolutions(n: number): Angle {
    // positive modulo
    return (((n % 1) + 1) % 1) as Angle
}
export function degrees(n: number): Angle {
    return revolutions(n / 360)
}
export function radians(n: number): Angle {
    return revolutions(n / Math.PI / 2)
}
export function toRevolutions(a: Angle): number {
    return a
}
export function toDegrees(a: Angle): number {
    return a * 360
}
export function toRadians(a: Angle): number {
    return a * Math.PI * 2
}

export function add(a: Angle, b: Angle): Angle {
    return revolutions(a + b)
}
export function sub(a: Angle, b: Angle): Angle {
    return revolutions(a - b)
}

export function cos(a: Angle): number {
    return Math.cos(toRadians(a))
}
export function sin(a: Angle): number {
    return Math.sin(toRadians(a))
}
export function tan(a: Angle): number {
    return Math.tan(toRadians(a))
}
export function acos(n: number): Angle {
    return radians(Math.acos(n))
}
export function asin(n: number): Angle {
    return radians(Math.asin(n))
}
export function atan(n: number): Angle {
    return radians(Math.atan(n))
}
export function atan2(y: number, x: number): Angle {
    return radians(Math.atan2(y, x))
}

export const right = revolutions(0 / 4)
export const up = revolutions(1 / 4)
export const left = revolutions(2 / 4)
export const down = revolutions(3 / 4)
export const directions = { right, up, left, down }