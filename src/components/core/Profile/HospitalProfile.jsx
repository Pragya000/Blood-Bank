import { useUser } from "../../../store/useUser"

export default function HospitalProfile() {

    const {user} = useUser()

    return (
        <div>
            <h1>Hospital Profile</h1>
            {user.isApproved ? (
                <p>Approved</p>
            ) : (
                <div>
                    <p>Profile Not Approved</p>
                    <p>Fill up your details and Request for approval !</p>
                </div>
            )}
        </div>
    )
}