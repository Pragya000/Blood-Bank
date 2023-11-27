import { useUser } from "../../../store/useUser"

export default function UserProfile() {

    const {user} = useUser()

    return (
        <div>
            <h1>User Profile</h1>
            {user.isApproved ? (
                <p>Approved</p>
            ) : (
                <div>
                    <p>Complete Your Profile To Continue</p>
                    <p>Fill up your details before you proceed !</p>
                </div>
            )}
        </div>
    )
}