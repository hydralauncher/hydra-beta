import axios from "axios"
import Image from "next/image"
import { use } from "react"

export default function Profile({ params }: { params: { id: string } }) {
    const response = use(axios.get(`https://api-staging.hydralauncher.gg/users/${params.id}`))

    return <div>
        <Image src={response.data.profileImageUrl} alt={response.data.displayName} width={50} height={50} objectFit="cover" />
        <h1>{response.data.displayName}</h1>
    </div>
}