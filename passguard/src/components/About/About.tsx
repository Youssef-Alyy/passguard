import {
  Card,
  FileInput,
  Modal,
  Toast,
  DarkThemeToggle,
  Flowbite,
} from "flowbite-react";
import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { Label } from "flowbite-react";
import { GrCircleQuestion } from "react-icons/gr";
import { useLocation } from "react-router-dom";
import AutoRedirectHook from "../Inactivity/AutoRedirectHook";

type SettingsProps = {};

const Settings = (props: SettingsProps) => {
  useEffect(() => {
    window.history.pushState(null, "", "/login");
    window.onpopstate = function () {
      window.history.pushState(null, "", "/login");
    };
  }, []);

  const location = useLocation();

  const [expanded, setExpanded] = useState(location.state?.expanded);
  const { redirect, setRedirect } = AutoRedirectHook(
    JSON.parse(location.state.user.preference).lockDuration,
    undefined,
    expanded
  );

  return (
  <>
      {redirect}
    <div className="app-container h-screen dark:bg-darkbg-999">

        <div className="navbar">
          <Navbar
            isExpanded={expanded}
            handleExpand={(expanded) => setExpanded(expanded)}
          />
        </div>

        <div className="TopOfDocument border-b-2 dark:border-darkborder-999">
          
          <div className="p-2 m-3 TopOfDocument">
            <div className="flex">
              <Label
                value="About"
                className="flex p-1 text-xl font-medium mb-2 dark:text-darktext-999"
                color="dark"
              />
              <GrCircleQuestion className="h-5 w-5 mt-[0.45rem] dark:text-darktext-999" />
            </div>
          </div>
        </div>

        <div>
          {/* empty div to fit content */}
        </div>

        {/* <div className="flex flex-col gap-4 ">
          <div className="description col-span-2 ">
            <Card className="max-w-[30rem] mx-auto dark:bg-darkcards-999 ">
              
            <p className="font-bold text-xl">
              Description
            </p>
           

            <p>
              PassGuard is an offline desktop password manager that allows you to generate strong passwords, save them in a secure way, and 
              modify them anytime.
              In addition, a document locking feature is available
            </p>
            </Card>
          </div>

          <div className="values flex flex-grow gap-4">
          <Card className="max-w-[30rem] mx-auto dark:bg-darkcards-999 ">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-40 h-40 self-center">
           <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
        </svg>

            <p className="font-bold text-xl text-center">
              Confidentiality
            </p>
            <p className="text-center">
              PassGuard protects your confidentiality in multiple ways:
              <br></br>
              Offline Database: all of your passwords are saved on your device (offline), therefore requiring no internet connection to access them. <br></br>
              Only YOU can see them.<br></br>
              App locking: PassGuard gets automatically locked in case of inactivity to prevent suspiscious physical access to your account.
            </p>
            </Card>


            <Card className="max-w-[30rem] mx-auto dark:bg-darkcards-999 ">  
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-40 h-40 self-center">
  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
            <p className="font-bold text-xl text-center">
              Security
            </p>
            <p className="text-center">
              
              Encryption: All passwords are encrypted using AES-128 algorithm <br></br>
              Multi-Factor Authentication (MFA): all critical actions (logging in, changing password,...) requires an OTP sent either via email or SMS. 

            </p>
            </Card>
            
            
            <Card className="max-w-[30rem] mx-auto dark:bg-darkcards-999 ">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-40 h-40 self-center">
  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
            </svg>
            <p className="font-bold text-xl text-center">
              Simplicity
            </p>
            <p className="text-center">
              PassGuard uses a user-friendly UI, offering a better experience to the user
            </p>
            </Card>

          </div>
        </div> */}

    <div>
   <br></br>
   <br></br>


      <h2 className="m-2 font-bold text-lg dark:text-white">Description</h2>

      <div className="p-5  flex items-center justify-between  rounded-xl rounded-b-none bg-gray-100 border border-gray-200 shadow-md dark:border-darkborder-999 dark:bg-darkcards-999">
          <div className="flex flex-col">
            <span className="font-semibold pb-2 dark:text-darktext-999">
              
            </span>
            <span className="font-nunito text-gray-500 dark:text-darksubtext-999">
              <span className="font-semibold text-sm">
              PassGuard is an offline desktop password manager that allows you to generate strong passwords, save them in a secure way, and 
              modify them anytime.
              In addition, a document locking feature is available
              </span>
            </span>
          </div>
        </div>

        <br></br>

        <div>
          <h2 className="m-2 font-bold text-lg dark:text-white">Values</h2>

          <div className="p-5  flex items-center justify-between  rounded-xl rounded-b-none bg-gray-100 border border-gray-200 shadow-md dark:border-darkborder-999 dark:bg-darkcards-999">
            <div className="flex flex-col">
              <span className="font-semibold pb-2 dark:text-darktext-999">
              Confidentiality
              </span>
              <span className="font-nunito text-gray-500 dark:text-darksubtext-999">
                <span className="font-semibold text-sm">
                PassGuard protects your confidentiality through multiple features:
              <br></br>
              - Offline Database: all of your passwords are saved on your device (offline), therefore requiring no internet connection to access them. <br></br>
              Only YOU can see them.<br></br>
              - App locking: PassGuard gets automatically locked in case of inactivity to prevent suspiscious physical access to your account.<br></br>
            
                </span>
              </span>
            </div>
          </div>


          <div className="p-5  flex items-center justify-between  rounded-xl rounded-b-none bg-gray-100 border border-gray-200 shadow-md dark:border-darkborder-999 dark:bg-darkcards-999">
            <div className="flex flex-col">
              <span className="font-semibold pb-2 dark:text-darktext-999">
                Security
              </span>
              <span className="font-nunito text-gray-500 dark:text-darksubtext-999">
                <span className="font-semibold text-sm">
                - Encryption: All passwords are encrypted using AES-128 algorithm <br></br>
                - Multi-Factor Authentication (MFA): all critical actions (logging in, changing password,...) requires an OTP sent either via email or SMS. 
                </span>
              </span>
            </div>
          </div>


          <div className="p-5  flex items-center justify-between  rounded-xl rounded-b-none bg-gray-100 border border-gray-200 shadow-md dark:border-darkborder-999 dark:bg-darkcards-999">
            <div className="flex flex-col">
              <span className="font-semibold pb-2 dark:text-darktext-999">
                Simplicity
              </span>
              <span className="font-nunito text-gray-500 dark:text-darksubtext-999">
                <span className="font-semibold text-sm">
                PassGuard uses a user-friendly UI, following best recommendation fora better user experience.

                </span>
              </span>
              
            </div>
          </div>

          <br></br><br></br>

        </div>


      </div>

    </div>
  </>
  );
};

export default Settings;
