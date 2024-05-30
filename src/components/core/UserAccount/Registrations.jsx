import { useUser } from "../../../store/useUser"

export default function Registrations() {

    const {user} = useUser()

    return (
        <>
        {user?.accountType} Registrations
        </>
    )
}