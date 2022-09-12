export function assertNever(val: never) {
    throw new Error(`unreachable: ${val}`)
}