import { isNumber, isObject, isString } from "@/tools/type-guards"

const DB_NAME = "TGD-Database"
const DB_VERSION = 5

class Database {
    private db: IDBDatabase | null = null

    public async add<T>(
        storeName: string,
        data: Omit<T, "id">
    ): Promise<number> {
        if ("id" in data) delete data["id"]
        const result = await this.exec(storeName, "readwrite", (store) =>
            store.add(data)
        )
        if (isNumber(result)) return result

        console.error(`Unexpected result from add to "${storeName}"!`, result)
        throw Error(`Unexpected result from add to "${storeName}"!`)
    }

    public async get(
        storeName: string,
        id: number
    ): Promise<{ id: number; name: string }> {
        const result = await this.exec(storeName, "readonly", (store) =>
            store.get(id)
        )
        try {
            if (isStoreObject(result)) return result

            throw Error("Unexpected result!")
        } catch (ex) {
            console.error(ex, result)
            throw ex
        }
    }

    public async delete(storeName: string, id: number): Promise<void> {
        const result = await this.exec(storeName, "readwrite", (store) =>
            store.delete(id)
        )
    }

    public async list(
        storeName: string
    ): Promise<Array<{ id: number; name: string }>> {
        const result: Array<{ id: number; name: string }> = []
        await this.exec(
            storeName,
            "readonly",
            (store) => store.openCursor(),
            (cursor) => {
                if (!(cursor instanceof IDBCursorWithValue)) return false

                result.push({
                    id: cursor.key as number,
                    name: cursor.value.name,
                })
                cursor.continue()
                return true
            }
        )
        return result
    }

    public async update(
        storeName: string,
        data: { id: number; name: string }
    ): Promise<void> {
        const result = await this.exec(storeName, "readwrite", (store) =>
            store.put(data)
        )
    }

    public async count(storeName: string): Promise<number> {
        return new Promise(async (resolve, reject) => {
            try {
                const db = await this.getDB()
                const transaction = db.transaction([storeName], "readonly")
                const store = transaction.objectStore(storeName)
                const index = store.index("id")
                const countRequest = index.count()
                countRequest.onsuccess = () => {
                    console.log("Success")
                    resolve(countRequest.result as number)
                }
                countRequest.onerror = (err) => {
                    console.error(`Unable to count items in ${storeName}:`, err)
                    resolve(0)
                }
            } catch (ex) {
                console.error("ERROR de Folie:", ex)
                resolve(0)
            }
        })
    }

    private async exec<T>(
        storeName: string,
        mode: IDBTransactionMode,
        action: (store: IDBObjectStore) => IDBRequest,
        onSuccess?: (result: unknown) => boolean
    ): Promise<unknown> {
        return new Promise(async (resolve, reject) => {
            const db = await this.getDB()
            const transaction = db.transaction([storeName], mode)
            let result: unknown = null
            transaction.onerror = (err) => {
                console.error("Unable to exec transaction!", err)
                reject(err)
            }
            transaction.oncomplete = () => resolve(result)
            const store = transaction.objectStore(storeName)
            const request = action(store)
            request.onsuccess = (evt) => {
                if (!isObject(evt.target)) {
                    reject("evt.target was expected to be an object!")
                    return
                }
                if (onSuccess) {
                    if (onSuccess(evt.target.result) !== true) resolve(result)
                } else result = evt.target.result
            }
            request.onerror = (err) => {
                console.error(
                    `Unable to add an object to store "${storeName}"!`,
                    err
                )
                reject(err)
            }
        })
    }

    private async getDB(): Promise<IDBDatabase> {
        if (this.db) return this.db

        return new Promise((resolve, reject) => {
            const request: IDBOpenDBRequest = window.indexedDB.open(
                DB_NAME,
                DB_VERSION
            )
            request.onerror = (evt) => {
                console.error(
                    `Unable to open database "${DB_NAME}" in version ${DB_VERSION}!
Error: `,
                    request.error
                )
                console.error(evt)
                reject(request.error)
            }
            request.onsuccess = () => {
                const db = request.result
                this.db = db
                console.log(
                    `IndexedDB "${db.name}" version ${db.version} ready!`
                )
                resolve(db)
            }
            request.onupgradeneeded = () => {
                console.log("IndexedDB upgrade needed!")
                const db = request.result
                const names = ["painter"]
                for (const name of names) {
                    if (db.objectStoreNames.contains(name)) {
                        db.deleteObjectStore(name)
                    }
                    const store = db.createObjectStore(name, {
                        keyPath: "id",
                        autoIncrement: true,
                    })
                    store.createIndex("id", "id", { unique: true })
                }
            }
        })
    }
}

function isStoreObject(data: unknown): data is { id: number; name: string } {
    if (!isObject(data)) return false
    const { id, name } = data
    return isNumber(id) && isString(name)
}

const DB = new Database()

export default DB
