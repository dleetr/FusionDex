## Purpose

Other fusion tools for Pokemon Infinite Fusion exist, but none offer a method of simply previewing the possible fusions without spoiling the sprite. FusionDex will show a list of possible custom sprite fusions; the 1.0 intention is to facilitate this feature - not to provide a tool for optimizing stats/builds.

If you are more interested in the stats, go check out https://aegide.github.io/showdown/ (this calculator shows info on some stats+ natures)

## External Deps

There is no official repo for Pokemon Infinite Fusion; spriters are always working at developing more sprites for custom fusions. At any given time the current release is likely far behind the current collective sprite contribution.

Thus, FusionDex currently relies on https://github.com/Aegide/Aegide.github.io/blob/master/CustomBattlers/
Aegide currently maintains and frequently updates their repo for a different fusion calculator

## Todo

- Mapping of normal PokeID to IG PokeID (see IF wiki for more details)
- List the possible fusions
- Offer some kind of feature to save the party pokemon (ideally this would get stripped from a user save data but the serialization is complex to crawl; an alternative would be to use cheat engine)
- Utilize github tree api to outdate listing.json (because search api can't handle the num of files in CustomBattlers). Possibly make this utilize a custom URI so users could elect their own CustomBattlers link (and maybe even use a local link, this might require ejecting or adding a module to get access to local file system, it also might be impossible given the nature of browser-filesystem interactions)
- UI animation

## Running Locally

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
