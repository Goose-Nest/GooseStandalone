# GooseStandalone :test_tube:

Converts Discord clients into separate clients for mods using GooseUpdate. Experimental. Linux tar.gz-only.


## Building

### Dependencies

 - [Node.JS](https://nodejs.org) (along with NPM)

### Running

1. Install NPM dependencies with `npm install`
2. Run the script via `node src/index.js`
3. Unless you know what you are doing, it is best to leave the interactive options blank (pressing just enter) to use defaults.
4. The build will then be in `dist/<discord channel>/<discord platform>`.

### Windows Builds

Important note for Windows builds: Your dist dir contains a dir called "app-0.0.0". When using the build, you need to keep the actual build (containing the exe, etc.) inside a dir called "app-X.Y.Z" (substituting with integers, likely just use "app-0.0.0") otherwise Discord refuses to use the new updater.