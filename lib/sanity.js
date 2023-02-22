import sanityClient from '@sanity/client'

export const client = sanityClient({
  projectId: 'y2vd9vax',
  dataset: 'production',
  apiVersion: '2022-12-31', // use current UTC date
  token:
    'skVVjnCDl2581OlTbR8DdQysBoz7dDYa97VDin56vhfc3YfBFXYnZd6drZyjf4QfReWrp39jPPbIB5f6CI2Bx6iT8H38gEqzElfKxouPdVpCZaYDcyGCrqaBD4mpJBBfjtoDUUu755CDVt3EcqbptWBpIAnzWYHV17ZQypHKW3RpkrQ89PO7', 
  useCdn: false, // `false` if you want to ensure fresh data
})