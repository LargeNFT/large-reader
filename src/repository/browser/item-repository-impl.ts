import axios from "axios"
import { inject, injectable } from "inversify"
import { Item } from "../../dto/item"
import { ItemRepository } from "./../item-repository"

@injectable()
class ItemRepositoryImpl implements ItemRepository {

    static CHUNK_SIZE = 10

    constructor(
        @inject('baseURI') private baseURI:string
    ) {}

    async get(_id: string): Promise<Item> {
        const response = await axios.get(`${this.baseURI}backup/items/${_id}.json`)
        return Object.assign(new Item(), response.data)
    }

    async list(skip:number): Promise<Item[]> {

        let items:Item[] = []

        if (skip % ItemRepositoryImpl.CHUNK_SIZE != 0) {
            throw Error("Invalid skip value")
        }

        //First chunk is at 0.json
        let chunkIndex = skip / ItemRepositoryImpl.CHUNK_SIZE

        const response = await axios.get(`${this.baseURI}backup/itemChunks/${chunkIndex}.json`)

        items.push(...response.data.map( doc => Object.assign(new Item(), doc)))

        return items

    }

}

export {
    ItemRepositoryImpl
}


