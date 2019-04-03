import babel from "rollup-plugin-babel"
import replace from "rollup-plugin-replace"
import commonjs from "rollup-plugin-commonjs"
import json from 'rollup-plugin-json'
import nodeResolve from "rollup-plugin-node-resolve"
import localResolve from 'rollup-plugin-local-resolve'
import { sizeSnapshot } from "rollup-plugin-size-snapshot"

import pkg from "./package.json"
const name = "CRUD";
const input = "./modules/index"


const globals = {
  react: "React",
  "prop-types":"PropTypes",
  "qs":"qs",
  "cross-fetch":"fetch"
};
const babelOptionsCJS = {
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
  output: { file: `esm/${pkg.name}.js`, format: "esm" },
  external:Object.keys(globals),
  plugins: [
    localResolve(),
    nodeResolve(),
    json(),
    babel(babelOptionsESM),
    sizeSnapshot()
  ]
},{
   input,
   output: { file: `umd/${pkg.name}.js`, format: "umd", name },
   external: Object.keys(globals),
   plugins: [
     localResolve(),
     nodeResolve(),
     babel(babelOptionsESM),
     commonjs(commonjsOptions),
     replace({ "process.env.NODE_ENV": JSON.stringify("production") }),
     sizeSnapshot()
   ]
}]
