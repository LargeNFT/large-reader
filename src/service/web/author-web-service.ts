import { inject, injectable } from "inversify";
import { Author } from "../../dto/author";
import { AuthorViewModel } from "../../dto/viewmodel/author-view-model";
import { ImageViewModel } from "../../dto/viewmodel/image-view-model";
import { AuthorService } from "../author-service";

@injectable()
class AuthorWebService {

    @inject("AuthorService")
    private authorService:AuthorService

    constructor(
    ) {}

    async get(_id: string): Promise<AuthorViewModel> {
        return this.getViewModel(await this.authorService.get(_id))
    }

    async getViewModel(author: Author): Promise<AuthorViewModel> {

        let authorPhoto:ImageViewModel

        return {
            author: author,
            authorDisplayName: this.authorService.getDisplayName(author)
        }

    }



}

export {
    AuthorWebService
}