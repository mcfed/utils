import babel from "rollup-plugin-babel"
import replace from "rollup-plugin-replace"
import commonjs from "rollup-plugin-commonjs"
import json from 'rollup-plugin-json'
import nodeResolve from "rollup-plugin-node-resolve"
import localResolve from 'rollup-plugin-local-resolve'
import { sizeSnapshot } from "rollup-plugin-size-snapshot"
import notify from 'rollup-plugin-notify'
import tscompile from 'typescript';
import typescript from 'rollup-plugin-typescript'
import extensions from 'rollup-plugin-extensions'

import pkg from "./package.json"
const name = "crud";
const input = "./modules/index.ts"


const globals = {
  "qs":"qs"
};
const babelOptionsCJS = {
  runtimeHelpers: true,
  exclude: /node_modules/
};
const babelOptionsESM = {
  exclude: /node_modules/,
  runtimeHelpers: true,
  plugins: [["@babel/transform-runtime", { useESModules: true }]]
};
const commonjsOptions = {
  include: /node_modules/
};
const external = id => !id.startsWith(".") && !id.startsWith("\/");

export default [{
  input,
  output: { file: `cjs/index.js`, format: "cjs" },
  external:Object.keys(globals),
  plugins: [
    nodeResolve(),
    commonjs(commonjsOptions),
    // typescript({module: 'CommonJS'}),
     typescript({typescript: tscompile}),
    // babel(babelOptionsESM),
    sizeSnapshot(),
    notify(),
    extensions({ extensions: ['.ts', '.js'], }),
  ]
}]
