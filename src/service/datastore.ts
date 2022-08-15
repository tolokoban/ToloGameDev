import DB from "./database"
import GenericEvent from "../tools/generic-event"

export default class DataStore<T extends { id: number; name: string }> {
    public readonly eventChange = new GenericEvent<DataStore<T>>()

    constructor(
        private readonly storeName: string,
        private readonly isValidType: (data: unknown) => data is T
    ) {}

    async list(): Promise<{ id: number; name: string }[]> {
        return await DB.list(this.storeName)
    }

    async get(id: number): Promise<T | undefined> {
        const result = await DB.get(this.storeName, id)
        if (this.isValidType(result)) return result

        console.error(
            `Bad object type in store "${this.storeName}" for id ${id}!`,
            result
        )
        console.error("We will delete it from the database!")
        await this.delete(id)
    }

    async add(data: Omit<T, "id">): Promise<number> {
        const id = await DB.add(this.storeName, data)
        this.eventChange.fire(this)
        return id
    }

    async update(data: T): Promise<void> {
        await DB.update(this.storeName, data)
        this.eventChange.fire(this)
    }

    async delete(id: number): Promise<void> {
        await DB.delete(this.storeName, id)
        this.eventChange.fire(this)
    }
}
