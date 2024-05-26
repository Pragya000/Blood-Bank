import MyImage from "../components/common/MyImage";
import useCustomTitle from "../hooks/useCustomTitle";
import { useUser } from "../store/useUser";
import Logo from "../assets/logo.png";
import UserApprovedView from "../components/core/UserAccount/ApprovedView";
import UserUnApprovedView from "../components/core/UserAccount/UnApprovedView";
import HospitalUnApprovedView from "../components/core/HospitalAccount/UnApprovedView";
import HospitalApprovalPendingView from "../components/core/HospitalAccount/ApprovalPendingView";
import HospitalRejectedView from "../components/core/HospitalAccount/RejectedView";
import HospitalApprovedView from "../components/core/HospitalAccount/ApprovedView";
import AdminProfile from "../components/core/AdminAccount/AdminProfile";
import { useMemo } from "react";
import { useLogoutMutation } from "../services/mutations/auth";

export default function Profile() {
  const { user } = useUser();

  useCustomTitle("Blood Connect | Profile");

  const mutation = useLogoutMutation();
  

  const userview = useMemo(() => {
    const accountType = user?.accountType;
    const approvalStatus = user?.approvalStatus;

    if (accountType === 'User') {
      if (approvalStatus === 'Approved') {
        return <UserApprovedView />
      } else {
        return <UserUnApprovedView />
      }
    } else if (accountType === 'Hospital') {
      if (approvalStatus === 'Started') {
        return <HospitalUnApprovedView />
      } else if (approvalStatus === 'Pending') {
        return <HospitalApprovalPendingView />
      } else if (approvalStatus === 'Rejected') {
        return <HospitalRejectedView />
      } else if (approvalStatus === 'Approved') {
        return <HospitalApprovedView />
      } else {
        return null
      }
    } else if (accountType === 'Admin') {
      return <AdminProfile />
    } else {
      return null
    }
  }, [user?.approvalStatus, user?.accountType])

  return (
    <>
      {user?.accountType !== 'Admin' ?
        <div className="border border-b-gray-300 py-4">
          <div className="flex justify-between w-11/12 max-w-[1200px] mx-auto">
            <MyImage alt="Blood Connect" src={Logo} className="w-[160px]" />
            <button onClick={() => mutation.mutate()} className="bg-blue-500 text-white rounded-md px-4 py-2">
              Logout
            </button>
          </div>
        </div>
        : null}
      <div className={`${user?.accountType !== 'Admin' ? 'w-11/12 max-w-[1200px] mx-auto' : ''}`}>
        {userview}
      </div>
    </>
  );
}
