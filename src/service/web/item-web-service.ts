import { injectable } from "inversify";
import moment from "moment";
import { Author } from "../../dto/author";
import { Channel } from "../../dto/channel";
import { Image } from "../../dto/image";
import { Item } from "../../dto/item";
import { AttributeSelectionViewModel } from "../../dto/viewmodel/attribute-selection-view-model";
import { ImageViewModel } from "../../dto/viewmodel/image-view-model";

import { ItemViewModel } from "../../dto/viewmodel/item-view-model";
import { AuthorService } from "../author-service";
import { ChannelService } from "../channel-service";
import { ImageService } from "../image-service";
import { ItemService } from "../item-service";

@injectable()
class ItemWebService {

    constructor(
        private itemService: ItemService,
        private channelService: ChannelService,
        private imageService: ImageService,
        private authorService: AuthorService
    ) { }

    async get(_id: string): Promise<ItemViewModel> {

        let item:Item = await this.itemService.get(_id)

        //Get channel
        const channel:Channel = await this.channelService.get(item.channelId)

        return this.getViewModel(item, channel)
    }

    async getViewModel(item: Item, channel:Channel): Promise<ItemViewModel> {

        let coverImage: ImageViewModel
        let authorPhoto:ImageViewModel

        let attributeSelections:AttributeSelectionViewModel[] = []

        let author: Author

        if (item.coverImageId) {

            let image:Image = await this.imageService.get(item.coverImageId)
            
            coverImage = {
                cid: image.cid,
                url: await this.imageService.getUrl(image)
            }
        }

        //Get author
        if (channel.authorId) {
            
            author = await this.authorService.get(channel.authorId)

            //Load cover photo if there is one.
            if (author.coverPhotoId) {
                let aImage = await this.imageService.get(author.coverPhotoId)

                authorPhoto = {
                    cid: aImage.cid,
                    url: await this.imageService.getUrl(aImage)
                }
            }

        }

        //Only show attributes that are valid at the category level. 
        if (channel.attributeOptions.length > 0) {

            for (let ao of channel.attributeOptions) {

                //find the one selected by this item
                let selections = item?.attributeSelections?.filter( as => ao?.traitType == as?.traitType)

                attributeSelections.push({
                    id: ao.id,
                    traitType: ao.traitType,
                    values: ao.values,
                    value: selections?.length > 0 ? selections[0].value : '' 
                })

            }

        }

        return {
            item: item,
            dateDisplay: moment(item.dateCreated).format("MMM Do YYYY"),
            channel: channel,
            coverImage: coverImage,
            author: author,
            authorPhoto: authorPhoto,
            authorDisplayName: this.authorService.getDisplayName(author),
            attributeSelections: attributeSelections,
        }

    }

    async listByChannel(channelId: string, limit: number, skip: number): Promise<ItemViewModel[]> {

        let result: ItemViewModel[] = []

        let items: Item[] = await this.itemService.listByChannel(channelId, limit, skip)

        //Get channel
        const channel:Channel = await this.channelService.get(channelId)

        for (let item of items) {
            result.push(await this.getViewModel(item, channel))
        }

        return result

    }

}

export {
    ItemWebService
}