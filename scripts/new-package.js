// @ts-check

const { checkIfPackageDoesntExist } = require("./npm");

const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

const { kebab } = require("case");

// eslint-disable-next-line no-unused-vars
const packageJSONTemplate = `{
  "name": "@blocz/$name",
  "version": "0.0.0",
  "private": true,
  "description": "FILL ME!",
  "source": "src/index.ts",
  "sideEffects": false,
  "main": "lib/$name.js",
  "umd:main": "lib/$name.umd.js",
  "module": "lib/$name.modern.js",
  "types": "lib/index.d.ts",
  "exports": {
    "require": "./dist/$name.js",
    "import": "./dist/$name.modern.js",
    "browser": "./dist/$name.modern.js",
    "umd": "./dist/$name.umd.js"
  },
  "repository": "git@github.com:bloczjs/ui.git",
  "keywords": [],
  "author": "Ayc0",
  "license": "MIT",
  "bugs": "https://github.com/bloczjs/ui/issues",
  "scripts": {
    "build": "yarn -s build:microbundle",
    "build:dev": "yarn -s build:microbundle --compress false",
    "build:microbundle": "microbundle --name $npm_package_name --globals react=React",
    "prepublishOnly": "rm -rf lib && yarn -s build"
  },
  "homepage": "https://github.com/bloczjs/ui/packages/$name#readme",
  "devDependencies": {
    "@types/react": "^16.9.34",
    "microbundle": "0.12.0-next.6"
  },
  "peerDependencies": {
    "react": "^16.8.0"
  }
}`;

const COMPONENTS_PATH = path.join(__dirname, "..", "packages");
const rawName = process.argv[2];

const main = async () => {
  if (!rawName) {
    throw new Error("Need to specify a component name");
  }

  const kebabName = kebab(rawName);

  await checkIfPackageDoesntExist(`@blocz/${kebabName}`);

  const newComponentPath = path.join(COMPONENTS_PATH, kebabName);
  if (fs.existsSync(newComponentPath)) {
    throw new Error(`"packages/${kebabName}" already exists`);
  }

  fs.mkdirSync(newComponentPath);
  fs.writeFileSync(path.join(newComponentPath, "package.json"), packageJSONTemplate.replace(/\$name/g, kebabName));
  fs.mkdirSync(path.join(newComponentPath, "src"));
  fs.writeFileSync(path.join(newComponentPath, "src", "index.ts"), "");
  childProcess.execSync(`cd ${newComponentPath} && yarn`, { stdio: ["ignore", "inherit", "inherit"] });
};

main().catch(console.error);
