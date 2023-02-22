import NextAuth from "next-auth";
import { getProviders } from "next-auth/react";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  useCdn: process.env.NODE_ENV === "production",
});

const options = {
  providers: [
    getProviders().credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const { email, password } = credentials;
        const query = `*[_type == "user" && email == $email && password == $password]`;
        const params = { email, password };
        const result = await client.fetch(query, params);
        if (result.length > 0) {
          return { email: result[0].email };
        } else {
          return null;
        }
      },
    }),
  ],
  database: process.env.NEXT_PUBLIC_DATABASE_URL,
  pages: {
    signIn: "/login",
    signOut: "/",
  },
  session: {
    jwt: true,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
};

export default (req, res) => NextAuth(req, res, options);
