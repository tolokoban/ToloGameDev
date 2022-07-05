"use strict"

const FS = require("fs")
const Path = require("path")

const rootPackage = readJson("package.json")
const libPackage = readJson("lib/package.json")
const version = maxVersion(rootPackage.version, libPackage.version)

if (rootPackage.version !== libPackage.version) {
    console.log((new Date()).toString())
    console.log("Apply new version: ", version)
    libPackage.version = version
    rootPackage.version = version
    writeJson("package.json", rootPackage)
    writeJson("lib/package.json", libPackage)
    writeJson("lib/src/cfg.json", libPackage)
}
console.log(`Compiling ${rootPackage.name} v${version}...`)


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
        FS.writeFileSync(path, JSON.stringify(data, null, "  "))
    } catch (err) {
        console.error(`Unable to write file "${path}"!`)
        console.error(err)
    }
}


function maxVersion(v1, v2) {
    const [maj1, min1, rev1] = v1.split(".")
    const [maj2, min2, rev2] = v2.split(".")
    if (maj1 > maj2) return v1
    if (maj1 < maj2) return v2
    if (min1 > min2) return v1
    if (min1 < min2) return v2
    if (rev1 > rev2) return v1
    if (rev1 < rev2) return v2
    return v1
}
