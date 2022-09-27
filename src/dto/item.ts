import { AttributeOptions, AttributeSelection } from "./attribute"


class Item {    
    _id?:string
    _rev?:string
    channelId?:string
    tokenId?:number
    title?:string 
    link?:string 
    description?:string
    content?:any
    contentHTML?:string
    excerpt?:string
    authorId?:string
    category?:string[]
    attributeSelections?: AttributeSelection[] 
    coverImageId?:string
    animationId?:string
    datePublished?:string
    dateCreated?:string
    lastUpdated?:string
}


export { Item }