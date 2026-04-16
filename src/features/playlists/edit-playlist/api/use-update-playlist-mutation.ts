import { useMutation, useQueryClient } from "@tanstack/react-query"
import type {
    SchemaGetPlaylistsOutput,
    SchemaUpdatePlaylistRequestPayload,
} from "../../../../shared/api/schema.ts"
import { client } from "../../../../shared/api/client.ts"
import type {JsonApiErrorDocument} from "../../../../shared/utils/json-api-error.ts";
import {playlistsKeys} from "../../../../shared/api/key-factories/playlists-keys-factory.ts";


type MutationVariables = SchemaUpdatePlaylistRequestPayload & { playlistId: string }

export const useUpdatePlaylistMutation = ({
                                              onSuccess,
                                              onError,
                                          }: {
    onSuccess?: () => void
    onError?: (error: JsonApiErrorDocument) => void
}) => {
    const queryClient = useQueryClient()

    const key = playlistsKeys.myList()

    return useMutation({
        mutationFn: async (variables: MutationVariables) => {
            const { playlistId, data } = variables
            const response = await client.PUT("/playlists/{playlistId}", {
                params: { path: { playlistId: playlistId } },
                body: {
                    data: {
                        type: data.type,
                        attributes: {
                            ...data.attributes,
                            tagIds: [],
                        },
                    },
                },
            })

            if (response.error) {
                throw response.error
            }

            return response.data
        },
        onMutate: async (variables: MutationVariables) => {

            await queryClient.cancelQueries({ queryKey: playlistsKeys.all })

            const previousMyPlaylists =
                queryClient.getQueryData<SchemaGetPlaylistsOutput>(["playlists"])

            queryClient.setQueryData<SchemaGetPlaylistsOutput>(key, (oldData: SchemaGetPlaylistsOutput | undefined) => {
                if (!oldData) return oldData
                return {
                    ...oldData,
                    data: oldData.data.map((p) => {
                        if (p.id === variables.playlistId)
                            return {
                                ...p,
                                attributes: {
                                    ...p.attributes,
                                    description: variables.data.attributes.description,
                                    title: variables.data.attributes.title,
                                },
                            }
                        else return p
                    }),
                }
            })

            return { previousMyPlaylists }
        },

        onError: (error, __: MutationVariables, context) => {
            // queryClient.setQueryData(key, context!.previousMyPlaylists)
            if (context?.previousMyPlaylists) {
                queryClient.setQueryData(["playlists"], context.previousMyPlaylists)
            }
            onError?.(error as unknown as JsonApiErrorDocument)
        },
        onSuccess: () => {
            onSuccess?.()
        },

        onSettled: (_, __, variables: MutationVariables) => {
            queryClient.invalidateQueries({
                queryKey: playlistsKeys.lists(),
                refetchType: "all",
            })
            queryClient.invalidateQueries({
                queryKey: playlistsKeys.detail(variables.playlistId),
                refetchType: "all",
            })
        },
    })
}