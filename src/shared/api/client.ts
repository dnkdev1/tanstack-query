import createClient, {type Middleware} from "openapi-fetch"
import type {paths} from "./schema"

export const baseUrl = "https://musicfun.it-incubator.app/api/1.0/"
export const apiKey = "337b3262-f37f-4b39-bade-2207035ea372"

let refreshPromise: Promise<void> | null = null

function makeRefreshToken(): Promise<void> {
    if (!refreshPromise) {
        refreshPromise = (async () => {
            const refreshToken = localStorage.getItem('musicfun-refresh-token')
            if (!refreshToken) throw new Error('No refresh token')

            const response = await fetch(baseUrl + 'auth/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': apiKey,
                },
                body: JSON.stringify({ refreshToken }),
            })

            if (!response.ok) {
                localStorage.removeItem('musicfun-access-token')
                localStorage.removeItem('musicfun-refresh-token')
                throw new Error('Refresh token failed')
            }

            const data = await response.json()
            localStorage.setItem('musicfun-access-token', data.accessToken)
            localStorage.setItem('musicfun-refresh-token', data.refreshToken)
        })()

        refreshPromise.finally(() => {
            refreshPromise = null
        })
    }

    return refreshPromise
}


const authMiddleware: Middleware = {
    onRequest({ request }) {
        const accessToken = localStorage.getItem('musicfun-access-token')
        if (accessToken) {
            request.headers.set('Authorization', 'Bearer ' + accessToken)
        }

        // @ts-expect-error hot fix
        request._retryRequest = request.clone()

        return request
    },

    async onResponse({ request, response }) {
        if (response.ok) return response
        if (!response.ok && response.status !== 401) {
            const errorBody = await response.json()
            throw errorBody
        }

        try {
            await makeRefreshToken()
            // @ts-expect-error ignore it
            const originalRequest: Request = request._retryRequest
            const retryRequest = new Request(originalRequest, {
                headers: new Headers(originalRequest.headers),
            })
            retryRequest.headers.set(
                'Authorization',
                'Bearer ' + localStorage.getItem('musicfun-access-token')
            )
            return fetch(retryRequest)
        } catch {
            return response
        }
    },
}



export const client = createClient<paths>({
    baseUrl: baseUrl,
    headers: {
        "api-key": "337b3262-f37f-4b39-bade-2207035ea372",
    },
})


client.use(authMiddleware);