import fileSaver from '../../utils/file_saver.mjs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import api_content from './content.json' assert { type: 'json' }
import generateImageFromContentful from '../../utils/generate-image-from-contentful.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
import fsExtra from 'fs-extra'

export default async function write() {
  console.log(
    `[codegen]: ␡ Purging all files from directories src/content/blog...`
  )
  await fsExtra.emptyDir(join(__dirname, `../../content/blog`))

  console.log(`[codegen]: ✍️ Writing data for ${__dirname}...`)
  try {
    api_content.items.forEach((item) => {
      const filename = `${item.fields.slug}.mdx`

      const path = join(__dirname, `../../content/blog`)
      const content = {
        title: item.fields.title,
        description: item.fields.description,
        pubDate: item.fields.pubDate,

        heroImage: generateImageFromContentful(
          item.fields.heroImage.fields.file,
          'original'
        ),
      }
      const file = `---
${Object.entries(content)
  ?.filter(([key, value]) => !!value)
  ?.map(([key, value]) => `${key}: ${value}`)
  .join('\n')}
---
${item.fields.content}
`

      fileSaver(`codegen-write-${filename}`, filename, path, file)
    })
  } catch (e) {
    console.error(`[codegen-write]: ❌ writing data for ${__dirname} FAILED!`)
    console.error(e)
  }
}
write()
