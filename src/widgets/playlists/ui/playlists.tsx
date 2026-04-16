import {Pagination} from "../../../shared/ui/pagination/pagination.tsx";
import {type ChangeEvent, useState} from "react";
import {DeletePlaylist} from "../../../features/playlists/delete-playlist/ui/delete-playlist.tsx";
import {usePlaylistsQuery} from "../api/use-playlists-query.ts";

type Props = {
    userId?: string
    onPlaylistSelected?: (playlistId: string) => void

    isSearchActive?: boolean
}

export const Playlists = ({userId, onPlaylistSelected, isSearchActive}: Props) => {
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")


    const query = usePlaylistsQuery(userId, { search, pageNumber: page })

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

            {isSearchActive && <>
                <div><input
                    value={search}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.currentTarget.value)}
                    placeholder={"search..."}
                /></div>
                <hr />
            </>}


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