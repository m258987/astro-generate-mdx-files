import client from '../../utils/contentful-client.mjs'
import fileSaver from '../../utils/file_saver.mjs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const filename = 'content.json'
const path = __dirname

export default async function generate() {
  console.log(`[codegen]: 🕓 Fetching data for ${__dirname}...`)
  try {
    const entries = await client.getEntries({
      content_type: 'blog',
      limit: 1000,
    })

    const content = JSON.stringify(entries, null, 2)
    const file = `${content}`

    fileSaver(`codegen-blog`, filename, path, file)
  } catch (e) {
    console.error(`[codegen-blog]: ❌ generating json at ${__dirname} FAILED!`)
    console.error(e)
  }
}
generate()
