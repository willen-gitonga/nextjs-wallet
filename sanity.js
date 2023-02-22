import {createClient} from '@sanity/client'

export const client = createClient({
  projectId: 'y2vd9vax',
  dataset: 'production',
  apiVersion: "2023-02-20",
  useCdn: false,
  token: "sk513eR5DVvb5ThvrA405J7aAw4krvuzKf3CorqwgecQ4heYRetrwGZLCx2rLP56N0k0smxrYOyD85Qq5uKUSlfchugaP6s7Pn3j1vgOAeNPmeDGKtO9a1ZGdlnWPA9CtnQiMWokTpYfcaAIjU3stFzuYICP18X71ry0X5GRnL9m719uJJlM"
});
