import { useUser } from "../../../store/useUser"

export default function Settings() {

    const {user} = useUser()

    return (
        <>
        {user?.accountType} Settings
        </>
    )
}