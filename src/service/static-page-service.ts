import { inject, injectable } from "inversify";
import { StaticPageRepository } from "../repository/static-page-repository";
import { StaticPage } from "../dto/static-page";


@injectable()
class StaticPageService {

  @inject("StaticPageRepository")
  private staticPageRepository:StaticPageRepository


  constructor() { }

  async get(_id: string): Promise<StaticPage> {
    return this.staticPageRepository.get(_id)
  }

  async listByLocation(location:string, skip:number): Promise<StaticPage[]> {
    return this.staticPageRepository.listByLocation(location, skip)
  }

  async listRoutablePages(): Promise<StaticPage[]> {

    let results = []

    results = results.concat(await this.staticPageRepository.listByLocation("navbar", 0))
    results = results.concat(await this.staticPageRepository.listByLocation("links", 0))

    //Clone these so we don't change the underlying objects
    results = JSON.parse(JSON.stringify(results))

    //Strip the content.
    for (let staticPage of results) {
      delete staticPage.content
      delete staticPage.contentHTML
      delete staticPage.contentMarkdown
    }
    
    return results 
  }
}


export { StaticPageService }
