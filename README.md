# Vanilla React Statuses

This is the base package for the front-end functionality of Tomodomo's
Vanilla-based forums.

## Usage
Run `yarn` first, to install the npm dependencies.

### Production build
```
yarn build
```
It will create a bundle in `dist/index.js` which is the entry point of this npm package.

## Development
```
yarn dev
```
We don't use TDD currently (we will, hopefully) and we don't publish the package.
So, currently, we test the code locally in the context of the whole app.

#### Setup local environment
1. Clone this repo and install deps
1. Make a symlink from this npm to `node_modules`, eg:
    ```bash
    # in the root dir of the main app
    cd node_modules && ln -s ../tomodomo_modules/vanilla-react-statuses vanilla-react-statuses
    ```
    _Note that this step would have to be repeated after `yarn` is used to update the node modules._
1. Run `yarn dev` in both the package dir and main dir

#### Notes
* Folder `tomodomo_modules` is configured in gulp (watch) and gitignore of the main app.
* `react` and `react-dom` are peerDependencies and should not be included in `devDependencies`
in the current setup.
If/when we change to a TDD approach, they should be included in the `devDependencies`
and the packages should be added via the git repo (or npm registry);
but this will break the current workflow (packages in the local path)

