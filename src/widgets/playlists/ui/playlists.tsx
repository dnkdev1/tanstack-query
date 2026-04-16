import {useQuery} from "@tanstack/react-query";
import {client} from "../../../shared/api/client.ts";

import {Pagination} from "../../../shared/ui/pagination/pagination.tsx";
import {type ChangeEvent, useState} from "react";

import { keepPreviousData } from "@tanstack/react-query"
import {DeletePlaylist} from "../../../features/playlists/delete-playlist/ui/delete-playlist.tsx";

type Props = {
    userId?: string
    onPlaylistSelected?: (playlistId: string) => void
}

export const Playlists = ({userId, onPlaylistSelected,}: Props) => {
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")

    const query = useQuery({
        queryKey: ["playlists", {page, search, userId}],
        queryFn: async ({signal}) => {
            const response = await client.GET("/playlists", {
                params: {
                    query: {
                        pageNumber: page,
                        search,
                        userId,
                    },
                },
                signal
            })
            if (response.error) {
                throw (response as unknown as { error: Error }).error
            }
            return response.data
        },
        placeholderData: keepPreviousData,
    })

    const handleDeletePlaylist = (playlistId: string) => {
        onPlaylistSelected?.(playlistId)
    }

    const handleSelectPlaylistClick = (playlistId: string) => {
        onPlaylistSelected?.(playlistId);
    }

    console.log("status:" + query.status)
    console.log("fetchStatus:" + query.fetchStatus)

    if (query.isPending) return <span>Loading...</span>
    if (query.isError) return <span>{JSON.stringify(query.error.message)}</span>

    return (
        <div>
            <div>
                <input
                    value={search}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.currentTarget.value)}
                    placeholder={"search..."}
                />
            </div>
            <hr />
            <Pagination
                pageCount={query.data.meta.pagesCount}
                currentPage={page}
                onPageNumberChange={setPage}
                isFetching={query.isFetching}
            />
            <ul>
                {query.data.data.map((playlist) => (
                    <li key={playlist.id} onClick={() => handleSelectPlaylistClick(playlist.id)}>
                        {playlist.attributes.title} <DeletePlaylist onDeleted={handleDeletePlaylist} playlistId={playlist.id}/>
                    </li>
                ))}
            </ul>
        </div>
    )
}