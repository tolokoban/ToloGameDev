"use strict"

const FS = require("fs")
const Path = require("path")

const EXTENSIONS = [
    '.css', '.png', '.jpg', '.jpeg', '.gif', 'webp',
    '.yaml', '.yml', '.json', '.woff2', '.ttf',
    '.vert', '.frag'
]

const projectRootPath = Path.resolve(
    Path.dirname(process.argv[1]),
    ".."
)
const tsconfig = loadJSON("tsconfig.json")
if (!tsconfig.compilerOptions) {
    console.error("Missing entry 'compilerOptions' in tsconfig.json!")
    process.exit(3)
}
if (typeof tsconfig.compilerOptions.outDir !== 'string') {
    console.error("Missing entry 'compilerOptions.outDir' in tsconfig.json!")
    process.exit(4)
}
const srcRoot = Path.resolve(projectRootPath, "src")
const dstRoot = Path.resolve(
    projectRootPath,
    tsconfig.compilerOptions.outDir
)
let size = 0

function loadJSON(filename) {
    const fullpath = Path.resolve(
        projectRootPath,
        filename
    )
    if (!FS.existsSync(fullpath)) {
        console.error(`Unable to find "${filename}":`, fullpath)
        process.exit(1)
    }

    try {
        const content = FS.readFileSync(fullpath).toString()
        return JSON.parse(content)
    } catch (ex) {
        console.error(`"${filename}" is not a valid JSON file.`)
        console.error(ex)
        process.exit(2)
    }
}

function copy(src, dst) {
    if (!FS.existsSync(dst)) {
        FS.mkdirSync(dst)
    }
    const files = FS.readdirSync(src)
    for (const file of files) {
        const path = Path.resolve(src, file)
        const stats = FS.statSync(path)
        if (stats.isDirectory()) {
            copy(
                Path.resolve(src, file),
                Path.resolve(dst, file)
            )
        } else {
            if (file === 'package.json') continue
            if (file === 'package-lock.json') continue
            for (const ext of EXTENSIONS) {
                if (file.endsWith(ext)) {
                    size += stats.size
                    console.log(pad(`${Math.ceil(stats.size / 1024)}`, 5), "kb - ", file)
                    FS.copyFileSync(path, Path.resolve(dst, file))
                    break
                }
            }
        }
    }
}

copy(srcRoot, dstRoot)
console.log('Total size:', size >> 10, "Kb")
updatePackage()


function readJson(filename) {
    try {
        const path = Path.resolve(
            Path.dirname(__filename),
            "../..",
            filename
        )
        try {
            const content = FS.readFileSync(path).toString()
            try {
                return JSON.parse(content)
            } catch (err) {
                console.error(`Unable to parse JSON file "${path}"!`)
                console.error(err)
                return
            }
        } catch (err) {
            console.error(`Unable to load file "${path}"!`)
            console.error(err)
        }
    } catch (err) {
        console.error(`Unable to read JSON file "${filename}"!`)
        console.error(err)
    }
}

function writeJson(filename, data) {
    try {
        const path = Path.resolve(
            Path.dirname(__filename),
            "../..",
            filename
        )
        const content = JSON.stringify(data, null, "    ")
        FS.writeFileSync(path, content)
    } catch (err) {
        console.error(`Unable to write file "${path}"!`)
        console.error(err)
    }
}

function updatePackage() {
    // Copy package.json and change attributes "main" and "types" to be local.
    const config = readJson("./package.json")
    config.main = "umd/index.js"
    config.module = "esm/index.js"
    config.types = "esm/index.d.ts"
    delete config.files
    delete config.scripts
    delete config.browserslist
    writeJson("./lib/dist/package.json", config)
}

function pad(text, size) {
    const len = size - text.length
    if (len > 0) {
        return `${Array(len).join(" ")}${text}`
    }
    return text
}