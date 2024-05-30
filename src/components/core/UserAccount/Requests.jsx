import { useUser } from "../../../store/useUser"

export default function Requests() {

    const {user} = useUser()

    return (
        <>
        {user?.accountType} Requests
        </>
    )
}