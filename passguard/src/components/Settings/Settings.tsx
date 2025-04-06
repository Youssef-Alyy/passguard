import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { Label, Tabs, Modal, Toast } from "flowbite-react";
import { useLocation } from "react-router-dom";
import AutoRedirectHook from "../Inactivity/AutoRedirectHook";
import { HiUserCircle } from "react-icons/hi2";
import { PiPasswordFill } from "react-icons/pi";
import { GrStorage } from "react-icons/gr";
import ManagePassword from "./ManagePassword";
import Button from "../Form/Button";
import CredentialService from "../../utils/credentialService";
import DocumentService from "../../utils/documentService";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTrash } from "react-icons/fa";
import UserProfile from "./UserProfile";
import emailjs from "emailjs-com";
import { CiLock } from "react-icons/ci";
import Autolock from "./Autolock";
import OtpDropDown from "./OtpDropDown";
import TrashDuration from "./TrashDuration";
import SecurityQuestion from "../SecurityQuestion/SecurityQuestion";
import BackupPref from "./BackupPref";
import UserService from "../../utils/userService";
import ClipboardClr from "./ClipboardClr";

const userService = new UserService();

type SettingsProps = {
  userUpdated?: any;
};

const Settings = (props: SettingsProps) => {
  useEffect(() => {
    window.history.pushState(null, "", "/login");
    window.onpopstate = function () {
      window.history.pushState(null, "", "/login");
    };
  }, []);

  const location = useLocation();

  const [expanded, setExpanded] = useState(location.state?.expanded);
  const [secQuestionModal, setSecQuestionModal] = useState(false);
  const [credentialsExported, setCredentialsExported] = useState(false);
  const [userUpdatedFlag, setUserUpdatedFlag] = useState(false);
  const { redirect, setRedirect } = AutoRedirectHook(
    JSON.parse(location.state.user.preference).lockDuration,
    undefined,
    expanded
  );
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteOption, setDeleteOption] = useState("");
  const [userPasswordUpdated, setUserPasswordUpdated] = useState(false);
  const [openToast, setOpenToast] = useState<boolean>(false);

  useEffect(() => {
    if (
      location.state?.accountEmailChange ||
      location.state?.updatedUserPassword ||
      location.state?.wipeCredentials ||
      location.state?.wipeDocuments
    ) {
      setOpenToast(true);
      setTimeout(() => {
        setOpenToast(false);
      }, 3000);
    }
  }, []);

  const handleWipeAllCredentials = () => {
    setOpenDeleteModal(false);
    setSecQuestionModal(true);
  };

  const handleWipeAllDocuments = () => {
    setOpenDeleteModal(false);
    setSecQuestionModal(true);
  };

  const handleOpenModal = () => {
    setOpenDeleteModal(true);
    if (deleteOption === "wipeCredentials") {
      handleWipeAllCredentials();
    } else if (deleteOption === "wipeDocuments") {
      handleWipeAllDocuments();
    }
    setOpenDeleteModal(false);
  };

  const handleUserPasswordUpdated = () => {
    setUserPasswordUpdated(true);
    setOpenToast(true);
    setTimeout(() => {
      setOpenToast(false);
    }, 3000);
  };

  const handleSendEmail = async () => {
    const serviceID = "service_3ojecjd"; // Your service ID
    const templateID = "template_sgrb5ri"; // Your template ID
    const userID = "6igdyzCgketnFP148"; // Your user ID

    try {
      const fileContentBase64 = await userService.createBackupDB(
        location.state.user.userId
      );

      console.log("File content:", fileContentBase64);

      let userEmail;

      await userService
        .getUserDataById(location.state.user.userId)
        .then((res: any) => {
          userEmail = res.email;
        });

      //Send the email with the attachment
      await emailjs.send(
        serviceID,
        templateID,
        {
          to_email: userEmail, // with the recipient's email
          file_content: fileContentBase64, // Base64-encoded file content
        },
        userID
      );

      console.log("Email sent successfully!");
      // Here you can update the state or UI to reflect the success
    } catch (error) {
      console.error("Error sending email:", error);
      // Handle any errors, possibly updating the UI to notify the user
    }
  };

  return (
    <>
      {redirect}
      <div className="app-container h-screen dark:bg-darkbg-999 dark:text-darktext-999">
        <div className="navbar">
          <Navbar
            updatedUser={userUpdatedFlag}
            isExpanded={expanded}
            handleExpand={(expanded) => setExpanded(expanded)}
          />
        </div>

        <div className="TopOfDocument border-b-2 dark:border-darkborder-999">
          <div className="p-2 m-3 TopOfDocument">
            <div className="flex">
              <Label
                value=" ⚙ Settings"
                className="flex p-1 text-xl font-medium mb-2 dark:text-darktext-999"
                color="dark"
              />
            </div>
            <Tabs aria-label="Default tabs" style="default">
              <Tabs.Item title="Manage Profile" icon={HiUserCircle}>
                <UserProfile
                  userUpdated={() => setUserUpdatedFlag(!userUpdatedFlag)}
                ></UserProfile>
              </Tabs.Item>

              <Tabs.Item title="Security" icon={CiLock}>
                <div className={`overflow-y-auto max-h-[100vh] h-[100vh] `}>
                  <div className="pb-[10rem]">
                    <ManagePassword
                      userPasswordUpdated={handleUserPasswordUpdated}
                    ></ManagePassword>
                    <ClipboardClr></ClipboardClr>
                    <Autolock></Autolock>

                    <h2 className="m-2 font-bold text-lg">Preferences</h2>
                    <OtpDropDown></OtpDropDown>
                    <BackupPref></BackupPref>
                  </div>
                </div>
              </Tabs.Item>

              <Tabs.Item
                title="Manage Credentials"
                className=""
                icon={GrStorage}
              >
                <div className={`overflow-y-auto max-h-[100vh] h-[100vh] `}>
                  <div className="pb-[10rem]">
                    <h2 className="m-2 font-bold text-lg">Credentials</h2>
                    <TrashDuration></TrashDuration>
                    <div className="p-5  flex items-center justify-between  rounded-b-none bg-gray-100 border border-gray-200 shadow-md dark:border-darkborder-999 dark:bg-darkcards-999">
                      <div className="flex flex-col">
                        <span className="font-semibold pb-2 dark:text-darktext-999">
                          Remove All Credentials
                        </span>
                        <span className="font-nunito text-gray-500">
                          <span className="text-red-500 font-bold text-sm">
                            ⚠️ Warning:
                          </span>{" "}
                          <span className="font-semibold text-sm dark:text-darksubtext-999">
                            This action is irreversible.
                          </span>
                        </span>
                      </div>
                      <div className="min-w-[13rem]">
                        <Button
                          value="Add"
                          style="bg-black text-white hover:bg-yellow-400 w-[13rem] max-w-[13rem]"
                          onClick={() => {
                            setOpenDeleteModal(true);
                            setDeleteOption("wipeCredentials");
                          }}
                        >
                          Wipe All Credentials
                        </Button>
                      </div>
                    </div>
                    <div className="p-5 flex items-center justify-between  rounded-t-none rounded-b-xl bg-gray-100 border border-gray-200 shadow-md dark:border-darkborder-999 dark:bg-darkcards-999">
                      <div className="flex flex-col">
                        <span className="font-semibold pb-2 dark:text-darktext-999">
                          Export Your Data
                        </span>
                        <span className="font-nunito text-gray-500 dark:text-darksubtext-999">
                          <span className="font-semibold text-sm">
                            Send all your data to your email as an encrypted
                            file (This file can be imported back to Passguard's
                            login page at any time and to any desktop device).
                          </span>
                        </span>
                      </div>
                      <div className="min-w-[13rem]">
                        <Button
                          value="Add"
                          style="bg-black text-white hover:bg-yellow-400 w-[13rem] max-w-[13rem]"
                          onClick={() => {
                            handleSendEmail();
                          }}
                        >
                          Export All Data
                        </Button>
                      </div>
                    </div>
                    <h2 className="m-2 font-bold text-lg mt-6">Documents</h2>
                    <div className="p-5 flex items-center justify-between  rounded-xl bg-gray-100 border border-gray-200 shadow-md dark:border-darkborder-999 dark:bg-darkcards-999">
                      <div className="flex flex-col">
                        <span className="font-semibold pb-2 dark:text-darktext-999">
                          Remove All Documents
                        </span>
                        <span className="font-nunito text-gray-500">
                          <span className="text-red-500 text-sm font-bold">
                            ⚠️ Warning:
                          </span>{" "}
                          <span className="font-semibold text-sm dark:text-darksubtext-999">
                            This action is irreversible.
                          </span>
                        </span>
                      </div>
                      <div className="min-w-[13rem]">
                        <Button
                          value="Add"
                          style="bg-black text-white hover:bg-yellow-400 w-[13rem] max-w-[13rem]"
                          onClick={() => {
                            setOpenDeleteModal(true);
                            setDeleteOption("wipeDocuments");
                          }}
                        >
                          Wipe All Documents
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Tabs.Item>
            </Tabs>

            {openToast && (
              <Toast className="absolute inset-0 h-14 translate-x-[48rem] translate-y-[7.5rem] flex items-center justify-center">
                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                  <FaCheck className="h-5 w-5" />
                </div>
                <div className="ml-3 text-sm font-normal">
                  {userPasswordUpdated
                    ? "Password updated Successfully"
                    : location.state?.wipeCredentials
                      ? "Credentials deleted Successfully"
                      : location.state?.accountEmailChange
                        ? "Email updated Successfully"
                        : location.state?.wipeDocuments
                          ? "Documents deleted Successfully"
                          : credentialsExported
                            ? "Data exported Successfully via email"
                            : ""}
                </div>
                <Toast.Toggle />
              </Toast>
            )}
          </div>
        </div>
      </div>
      <Modal
        show={openDeleteModal}
        size="md"
        onClose={() => {
          setOpenDeleteModal(false);
          setDeleteOption("");
          setUserPasswordUpdated(false);
          setUserPasswordUpdated(false);
        }}
        popup
        dismissible
        className="dark:bg-darkcards-999"
      >
        <Modal.Header className="dark:bg-darkcards-999" />
        <Modal.Body className="dark:bg-darkcards-999">
          {" "}
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-red-500  dark:text-red-500" />
            <h3 className="mb-5 text-lg font-nunito text-gray-500 dark:text-gray-400">
              {deleteOption === "wipeCredentials"
                ? "Are you sure you want to permanently delete all credentials?"
                : "Are you sure you want to permanently delete all documents?"}
            </h3>
            <div className="flex justify-center gap-4">
              <Button value="Cancel" onClick={() => setOpenDeleteModal(false)}>
                No, cancel
              </Button>
              <Button value="confirmsignout" onClick={handleOpenModal}>
                Delete
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {secQuestionModal && (
        <SecurityQuestion
          fromLoc={
            deleteOption === "wipeCredentials"
              ? "wipeCredentials"
              : "wipeDocuments"
          }
          openModal={true}
          closeModal={() => setSecQuestionModal(false)}
        />
      )}
    </>
  );
};

export default Settings;
