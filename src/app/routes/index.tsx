import { createFileRoute } from "@tanstack/react-router"
import {PlayListsPage} from "../../pages/playlists-page.tsx"

export const Route = createFileRoute("/")({
    component: PlayListsPage,
})