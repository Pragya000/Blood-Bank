import { useUser } from "../../../store/useUser"

export default function BasicDetails() {

    const {user} = useUser()

    return (
        <>
        {user?.accountType} Basic Details
        </>
    )
}