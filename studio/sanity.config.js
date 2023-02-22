import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas/schema'

export default defineConfig({
  name: 'default',
  title: 'coinbase-blockchain-app',

  projectId: 'y2vd9vax',
  dataset: 'production',

  plugins: [deskTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
