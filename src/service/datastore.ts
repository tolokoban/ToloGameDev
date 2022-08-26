import DB from "./database"
import GenericEvent from "../tools/generic-event"
import { isObject } from "@/tools/type-guards"

export default class DataStore<T extends { id: number; name: string }> {
    public readonly eventChange = new GenericEvent<DataStore<T>>()

    constructor(
        private readonly storeName: string,
        private readonly isValidType: (data: unknown) => data is T,
        private readonly makeDefault: () => T
    ) {}

    async listItems(): Promise<T[]> {
        return (await DB.list(this.storeName)) as T[]
    }

    async isEmpty(): Promise<boolean> {
        const count = await DB.count(this.storeName)
        console.log("🚀 [datastore] count = ", count) // @FIXME: Remove this line written on 2022-08-25 at 15:17
        return count === 0
    }

    async get(id: number): Promise<T | undefined> {
        const result = await DB.get(this.storeName, id)
        if (isObject(result)) {
            const data: T = {
                ...this.makeDefault(),
                ...result,
            }
            if (this.isValidType(data)) return data
        }

        console.error(
            `Bad object type in store "${this.storeName}" for id ${id}!`,
            result
        )
        console.error("We will delete it from the database!")
        await this.delete(id)
    }

    async store(data: T): Promise<number> {
        let id = data.id ?? 0
        if (typeof id !== "number" || id <= 0) {
            id = await DB.add(this.storeName, data)
        } else {
            await DB.update(this.storeName, data)
        }
        this.eventChange.fire(this)
        return id
    }

    async delete(id: number): Promise<void> {
        await DB.delete(this.storeName, id)
        this.eventChange.fire(this)
    }
}
