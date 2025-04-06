import {
  Card,
  FileInput,
  Modal,
  Toast,
  DarkThemeToggle,
  Flowbite,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UserService from "../../utils/userService";
import LabelInput from "../Form/LabelInput";
import Button from "../Form/Button";
import { IoInformationCircleOutline } from "react-icons/io5";
import { FaCheck, FaCheckCircle } from "react-icons/fa";
import { CgDanger } from "react-icons/cg";
import { FiEdit } from "react-icons/fi";
import { PiPencilSimpleLineBold } from "react-icons/pi";
import { HiCheck } from "react-icons/hi2";

const userService = new UserService();

type ManageUserProfileProps = {
  userUpdated?: () => void;
};

const ManageUserProfile = (props: ManageUserProfileProps) => {
  const location = useLocation();
  const user = location.state.user;

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    picture: "",
  });
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [successFulUserToast, setSuccessFulUserToast] =
    useState<boolean>(false);
  const [showUpdateButton, setShowUpdateButton] = useState(true);
  const [cancelBTNFlag, setCancelBTNFlag] = useState(false);
  const [editable, setEditable] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    userService.getUserDataById(user.userId).then((data: any) => {
      setUserData(data);
    });
  }, [cancelBTNFlag]);

  setTimeout(() => {
    setSuccessFulUserToast(false);
  }, 3000);

  function handleOnChange(event: any): void {
    setUserData({ ...userData, [event.target.id]: event.target.value });
  }

  function handleUpdateUser(event: any): void {
    setShowUpdateButton(false);
    setShowSaveButton(true);
    setEditable(true);
  }

  function handleFileInput(event: any): void {
    if (event.target.files[0].size > 1000000) {
      setErrorMessage("File size is too large");
      return;
    }
    setErrorMessage("");
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setUserData({
        ...userData,
        [event.target.id]: reader.result,
      });
    });
    reader.readAsDataURL(event.target.files[0]);
  }

  async function handleSaveBTN(event: any): Promise<void> {
    event.preventDefault();
    console.log("Save button clicked");
    if (
      userData.firstName.match(/[^a-zA-Z\s]/) ||
      userData.lastName.match(/[^a-zA-Z\s]/)
    ) {
      setErrorMessage(
        "First Name and Last Name cannot contain numbers or symbols"
      );
      return;
    }

    if (errorMessage === "File size is too large") {
      return;
    }

    const data = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      picture: userData.picture,
    };

    await userService.updateUser(
      user.userId,
      data,
      user.salt,
      user.masterPassword
    );

    setSuccessFulUserToast(true);

    if (props.userUpdated) {
      props.userUpdated();
    }

    setShowSaveButton(false);
    setErrorMessage("");
    setEditable(false);
    setShowUpdateButton(true);
  }

  function handleCancelBTN(event: any): void {
    setCancelBTNFlag(!cancelBTNFlag);
    setShowSaveButton(false);
    setEditable(false);
    setShowUpdateButton(true);
  }

  return (
    <>
      <Card className="max-w-[30rem] mx-auto dark:bg-darkcards-999">
        <div className="flex flex-col">
          <div className="flex justify-end">
            <div>
              {showUpdateButton ? (
                <Button value="Update" type="submit" onClick={handleUpdateUser}>
                  {" "}
                  {/*RECHECK BUTTONS*/}
                  Update
                </Button>
              ) : (
                <Button value="Cancel" type="button" onClick={handleCancelBTN}>
                  Cancel
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center ">
            {editable ? (
              <label
                htmlFor="picture"
                className="relative cursor-pointer w-fit rounded-full hover:opacity-80 "
              >
                <div className="relative">
                  <img
                    alt="User Profile Picture"
                    src={userData.picture}
                    className="mb-3 rounded-full shadow-lg mx-auto w-36 h-36"
                  />
                  <div className="absolute left-24 bottom-3 right-50 rounded-full bg-black p-1">
                    <FiEdit className="text-white" />
                  </div>
                </div>
              </label>
            ) : (
              <div className="relative">
                <img
                  alt="User Profile Picture"
                  src={userData.picture}
                  className="mb-3 rounded-full shadow-lg mx-auto w-36 h-36"
                />
              </div>
            )}
          </div>
          <FileInput
            accept="image/jpeg, image/png, image/gif, image/svg+xml"
            id="picture"
            className="font-nunito hidden"
            onChange={handleFileInput}
          />
          <div className="mx-auto ">
            <h1 className="text-lg font-medium text-center text-gray-900 dark:text-darktext-999">
              {userData.firstName} {userData.lastName}
            </h1>
            <h5 className="text-xs font-medium text-center text-gray-500 dark:text-darktext-999">
              Date Created: {user.dateCreated.toString().slice(0, 10)}
            </h5>
          </div>

          <form onSubmit={handleSaveBTN}>
            <div className="mt-4 flex-row w-96 mx-auto">
              <LabelInput
                value={userData.firstName}
                onChange={handleOnChange}
                type="text"
                required={true}
                viewOnly={!editable}
                label="First Name"
                id="firstName"
              ></LabelInput>
              <LabelInput
                value={userData.lastName}
                onChange={handleOnChange}
                type="text"
                required={true}
                viewOnly={!editable}
                label="Last Name"
                id="lastName"
              ></LabelInput>
              <LabelInput
                value={userData.email}
                onChange={handleFileInput}
                type="text"
                viewOnly={true}
                label="Email"
                id="email"
              ></LabelInput>

              {editable && (
                <div>
                  <div className="mb-1 block mt-2"></div>
                  {/* <FileInput
                    accept="image/jpeg, image/png, image/gif, image/svg+xml"
                    id="picture"
                    className="font-nunito"
                    onChange={handleFileInput}
                  /> */}
                </div>
              )}
            </div>

            {errorMessage && (
              <div className="flex">
                <CgDanger className="w-4 h-5 text-red-500" />
                <p className="text-red-500 text-sm">&nbsp; {errorMessage}</p>
              </div>
            )}

            {showSaveButton && (
              <div className="w-96 mx-auto mt-4">
                <Button value="Save" type="submit">
                  Save
                </Button>
              </div>
            )}
          </form>
        </div>
      </Card>
      {successFulUserToast && (
        <Toast className="absolute inset-0 h-14 translate-x-[48rem] translate-y-[7.5rem] flex items-center justify-center">
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
            <FaCheck className="h-5 w-5" />
          </div>
          <div className="ml-3 text-sm font-normal">
            Account Updated Successfully
          </div>
          <Toast.Toggle />
        </Toast>
      )}
    </>
  );
};

export default ManageUserProfile;
