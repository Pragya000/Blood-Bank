/* eslint-disable react/prop-types */
import { Link, Navigate, useLocation } from "react-router-dom";
import { useUser } from "../../../store/useUser";
import MyImage from "../MyImage";
import Logo from "../../../assets/logo.png";
import { useLogoutMutation } from "../../../services/mutations/auth";
import { IoIosMenu, IoMdClose } from "react-icons/io";
import React, { useState } from "react";

export default function PrivateRoute({children}) {
  const { isAuth, accountType, approvalStatus } = useUser();
  const { user } = useUser();
  const mutation = useLogoutMutation();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navbarLinks = [
    { to: "/feed", title: "Feed" },
    { to: "/find-donors", title: "Find Donors" },
    { to: "/find-hospitals", title: "Find Hospitals" },
    { to: "/profile", title: "My Profile", subLinks: [
      { to: "/profile/basic-details", title: "Basic Details" },
      { to: "/profile/requests", title: "Requests" },
      { to: "/profile/registrations", title: "Registrations" },
      { to: "/profile/certificates", title: "Certificates", accountType: 'User' },
      { to: "/profile/reviews", title: "Reviews", accountType: 'Hospital'},
      { to: "/profile/settings", title: "Settings" },
    ] },
  ];

  const renderSidebar = () => {
    return (
      <div className="w-[270px] bg-white flex flex-col h-full border-r-2">
        <div className="flex item-center">
          <button onClick={toggleSidebar} className="md:hidden px-2">
            {isSidebarOpen ? <IoMdClose size={30} /> : <IoIosMenu size={30} />}
          </button>
          <MyImage
            alt="Blood Connect"
            src={Logo}
            className="w-[160px] p-2 py-4"
          />
        </div>
        <div className="flex-1 flex flex-col">
          {navbarLinks.map((link, index) => {
            return (
              <React.Fragment key={index}>
              <Link
                to={link.to}
                onClick={() => {
                  setIsSidebarOpen(false);
                }}
                className={`px-4 py-2 border-t-2 ${index === navbarLinks?.length - 1 ? "border-b-2" : ""
                  } ${location.pathname === link.to ? "bg-gray-200" : ""}`}
              >
                {link.title}
              </Link>
              {link?.subLinks && link.subLinks?.length > 0 ?
                link.subLinks.map((subLink, subIndex) => {
                  if(subLink.accountType && subLink.accountType !== accountType) {
                    return null
                  }

                  return (<Link
                    key={subIndex}
                    to={subLink.to}
                    onClick={() => {
                      setIsSidebarOpen(false);
                    }}
                    className={`px-8 py-2 text-sm ${subIndex !== 0 ? 'border-t-2' : ''} ${subIndex === link.subLinks?.length - 1 ? "border-b-2" : ""
                      } ${location.pathname === subLink.to ? "bg-gray-200" : ""}`}
                  >
                    {subLink.title}
                  </Link>)
          })
               : null}
              </React.Fragment>
            );
          })}
        </div>
        <div className="p-2 py-4">
          <button
            onClick={() => mutation.mutate()}
            className="bg-blue-500 text-white rounded-md px-4 py-2"
          >
            Logout
          </button>
        </div>
      </div>
    );
  };

  if (isAuth) {

    // Admin should not be able to access the profile page
    if(accountType === 'Admin') {
      return <Navigate to="/admin/home" />;
    }

    // Hospital should not be able to access the certificates page
    if(accountType === 'Hospital' && location.pathname?.split('/')?.[2] === 'certificates') {
      return <Navigate to="/profile" />;
    }

    // User should not be able to access the reviews page
    if(accountType === 'User' && location.pathname?.split('/')?.[2] === 'reviews') {
      return <Navigate to="/profile" />;
    }

    if(location.pathname === '/profile') {
      if(approvalStatus === 'Approved') {
        return <Navigate to="/profile/basic-details" />;
      }
    } else {
      if(approvalStatus !== 'Approved') {
        return <Navigate to="/profile" />;
      }
    }

    return (
      <div>
          <>
            <div className="border border-b-gray-300 py-4 fixed top-0 inset-x-0 bg-white z-[100]">
              <div className="flex justify-between w-11/12 max-w-[1200px] mx-auto">
                <div className="flex items-center gap-2">
                  {user?.approvalStatus === 'Approved' ?
                    <button onClick={toggleSidebar} className="md:hidden px-2">
                    {isSidebarOpen ? (
                      <IoMdClose size={30} />
                    ) : (
                      <IoIosMenu size={30} />
                    )}
                  </button> : null}
                  <MyImage
                    alt="Blood Connect"
                    src={Logo}
                    className="w-[160px]"
                  />
                </div>
                {
                  user?.approvalStatus === 'Approved' ?
                  <div className="md:flex items-center gap-6 hidden">
                  {navbarLinks.map((link, index) => (
                    <Link
                      key={index}
                      to={link.to}
                      className={`${
                        ('/'+location.pathname.split('/')?.[1]) === link.to
                          ? "text-blue-500 border-b-2 border-blue-500 font-semibold"
                          : ""
                      }`}
                    >
                      {link.title}
                    </Link>
                  ))}
                  </div> : null
                }
                <button
                  onClick={() => mutation.mutate()}
                  className="bg-blue-500 text-white rounded-md px-4 py-2"
                >
                  Logout
                </button>
              </div>
            </div>
            {isSidebarOpen ? (
              <div className="fixed top-0 left-0 z-[100] h-screen md:hidden">
                {renderSidebar()}
              </div>
            ) : null}
          </>
        <div className={'mt-[84px]'}>
          {children}
        </div>
      </div>
    );
  } else {
    return <Navigate to="/login" />;
  }

  // return (
  //   <Route
  //     {...rest}
  //     render={(props) =>
  //       isAuth ? (
  //         <>
  //           {accountType === 'Admin' ? <Navigate to="/admin/home" /> : approvalStatus !== 'Approved' ? <Navigate to="/profile" /> : <div>
  //             <>
  //               <div className="border border-b-gray-300 py-4 fixed top-0 inset-x-0 bg-white z-[100]">
  //                 <div className="flex justify-between w-11/12 max-w-[1200px] mx-auto">
  //                   <div className="flex items-center gap-2">
  //                     {user?.approvalStatus === 'Approved' ?
  //                       <button onClick={toggleSidebar} className="md:hidden px-2">
  //                         {isSidebarOpen ? (
  //                           <IoMdClose size={30} />
  //                         ) : (
  //                           <IoIosMenu size={30} />
  //                         )}
  //                       </button> : null}
  //                     <MyImage
  //                       alt="Blood Connect"
  //                       src={Logo}
  //                       className="w-[160px]"
  //                     />
  //                   </div>
  //                   {
  //                     user?.approvalStatus === 'Approved' ?
  //                       <div className="md:flex items-center gap-6 hidden">
  //                         {navbarLinks.map((link, index) => (
  //                           <Link
  //                             key={index}
  //                             to={link.to}
  //                             className={`${('/' + location.pathname.split('/')?.[1]) === link.to
  //                                 ? "text-blue-500 border-b-2 border-blue-500 font-semibold"
  //                                 : ""
  //                               }`}
  //                           >
  //                             {link.title}
  //                           </Link>
  //                         ))}
  //                       </div> : null
  //                   }
  //                   <button
  //                     onClick={() => mutation.mutate()}
  //                     className="bg-blue-500 text-white rounded-md px-4 py-2"
  //                   >
  //                     Logout
  //                   </button>
  //                 </div>
  //               </div>
  //               {isSidebarOpen ? (
  //                 <div className="fixed top-0 left-0 z-[100] h-screen">
  //                   {renderSidebar()}
  //                 </div>
  //               ) : null}
  //             </>
  //             <div className={'mt-[84px] py-5'}>
  //               <Component {...props} />
  //             </div>
  //           </div>}

  //         </>
  //       ) : (
  //         <Navigate to="/login" />
  //       )
  //     }
  //   />
  // )
}