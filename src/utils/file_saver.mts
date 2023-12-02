import * as fs from 'fs/promises'

export default async function fileSaver(
  service_name: string,
  filename: string,
  path: string,
  file: string
) {
  console.log(
    `${new Date().toLocaleTimeString()} [${service_name}]: Trying to generate file ${filename} at ${path}`
  )
  const controller = new AbortController()
  const { signal } = controller

  const settings = {
    encoding: 'utf8' as BufferEncoding,
    flag: 'w',
    signal,
  }

  try {
    await fs.access(path)
    await fs.writeFile(path + '/' + filename, file, settings)
  } catch (e) {
    await fs.mkdir(path)
    await fs.writeFile(path + '/' + filename, file, settings)
  } finally {
    console.log(
      `${new Date().toLocaleTimeString()} [${service_name}]: ✅ ${filename} was generated at path ${path}`
    )
  }
}
