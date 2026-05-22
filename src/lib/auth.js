import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { Pool } from "pg";

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    basePath: "/api/auth",
    secret: process.env.BETTER_AUTH_SECRET,

    database: new Pool({
        connectionString: process.env.DATABASE_URL,
    }),

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
    },

    emailAndPassword: {
        enabled: true,
    },

    user: {
        additionalFields: {
            photoURL: { type: "string", required: false },
            bio: { type: "string", required: false },
        },
    },

    trustedOrigins: [
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    ],

    session: {
        cookieCache: {
            enabled: true,
            strategy: "jwt",
            maxAge: 7 * 24 * 60 * 60, // 7 days in seconds

        }
    },
    plugins: [
        jwt()

    ]
});