import {Playlists} from "../features/playlists.tsx";
import {useMeQuery} from "../features/auth/api/use-me-query.ts";
import {Navigate} from "@tanstack/react-router";


export function MyPlaylistsPage() {
    const { data, isPending } = useMeQuery()

    if (isPending) return <div>Loading...</div>

    if (!data) {
        return <Navigate to="/" replace />
    }

    return (
        <div>
            <h2>My Playlists</h2>
            <Playlists userId={data.userId} />
        </div>
    )
}