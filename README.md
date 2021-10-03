## Purpose

Other fusion tools for Pokemon Infinite Fusion exist, but none offer a method of simply previewing the possible fusions without spoiling the sprite. FusionDex will shows a list of possible custom sprite fusions - it's not a tool for optimizing stats/builds. 

*If you want to see the sprite without a silhouette open the image in a new tab* (or disable the css filter)

If you are interested in Pokemon stats, go check out https://aegide.github.io/.

## Updating

Requires python to run. Run `npm run build-fusions` with the absolute path to your local directory and it will build `src/assets/FusionListing.json`. The repo is distributed with this file prebuilt but could be out of date.

Note that the script for building the fusion lists rejects any fusions not adhering to the standard "###.###" format (these are sometimes badly named files or alternative sprites for fusions).

Aegide manually maintains the custom Pokedex entries (`src/assets/GameDex.json`) which also needs to be updated on new releases adding new Pokemon.

## External Deps

There is no official repo for Pokemon Infinite Fusion; spriters are always working at developing more sprites for custom fusions. At any given time the current release is likely far behind the current collective sprite contribution, so if you're missing the sprite in the preview update your local game folder with the sprites (or update your game as it may be out of date).

Fusion Sprites: https://github.com/Aegide/Aegide.github.io/blob/master/CustomBattlers/ 

If there's not a sprite for a fusion double-check it's in your local folder (look for `[headID].[bodyID]`) and that you've ran `npm run build-fusions` with the correct folder and then open an issue there if it still isn't showing up.

Other Deps:

- Regular Pokemon sprites: PokeAPI
- Pokemon Icons: https://github.com/arcanis/pikasprite/tree/master/icons/pokemon/regular
- Pokemon Icon Sprite Sheet: https://github.com/koenigderluegner/pokesprite-gen

## Running Locally

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Attributions

- [Voltorb Icon - Darius Dan](https://www.flaticon.com/)
- [Dna Icon](https://iconscout.com/icons/dna) by [fengquan](https://iconscout.com/contributors/fengquanli)
- [Pokeball Icon](https://thenounproject.com/geoffrey.joe/)