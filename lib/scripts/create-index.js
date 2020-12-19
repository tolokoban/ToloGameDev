"use strict"

/**
 * Takes only one argument: a folder.
 *
 * Look for every *.ts file (excluding *.test.ts and *.spec.ts ones)
 * and create a "index.ts" file for exporting all this stuff.
 */

if (process.argv.length < 3) {
    console.error()
    console.error("This script aims to create a \"index.ts\" file by exporting all modules in a directory.")
    console.error('Files ending with ".test.ts" or ".spec.ts" and files starting with "_" are ignored.')
    console.error()
    console.error("Usage:")
    console.error("  > node create-index.js src/tfw")
    console.error()
    process.exit(1)
}

const FS = require('fs')
const Path = require('path')

const folder = Path.resolve(process.argv[2])
if (!FS.lstatSync(folder).isDirectory()) {
    console.error("This is not a directory: ", folder)
    process.exit(2)
}

const files = FS.readdirSync(folder)
    .sort()
    .filter(f => !f.startsWith('_'))
    .filter(f => f.endsWith('.ts'))
    .filter(f => f !== 'index.ts')
    .filter(f => !f.endsWith('.d.ts'))
    .filter(f => !f.endsWith('.test.ts'))
    .filter(f => !f.endsWith('.spec.ts'))
    .map(f => f.substr(0, f.length - 3))

const content = files.map(file => `import ${camel(file)} from './${file}'`)
content.push(
    "",
    "export default {",
    files.map(file => `    ${camel(file)}`).join(',\n'),
    "}"
)

FS.writeFileSync(Path.join(folder, "index.ts"), content.join('\n'))


function camel(name) {
    return name.split(/[-.]+/)
        .map(capitalize)
        .join('')
}

function capitalize(name) {
    return name.charAt(0).toUpperCase() + name.substr(1).toLowerCase()
}
