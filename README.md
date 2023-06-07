# Large Reader 
Generate a search-engine friendly static website for an NFT collection.

After pushing the content to your git provider, clone the repo and run the following commands.

## Install
```console
npm install
```

## Config
Configuration for the generation and sync processes are stored in large-config.json.  

### Example
Here is an example configuration for a site hosted on GitLab Pages.

```json
{
    "hostname": "https://ptoner.gitlab.io",
    "baseURL": "/bladerunner-punks-reader/",

    "showMintPage": false,
    "showActivityPage": true,
    "marketplaces": [
        {
            "name": "OpenSea",
            "link": "https://opensea.io/collection/bladerunner-punks"
        },
        {
            "name": "LooksRare"
        }
    ],
    "externalLinks": [
        {
            "name": "Discord",
            "link": "https://discord.gg/NhuCN5s2Xa"
        },
        {
            "name": "Twitter",
            "link": "https://twitter.com/BladeRunnerPunk"
        }
    ]
}
```


| Option | Default | Description | 
| ------------- | ------------- | ------------- |
| hostname  | http://localhost:8081 | The hostname where the generated Reader will be hosted. When generating the dev version it defaults to localhost. |
| baseURL  |  / | The path on the host where the generated app is hosted. This is used by the PWA's routing and must match the actual deployment URL. Must end with a /. For example /bladerunner-punks-reader/ 
| marketplaces  |   | See below
| externalLinks  |   | See below


### Marketplaces
The marketplaces field is an array of objects, with each object representing a marketplace. The objects in the array should have the following fields:

**name:** a string representing the name of the marketplace. This field is required.

**link (optional):** a string representing the URL of the marketplace's homepage or collections page. This field is optional and does not need to be included in every object. If the name field matches a preconfigured value (such as "LooksRare"), the link field will be set to the corresponding URL.


In the example above, the link field for the "OpenSea" marketplace is the URL of the collection page for that marketplace. The link field for the "LooksRare" marketplace is not included. It will default to the preconfigured URL for the "LooksRare" marketplace.

You can add as many objects to the marketplaces array as you like, as long as each object has the required name field.

Currently OpenSea and LooksRare are configured by default.

### External Links
Configure links to external resources associated with the collection such as Discord or Twitter. 



### Generate Large Reader for localhost
Note the -- before passing options. Generates HTML files in ./public folder.
```console
npm run generate -- --env dev --main-branch main
```

### Generate Large Reader for localhost
```console
npm run start
```

### Access in Browser
The generated web app will be available at [http://localhost:8081](http://localhost:8081) by default.


### Generate Large Reader for production
Generates HTML files in 'public' branch.

```console
npm run generate -- --main-branch main
```



# Large Sync
**Large Sync** is a Node.js app that reads transaction data from a configured Ethereum node and writes it to the "public" branch so it can be deployed to a web server. If configured it will also commit those changes to a configured git provider. 

Transaction data is also cached locally in PouchDB. 

### Start Large Sync
Note the -- before passing options.
```console
npm run sync --  --env dev --alchemy <API key>
```
d
## API

| Option | Default | Description | 
| ------------- | ------------- | ------------- |
| --env  | production | This loads either the dev or production settings for hostname and baseURL. Also in dev mode nothing is written to the 'public' branch. |
| --alchemy  |   | Pass a valid API key to connect the sync process to an Alchemy hosted Ethereum node. 
| --sync-rate  | 30*1000  | Milliseconds between sync attempts. Default is 30 seconds. 
| --clear | false  | Set to "true" to clear all processed data and re-start sync from block 0. Does not delete downloaded data. To clear the database entirely delete the ./sync/data.sqlite file in your project folder. 

---


# Large Reader Showcase
These project(s) showcase the basic features of the Large Reader. These projects are CC0 licensed and can be forked to start your own version of the project.
* [Alice's Adventures in Wonderland](https://readalice.com)

# Note
The README in this forked repo does not get updated over time. Check the original 'large-reader' [GitHub](https://github.com/LargeNFT/large-reader) [GitLab](https://gitlab.com/american-space-software/large-reader) repo that this was forked from for up-to-date instructions.
