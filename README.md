---
title: 'How to GENERATE markdown files in ASTRO'
description: 'You know CMSs are a thing, right?'
pubDate: '1 Dec 2023'
heroImage: '../../assets/blog/generating-astro-files.png'
# youtube: 'https://youtu.be/j1T3Nw5upqo'
# codepen: 'https://codepen.io/faslin_kosta/pen/oNmyYzB?editors=0100'
keywords:
  - 'astro js generate markdown files'
  - 'astro'
  - 'md'
  - 'mdx'
  - 'generate'
  - 'astro js generate mdx files'
  - 'astro js cms system'
---

## **Before we start...**

If you already used Astro and/or Contentful and are familiar with them, you can skip to [The Connection](#the-connection) section and grab the code from there. :)

# Introduction

---

[Astro](https://astro.build/) is one of the most loved, versatile, and promising JS frameworks of the 2020s. It allows you to create a static website from the ground up, using syntax very similar to vanilla HTML. On top of that, if you want to add a little bit of spice, Astro allows you to use most UI libraries on the market like React, Vue, and Svelte. [Integrations](https://astro.build/integrations/) are also a thing, giving you the power to use TailwindCSS, Sitemaps, icons, storybooks, MDX, and many more with just one line in the terminal. With its newest updates, Astro also added support for Server-Side Generation or Hybrid mode, where you can have static pages and server-side ones at the same time! Take that, Next.js.

But now, in all seriousness, Astro really, really shines when it's used to create SSG sites like blogs or the site you are reading this article on. But when the piles of content get too big, people tend to use a CMS system, like [Contentful](https://www.contentful.com/), to store their data and stream it to their platforms. And while Astro is very good at generating content and optimizing images from its `.md` or `.mdx` files, I have not found an official way in their documentation to generate such files in the project's file system.

So with **little** to **no** research on my side if there are any libraries that can do this, I can **proudly** say that this is the only way you can do it. (That's how I did it in a real project.) And we will utilize Node.js scripts and [Contentful CMS](https://www.contentful.com/) to do that magic.

Let's begin!

# Resources

- 🔗 Youtube: Comming soon
- 🔗 Github:

# Project Setup

---

First things first, we need an Astro project, right? So let's make one with this command. Make sure you have the latest version of Node.js installed and make sure you use [NVM](https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/), bacause why wouldn't you?!

```bash
# create a new project with npm
npm create astro@latest
```

The Installation guide has a full step-by-step tutorial on how to setup your project with a cute little mascot helping you on the way :3.

It will ask you where you want to create your project, so just choose your destination and name your project. Since I have already opened the folder I want to install my project into in VS Code, I will just type ./

```bash
astro   Launch sequence initiated.

dir   Where should we create your new project?
./ # <-- type this if you have your project opened in vs code or the terminal

```

After that I am going to choose the blog template, since it already has a [Content Collection](https://docs.astro.build/en/guides/content-collections/) created. Since you are reading this, you most probably know what a content collection is, but briefly it's just one ts file, that defines the collection with ZOD and some folders with `.mdx` files, which will generate our pages. More on that later. For now just choose the second option.

```bash
  tmpl   How would you like to start your new project?
         ○ Include sample files
         ● Use blog template # <-- choose this one
         ○ Empty
```

Next prompt will ask you if you'd like to install your deps - choose yes. This will create a `node_modules` folder in your project.

After that is the prompt for TypeScript. I prefer to use it, so I will choose `yes` and then `strict`, but you can choose what ever suits you best.

Last step - it is going to ask for a git repo, which I won't setup in this tutorial.

And finally we are greeted with this super cute screen, which means we are ready to go!

![welcome screen](../../assets/blog/generating-astro-files-2.png)

# The content collection

---

After our project init we can jump to our content folder, where we can see the config file, a blog folder and 5 generated markdown posts. These `.md` and `.mdx` files are the ones that we need to generate from our CMS

![welcome screen](../../assets/blog/generating-astro-files-3.png)

Let's start with the `.md` or `.mdx` files. They look a lot like an ordinary `.astro` file, they should start with the triple dashes `(---)`, then between the first and the secont dashes you have your key/value area, where you can define constants. This is called the **frontmatter**. After the second tripple dashes is the content area, where you can write content in [Markdown sythax](https://www.markdownguide.org/basic-syntax/). The difference between `.md` and `.mdx` is that `.mdx` files can also import components in the content section.

```mdx
---
# this is the frontmatter, it uses the yml sythax.
title: "First post" # <-- these are constants
description: "Lorem ipsum dolor sit amet"
pubDate: "Jul 08 2022"
heroImage: "/blog-placeholder-3.jpg"
keywords: # <-- this is an array
  - word1
  - word2
nested-object: # <-- this is an object
  property: 'value'

js-array: ['value1', true, { key:"value" }] # <-- in .mdx you can write them like this aswell. It would still count, just do NOT forget the space between the key: and the "value".
invalid-value:"dont do this"
tip: "also, don't use commas", #<-- this will result in an error.
---

{/* this is the content section */}

# Heading1

## Heading2

### Heading3

#### Heading4

- ul item

1. ol item

[link](https://something.com)
![image](/image)
paragraph

import Title from './../title.astro'

<Title>I am a component</Title>

> > > > > > > > > >
```

Now let's look at the config. It allows us to create and validate new collections using [Zod](https://zod.dev/). I won't go into details on how Zod works, but I will explain how you can modify or create collections. first we must import `defineCollection` and `z` (zod) from `"astro:content"`. If you see some red error squiggly lines, do not panic. We haven't generated our types and collections yet! We can run `npm run build` to fix that. Now back to the config file.

We have this piece of code:

```ts
import { defineCollection, z, reference } from 'astro:content'

// we start by asigning a constant the return of the defineCollection function
const blog = defineCollection({
  // we pass an object with one key: schema
  // The schema validates if the properties in the frontmatter are the right type, length, format and so on
  // if they are not, a build error with be thrown

  schema: ({ image }) =>
    z.object({
      // z.object is like an object, just in zod :P
      title: z.string(), //<-- this is a string
      description: z.string(),
      pubDate: z.coerce.date(), //<-- this turns human readable date into a new Date() class
      updatedDate: z.coerce.date().optional(), //<-- this is optional property
      heroImage: image().optional(), // this is the image helper, it autoimports images from your file system and generates optimized ones
      heroImageString: z.string().optional(), // <-- you can pass images as paths too, but they won't be optimized if you don't pass width and height too.
      heroImageObject: z // <-- This is what we are going to use. It imitates the ImageMetadata that astro:image needs
        .object({
          src: z.string(),
          width: z.number(),
          height: z.number(),
          alt: z.string(),
          format: z.string(),
        }),
      keywords: z.string().array(), // <-- this is an array
      someOtherCollectionEntry: reference('collection-name'), // <-- this is like a relation, you have to pass the slug (folder and file name) of the file you want to reference and it will return its slug and collection name
    }),
})

export const collections = { blog } // <-- we export all our schemas, that way we can then get them with the getCollection function
```

Do we know what the schemas and markdown files are now? We do? Good. Let's continue now.

# The data

---

We know what data we should generate and we know how our markdown file should look like.

Our schema has five fields:

- title : string
- description : string
- pubDate : string
- updatedDate : string?
- heroImage : object

and one hidden content field that is a markdown string

```ts
const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.object({
      src: z.string(),
      width: z.number(),
      height: z.number(),
      alt: z.string(),
      format: z.string(),
    }),
  }),
})
```

That means our generated `.mdx` files should look like this:

```mdx
---
title: 'Lorem ipsum'
description: 'Lorem ipsum dolor sit amet'
pubDate: 'Dec 1 2023'
heroImage:
  src: 'some-url'
  width: 450
  height: 450
  alt: '1.jpeg'
  format: 'jpeg'
---

Lorem ipsum
```

Simple, right? Now we must step away from the code and setup our CMS. As I typed up there, we are goind to use [Contentful](https://contentful.com), because it's pretty easy to setup.

# The CMS

---

Now we have to go to [Contentful](https://contentful.com). Since this is not a Contentful tutorial, I won't go over how to create and account and space. We will start with content type creation. Let's create our first content type - the blog. We will add the same fields that we have in our schema, same types and requirements + two additional fields - the slug and the content.

You should setup your fields as follows:

- title: `text -> short text -> required, entry title`
- slug: `text -> short text -> required, slug input, unique`
- description: `text -> long text -> required, long text input` (we don't want MD here)
- pubDate: `date -> required, date and time`
- updateDate: `date -> date and time`
- heroImage: `media -> required, accept only Image`
- content: `text -> long text -> required, markdown input`

After creating our content type, it should look like this

![welcome screen](../../assets/blog/generating-astro-files-4.png)

Some info for the additional fields.

1. The slug
   - That is the field that will generate our ULRs. It's typically infered from the entry title which is our, you guessed it, title field.
2. The content
   - It is a long text field that supports markdown synthax. Woah. Just like Astro's `.mdx` files 😱. Wonder why we choose Contentful...

After we've done the types, it's time to create our first post.

![welcome screen](../../assets/blog/generating-astro-files-6.png)

# The Connection

---

Alright! We have our CMS set up and ready, and we also have our frontend schemas ready to consume it. We just need to connect the two of them.

Let's start by obtaining our space id and API key from Contentful:

If you do not have one:

`Settings Dropdown -> Api keys -> Add API key -> Input a name and description -> See your Space ID and Content Delivery API - access token`

If you do:

`Settings Dropdown -> Api keys -> Find and click the existing key -> See your Space ID and Content Delivery API - access token`

Now that we have our keys, we can go back to our project and put them in an `.env` file!

`.env`

```env
CONTENTFUL-SPACE-ID={YOUR_SPACE_ID}
CONTENTFUL-API-KEY={YOUR_API_KEY}
```

Tip: make sure this file is added in `.gitignore`

After we have our keys, we must install the contentful package from npm

```bash
npm i contentful
```

And create a file `contentful-client.mts`

```ts
import contentful from 'contentful'

const client = contentful.createClient({
  space: import.meta.env['CONTENTFUL-SPACE-ID'],
  accessToken: import.meta.env['CONTENTFUL-API-KEY'],
  environment: 'master',
  retryLimit: 3,
})
export default client
```

You can create it whereever you like, I am going to create a `utils` folder in my `src` directory and add the client there.
`./src/utils/contentful-client.mts`

We also have to install a package called `dotenv`, so that we can load our env before excecuting any node scripts.

# The file saver

And we are ready to beggin with making the scripts. All we have to do is create a few functions, 3 to be exact:

- a file saver helper function that accepts the path, the name of the file and its content and creates or updates a file in that specific directory
- a generate function, that gets content from contentfull and writes it down as json file
- a writer function that maps the contentful file to match our schema and then calls the file saver function to save that file/files.

Ok, let's begin by creating our helper function. First we have to import `file system` or `fs` so that we can read and write to the file system. After that we are going to create a function with 4 parameters:

1. the name of the operation (for loggin purpouses)
2. the file name - a string
3. the path to the file, including the file name with its extension
4. the file content as string

```ts
import * as fs from 'fs/promises'

export default async function fileSaver(
  service_name: string,
  filename: string,
  path: string,
  file: string
) {
  // todo: creates ot updates files
}
```

Once we have those we can try to create or update our file. First we need to access the file. If we succeed, we will overwrite it. If we cannot access it, that means that there is no such file, so we can create it. We will use file system methods to do so.

```ts
import * as fs from 'fs/promises'

export default async function fileSaver(
  service_name: string,
  filename: string,
  path: string,
  file: string
) {
  try {
    //
    await fs.access(path)
  } catch (e) {
    await fs.mkdir(path)
  }
}
```

There. If access does not throw an error, that means that there is a file with that name. If it does, that means that there isn't any. (Since we are accesing files in a non private directory, there shouldn't be any permission errors, so the only one is the once where the file does not exist.)

Now we have to do the writing. We can call `fs.writeFile` which requires a few params like the encoding, a flag and a signal to abor the request if needed. Let's make those.

```ts
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
  const controller = new AbortController() // <-  you can call controller.abort() to stop the request any time
  const { signal } = controller // <-- extract the signal, so you can pass it to the writeFile function

  const settings = {
    encoding: 'utf8' as BufferEncoding, // <-- set the encoding as UTF8
    flag: 'w', // <-- !set the flag to w. That means that it will write the file if it does not exist, or will overwrite it if it exists. more on flags:  https://stackoverflow.com/a/50174822/16430955
    signal, // <-- pass the signal
  }

  try {
    // check if the directory it exists
    await fs.access(path)

    // write the file, needs path + file + extension
    await fs.writeFile(path + '/' + filename, file, settings)
  } catch (e) {
    // if not, make it
    await fs.mkdir(path)

    // write the file, needs path + file + extension
    await fs.writeFile(path + '/' + filename, file, settings)
  } finally {
    // finaly log the operation
    console.log(
      `${new Date().toLocaleTimeString()} [${service_name}]: ✅ ${filename} was generated at path ${path}`
    )
  }
}
```

And here is the whole function without any comments so you can assimilate it better:

```ts
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
```

Ok, now that we have our helper function we can write the `generate` one. It will simply call contentful and get the entries we specified, then use the helper function to create a JSON file.

# The generator

Let's create a folder in `src` directory called `code-gen`, then inside we will make one named `blog` for our blog collection and in it we will create the `generate.mts` file.

```ts
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
```

The function may look scary, but it is actually pretty straight forward. We first import our `contentful client` and `file saver` functions. We then get `dirname` and `join` from the `path` library, which you do not need to install. And we will also need `fileURLToPath` from url (no installing as well). We will then do the following:

- we will get the current file's path from `import.meta.url` with the function `fileURLToPath`. It decodes the file URL to a path string and ensures that the URL control characters (/, %) are correctly appended/adjusted when converting the given file URL into a path. [Resource](https://www.geeksforgeeks.org/node-js-url-fileurltopath-api/)
- we will then get the dirname by calling `dirname` with `__filename`. Since this is a node.js env and not browser, we do not have access to dirname in the global scope.
- then we will create our `filename`, which will be `content.json`
- after that we will create the path to our file with `join` from `path` which basically creates an absolute path for the current file system to the desired location. You can use relative paths as well, which we will do when generating files in the `content` folder.

After we have created those consts, we can proceed with the http request to contentful. We will use our client to get all entries.

```ts
// Tip: You can get all locales with:
// client.withAllLocales.getEntries(...)

const entries = await client.getEntries({
  content_type: 'blog', // blog collection
  limit: 1000, // get the max amount of entries
})
```

Once we have our entries we can create a JSON string from them

```ts
const content = JSON.stringify(entries, null, 2)
// creating a new const here to show you that you can add other text. It's just plain text file.
const file = `${content}`
```

```ts
fileSaver(`codegen-blog`, filename, path, file)
```

This function will now create a new file called `content.json` next to our `generate.mts` file.

# The writer

We have one last function to create and that is `write.mts`. The function gets `content` from the json and then maps all entries to match our collection schema. It also can insert default values. After it is ready, it writes it down to file. Since we covered that already, let's see that function.

```ts
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
```

Summing up the function, we do the same as before. We get the dirname, we create the file name, we create content for the file, that means mapping the fileds of `content.json`. `generateImageFromContentful` does the same, it gets the image from contentful and maps its fields to fit our schema.

We then create a text file content `const file` that has the tripple dashes (---), the front matter (all properties). And after the second dashes we put our content. We then save the file with `fileSaver`.

And that is it. That are all the files you need to fetch data and write it down to the file system. Now we just need to create the node scripts, so that we can call our functions before the build.

# The node scripts

We need three scripts. One for the generation, one for the writing and one to call them before the build starts.

Let strart with the generate one:

```bash
"generate:blog": "npx ts-node -r dotenv/config --experimental-specifier-resolution=node --esm ./src/code-gen/blog/generate.mts",
```

Let's see what we have here.

1. We call `npx ts-node` to execute typescript files. If you use js, you can simply call `node`,
2. We then load our `.env` file with `-r dotenv/config`.
3. We pass a flag `--experimental-specifier-resolution=node` to accept file extensions.
4. We pass a flag `--esm` to say we use ESModules (.mts files)
5. We give it the path to our file `./src/code-gen/blog/generate.mts`

And this script will call our function in the generate file.

Next we need one for the write file, which will be pretty much the same:

```bash
"generate:blog": "npx ts-node -r dotenv/config --experimental-specifier-resolution=node --esm ./src/code-gen/blog/write.mts"
```

And after that we need a prebuild script which will call both scripts one after another:

```bash
prebuild: npm run generate:blog && npm run write:blog
```

You can optimize the build script to call another function, that imports all other functions and executes them for a very big performace boost, but for now we will leave it as is.

And that IS it. There is nothing more to do. You can stack these files and make more scripts (or import them in prebuild func) to generate more files at build time.

# "It's not working on my PC" QA

1. Q: I have errors in the terminal about tsconfig

- Here, use this one

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "noEmit": true,
    "forceConsistentCasingInFileNames": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "allowJs": true,
    "strict": true
  }
}

or just copy astro's one from node modules. Or use custom one.
```

2. Which version of node is that?

- v18.17.0

3. I have type errors.

- Pres ctrl+p / command + p and type `> Developer: Reload Window`, sometimes Astro gets stuck on types. Or try `npm run astro sync`

4. I still have them.

- try to rebuild your project to get the new content.

5. Still have them...

- Go to the github repo and copy the files from there. Sometimes you can make a mistake so unnoticeable that even god won't be able to find it.

5. My image files are blowing up with errors.

- You have to change every `<img/>` tag with `<Image>` from `astro:assets` and do this

```tsx
<Image src={your_src as ImageMetadata} alt="some text" />
```

6. Astro said that it can't find an image?

- If you have relative imports somewhere, where you use astro:image, you have to import the image yourself and pass it

Instead of

```tsx
<Image
  src={{
    src:"/image.png",
    width: 100,
    height: 100,
    alt: "asd",
    format: "png",
    ...
  }}
/>
```

Do this:

```tsx
import image from '../path/to/your/image.png'

<Image src={image} alt="asd">
```

# Thank you

Thanks for reading, guys! Hope i helped!

See you in the next one!
