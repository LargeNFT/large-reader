import { Container } from "inversify";

import { AuthorRepository } from "./repository/author-repository";
import { AuthorRepositoryImpl } from "./repository/browser/author-repository-impl";

import { ChannelRepository } from "./repository/channel-repository";
import { ChannelRepositoryImpl } from "./repository/browser/channel-repository-impl";

import { ItemRepository } from "./repository/item-repository";
import { ItemRepositoryImpl } from "./repository/browser/item-repository-impl";

import { WalletService } from "./service/core/wallet-service";
import { WalletServiceImpl } from "./service/core/wallet-service-impl";

import { AuthorService } from "./service/author-service";
import { ChannelService } from "./service/channel-service";
import { DatabaseService } from "./service/core/database-service";
import { PagingService } from "./service/core/paging-service";


import { ItemService } from "./service/item-service";
import { AuthorWebService } from "./service/web/author-web-service";
import { ChannelWebService } from "./service/web/channel-web-service";
import { ItemWebService } from "./service/web/item-web-service";

import { ethers, providers } from "ethers"


import Framework7, { Dom7 } from 'framework7';

// Import additional components
import Dialog from 'framework7/components/dialog';
import Toast from 'framework7/components/toast';
import Preloader from 'framework7/components/preloader';
import VirtualList from 'framework7/components/virtual-list'
import ListIndex from 'framework7/components/list-index'
import Range from 'framework7/components/range'
import Accordion from 'framework7/components/accordion'

import Card from 'framework7/components/card'
import Chip from 'framework7/components/chip'

import Form from 'framework7/components/form'
import Grid from 'framework7/components/grid'
import { UiService } from "./service/core/ui-service";

import Navbar from './components/reader/navbar.f7.html'
import NftInfo from './components/reader/item/nft-info.f7.html'
import MintList from './components/reader/item/mint-list.f7.html'


import { TokenService } from "./service/token-service";
import { MetadataRepository } from "./repository/metadata-repository";
import { MetadataRepositoryImpl } from "./repository/browser/metadata-repository-impl";
import { MintWebService } from "./service/web/mint-web-service";
import { SchemaService } from "./service/core/schema-service";


// Install F7 Components using .use() method on Framework7 class:
Framework7.use([Dialog, Toast, Preloader, VirtualList, ListIndex, Card, Chip, Form, Grid, Range, Accordion])




let container: Container

function getMainContainer(baseURI:string, version:string) {

  if (container) return container

  container = new Container()

  function framework7() {

    Framework7.registerComponent("nav-bar", Navbar)
    Framework7.registerComponent("nft-info", NftInfo)
    Framework7.registerComponent("mint-list", MintList)

    const resolveWithSpinner = (resolve, url) => {
      
      let currentUrl = window.location.pathname.split('/').pop()

      //Navigating to same page freezes it. So don't.
      if (url != currentUrl)  {
        app.preloader.show()
      } 

      resolve({ componentUrl: url })

    }

    let app = new Framework7({
      el: '#app', // App root element
      id: 'large-reader', // App bundle ID
      name: 'Large Reader', // App name
      theme: 'auto', // Automatic theme detection
      init: false,
      
      view: {
        browserHistory: true,
        browserHistorySeparator: "",
        browserHistoryOnLoad: false,
        browserHistoryInitialMatch: false
      },
      
      routes: [
        {
          path: `${baseURI}`,
          async async({ resolve, reject }) {
            await resolveWithSpinner(resolve, 'index.html')
          }
        },
        {
          path: `${baseURI}index.html`,
          async async({ resolve, reject }) {
            await resolveWithSpinner(resolve, 'index.html')
          }
        },


        {
          path: `${baseURI}mint.html`,
          async async({ resolve, reject }) {
            await resolveWithSpinner(resolve, 'mint.html')
          }
        },

        {
          path: `${baseURI}list-:page.html`,
          async async({ resolve, reject }) {
            await resolveWithSpinner(resolve, 'list-{{page}}.html')
          }
        },
        {
          path: `${baseURI}item-show-:id.html`,
          async async({ resolve, reject }) {
            await resolveWithSpinner(resolve, 'item-show-{{id}}.html')
          }
        },
        {
          path: '(.*)',
          async async({ resolve, reject, to }) {
            console.log(`404 error: ${to.path}`)
            await resolveWithSpinner(resolve, '404.html')
          }
        }
      ]
    })

    return app
  }

  function provider() {

    if (typeof window !== "undefined" && window['ethereum']) {

      //@ts-ignore
      window.web3Provider = window.ethereum

      //@ts-ignore
      return new providers.Web3Provider(window.ethereum)

    }
  }

  function contracts() {
        
    const contract = require('../backup/contract.json')

    if (!contract.contractAddress) return []

    const c = require('../backup/contract-abi.json')

    //Override address
    c['Channel'].address = contract.contractAddress

    return c
  }

  container.bind("contracts").toConstantValue(contracts())
  container.bind("framework7").toConstantValue(framework7())
  container.bind("baseURI").toConstantValue(baseURI)
  container.bind("version").toConstantValue(version)
  container.bind("provider").toConstantValue(provider())

  container.bind<WalletService>("WalletService").to(WalletServiceImpl).inSingletonScope()

  container.bind<ChannelRepository>("ChannelRepository").to(ChannelRepositoryImpl).inSingletonScope()
  container.bind<ItemRepository>("ItemRepository").to(ItemRepositoryImpl).inSingletonScope()
  container.bind<AuthorRepository>("AuthorRepository").to(AuthorRepositoryImpl).inSingletonScope()
  container.bind<MetadataRepository>("MetadataRepository").to(MetadataRepositoryImpl).inSingletonScope()

  container.bind<ChannelWebService>("ChannelWebService").to(ChannelWebService).inSingletonScope()
  container.bind<ItemWebService>("ItemWebService").to(ItemWebService).inSingletonScope()
  container.bind<AuthorWebService>("AuthorWebService").to(AuthorWebService).inSingletonScope()
  container.bind<MintWebService>("MintWebService").to(MintWebService).inSingletonScope()


  container.bind<PagingService>("PagingService").to(PagingService).inSingletonScope()
  container.bind<DatabaseService>("DatabaseService").to(DatabaseService).inSingletonScope()

  container.bind<UiService>("UiService").to(UiService).inSingletonScope()
  container.bind<ItemService>("ItemService").to(ItemService).inSingletonScope()
  container.bind<ChannelService>("ChannelService").to(ChannelService).inSingletonScope()
  container.bind<AuthorService>("AuthorService").to(AuthorService).inSingletonScope()
  container.bind<TokenService>("TokenService").to(TokenService).inSingletonScope()
  container.bind<SchemaService>("SchemaService").to(SchemaService).inSingletonScope()

  //Attach container to window so we can easily access it from the browser console
  globalThis.container = container
  globalThis.ethers = ethers

  return container
}



export {
  getMainContainer, container
}




