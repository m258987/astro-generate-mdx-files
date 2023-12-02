import contentful from 'contentful'

const client = contentful.createClient({
  space: process.env['CONTENTFUL-SPACE-ID'] as string,
  accessToken: process.env['CONTENTFUL-API-KEY'] as string,
  environment: 'master',
  retryLimit: 3,
})
export default client
