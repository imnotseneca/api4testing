import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

export default function readJSON (path) {
  console.log(require(path))
  return require(path)
}
