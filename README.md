# GooseStandalone

Converts Discord clients into separate clients for mods using GooseUpdate. Experimental.


## Building

### Dependencies

 - [Node.JS](https://nodejs.org) (along with NPM)

### Running

1. Install NPM dependencies with `npm install`
2. Run the script via `node src/index.js`
3. Unless you know what you are doing, it is best to leave the interactive options blank (pressing just enter) to use defaults.
4. The build will then be in `dist/<discord channel>/<discord platform>`.

### Windows Builds

Windows builds are more complex for first-time setup due to unsolved complications with the new updater. After generating the build for the first time run from the root directory:
```js
node src/extra/setup_windows.js <channel (stable/ptb/canary)>
```
