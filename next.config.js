/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  api: "api.js",
}

module.exports = nextConfig

module.exports = {
  env: {
    SANITY_PROJECT_ID: "y2vd9vax",
    SANITY_DATASET: "production",
    NEXT_PUBLIC_DATABASE_URL: "https://y2vd9vax.api.sanity.io/v1/data/query/production",
    JWT_SECRET: "ywizhagJsxucdv0p8QiPsrFyFgSdmnQT3xNMTVd2pkM=",
  },
};

