import './App.css'
import {useEffect} from "react";
import {client} from "./shared/api/client.ts";

function App() {

    useEffect(() => {
        (async function () {
            const response = await client.GET("/playlists")
            const data = response.data
            console.log(data)
        })()
    }, [])

  return (
    <>
      <h1>Hello</h1>
    </>
  )
}

export default App
