import createClient from "openapi-fetch"
import type { paths } from "./schema"

export const client = createClient<paths>({
    baseUrl: "https://musicfun.it-incubator.app/api/1.0",
    headers: {
        "api-key": "337b3262-f37f-4b39-bade-2207035ea372",
    },
})