import {useEffect, useState} from "react";
import {Playlists} from "../features/playlists.tsx";


export function PlayListsPage() {
    const [isVisible, setIsVisible] = useState(true)
    useEffect(() => {
        setInterval(() => {
            setIsVisible((prev) => !prev)
        }, 3000)
    }, [])
    return (
        <>
            <h2>hello it-incubator!!!</h2>
            {isVisible && <Playlists />}
        </>
    )
}
