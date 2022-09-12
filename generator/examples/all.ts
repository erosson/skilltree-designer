import * as fs from 'fs/promises'
import * as path from 'path'

async function main() {
    const files = await fs.readdir(__dirname)
    const self = path.basename(__filename)
    const jsfiles = files.filter(f => f !== self && f.endsWith('.js'))
    await fs.rm('./dist/public', { force: true, recursive: true })
    await fs.mkdir('./dist/public', { recursive: true })
    const out = Object.fromEntries(await Promise.all(jsfiles.map(async filename => {
        const name = path.basename(filename, '.js')
        const mod = await import(`./${name}`)
        const svg = mod.default
        const outfile = `./dist/public/${name}.svg`
        await fs.writeFile(outfile, svg)
        return [name, outfile]
    })))
    console.log(out)
}
main().catch(err => {
    console.log(err)
    process.exit(1)
})