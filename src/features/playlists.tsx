import {useQuery} from "@tanstack/react-query";
import {client} from "../shared/api/client.ts";

import {Pagination} from "../shared/ui/pagination/pagination.tsx";
import {useState} from "react";

import { keepPreviousData } from "@tanstack/react-query"

export const Playlists = () => {
    const [page, setPage] = useState(1)

    const query = useQuery({
        queryKey: ["playlists", page],
        queryFn: async ({signal}) => {
            const response = await client.GET("/playlists", {
                params: {
                    query: {
                        pageNumber: page,
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

    console.log("status:" + query.status)
    console.log("fetchStatus:" + query.fetchStatus)

    if (query.isPending) return <span>Loading...</span>
    if (query.isError) return <span>{JSON.stringify(query.error.message)}</span>

    return (
        <div>
            <hr/>
            <Pagination
                pageCount={query.data.meta.pagesCount}
                currentPage={page}
                onPageNumberChange={setPage}
                isFetching={query.isFetching}
            />
            <ul>
                {query.data.data.map((playlist) => (
                    <li>{playlist.attributes.title}</li>
                ))}
            </ul>
        </div>
    )
}