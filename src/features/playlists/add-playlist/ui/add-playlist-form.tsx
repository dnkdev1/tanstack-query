import { useForm } from "react-hook-form"
import type { SchemaCreatePlaylistRequestPayload } from "../../../../shared/api/schema.ts"
import { useAddPlaylistMutation } from "../api/use-add-playlist-mutation.ts"


import type {JsonApiErrorDocument} from "../../../../shared/utils/json-api-error.ts";
import {queryErrorHandlerForRHFFactory} from "../../../../shared/ui/utils/query-error-handler-for-rhf-factory.ts";

export const AddPlaylistForm = () => {
    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm<SchemaCreatePlaylistRequestPayload>({
        defaultValues: {
            data: {
                type: "playlists",
                attributes: {
                    title: "",
                    description: "",
                },
            },
        },
    })



    const { mutateAsync } = useAddPlaylistMutation()

    const onSubmit = async (data: SchemaCreatePlaylistRequestPayload) => {
        try {
            await mutateAsync(data)
            reset()
        } catch (error) {
            queryErrorHandlerForRHFFactory({ setError })(error as unknown as JsonApiErrorDocument)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h2>Add New Playlist</h2>
            <p>
                <input {...register("data.attributes.title")} />
            </p>
            {errors.data?.attributes?.title && <p>{errors.data?.attributes?.title.message}</p>}
            <p>
                <textarea {...register("data.attributes.description")}></textarea>
            </p>
            {errors.data?.attributes?.description && <p>{errors.data?.attributes?.description.message}</p>}

            <button type={"submit"}>Create</button>
            {errors.root?.server && <p>{errors.root?.server.message}</p>}
        </form>
    )
}