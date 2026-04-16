import {useMutation, useQueryClient} from "@tanstack/react-query"
import type {SchemaCreatePlaylistRequestPayload} from "../../../../shared/api/schema.ts"
import {client} from "../../../../shared/api/client.ts"

export const useAddPlaylistMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: SchemaCreatePlaylistRequestPayload) => {
            const response = await client.POST("/playlists", {
                body: data,
            })
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['playlists'],
                refetchType: "all",
            })
        },
        meta: { globalErrorHandler: "on" },
    })
}