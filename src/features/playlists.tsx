import {useQuery} from "@tanstack/react-query";
import {client} from "../shared/api/client.ts";

export const Playlists = () => {
    const query = useQuery({
        queryKey: ["playlists"],
        // queryFn: () => client.GET("/playlists"),
        queryFn: async () => {
            const response = await client.GET("/playlists")
            return response.data! //сейчас будем считать что у нас точно есть данные
            // и ошибка не упадёт
        },
    })

    console.log("status:" + query.status)
    console.log("fetchStatus:" + query.fetchStatus)

    if (query.isPending) return <span>Loading...</span>
    if (query.isError) return <span>{JSON.stringify(query.error.message)}</span>

    return (
        <div>
            if (query.isFetching) return <span>⏳</span>
            <ul>
                {query.data.data.map((playlist) => (
                    <li key={playlist.id}>{playlist.attributes.title}</li>
                ))}
            </ul>
        </div>
    )
}