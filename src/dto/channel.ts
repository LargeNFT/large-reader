
import { AttributeOptions } from "./attribute";

class Channel {
    _id?:string
    _rev?:string 
    authorId:string
    title?:string
    symbol?:string
    link?:string
    description?:string
    descriptionHTML?:string
    descriptionMarkdown?:string
    category?:string[]
    copyright?:string
    language?:string
    coverImageId?:string
    coverBannerId?:string
    mintPrice?:string
    attributeOptions:AttributeOptions[]
    sellerFeeBasisPoints:string
    royaltyPercent:string
    dateCreated?:string
    lastUpdated?:string
}

export {
    Channel
}
