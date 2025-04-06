import { useState } from "react";
import { Modal, Tooltip } from "flowbite-react";
import Button from "../Form/Button";
import LabelInput from "../Form/LabelInput";
import { FcCheckmark } from "react-icons/fc";
import { HiXMark } from "react-icons/hi2";
import { IoInformationCircleOutline } from "react-icons/io5";
import MPasswdStrength from "../MPasswdStrength";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import UserService from "../../utils/userService";
import { unlock } from "../../utils/authService";
import { CgDanger } from "react-icons/cg";
import zxcvbn from "zxcvbn";

const userService = new UserService();

interface PasswordState {
  upperCase: boolean;
  lowerCase: boolean;
  number: boolean;
  specialChar: boolean;
  length: boolean;
  repeatedChar: boolean;
  sequentialChar: boolean;
  contextSpecific: boolean;
  frequentPassword: boolean;
}

type ManageUserProfileProps = {
  userPasswordUpdated?: () => void;
};

const ManagePassword = (props: ManageUserProfileProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state.user;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrentPass, setshowCurrentPass] = useState(false);
  const [showConfirmNewPass, setshowConfirmNewPass] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const [passwordState, setPasswordState] = useState<PasswordState>({
    upperCase: false,
    lowerCase: false,
    number: false,
    specialChar: false,
    length: false,
    repeatedChar: false,
    sequentialChar: false,
    contextSpecific: false,
    frequentPassword: false,
  });

  const closeModal = () => {
    setIsModalOpen(false);
    setshowConfirmNewPass(false);
    setshowCurrentPass(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (!(await unlock(currentPassword, user.userId))) {
      setErrorMessage("Current password is incorrect");
      return;
    }

    if (await unlock(newPassword, user.userId)) {
      setErrorMessage("New password is like the current password");
      return;
    }

    if (
      !passwordState.upperCase ||
      !passwordState.lowerCase ||
      !passwordState.number ||
      !passwordState.specialChar ||
      !passwordState.length
    ) {
      setErrorMessage("Password does not meet the requirements.");
      return;
    }

    const updatedUser: any = await userService.updateUserMasterPassword(
      user.userId,
      user.salt,
      newPassword
    );

    navigate("/settings", { state: { user: updatedUser, expanded: true } });

    if (props.userPasswordUpdated) {
      props.userPasswordUpdated();
    }

    closeModal();
  };

  async function handleOnPasswordChange(event: any): Promise<void> {
    setNewPassword(event.target.value);
    const newPassword = event.target.value;

    const upperCaseRegex = /[A-Z]/;
    const lowerCaseRegex = /[a-z]/;
    const numberRegex = /[0-9]/;
    const specialCharRegex = /[!@#$%^&*]/;

    const upperCase = upperCaseRegex.test(newPassword);
    const lowerCase = lowerCaseRegex.test(newPassword);
    const number = numberRegex.test(newPassword);
    const specialChar = specialCharRegex.test(newPassword);
    const length = newPassword.length >= 8;
    const repeatedChar = /(.)\1{2,}/.test(newPassword);

    let zxcvbnDictionary: boolean = false;
    const patternArr = zxcvbn(newPassword).sequence;
    for (const index in patternArr) {
      if (
        (patternArr[index].pattern === "dictionary" ||
          patternArr[index].pattern === "bruteforce" ||
          patternArr[index].guesses_log10 < 12) &&
        newPassword.length > 4
      ) {
        console.log(patternArr[index]);
        zxcvbnDictionary = true;
      }
    }

    let sequentialChar = false;
    let contextSpecific = false;

    for (let i = 0; i < newPassword.length - 2; i++) {
      if (
        newPassword.charCodeAt(i) === newPassword.charCodeAt(i + 1) - 1 &&
        newPassword.charCodeAt(i) === newPassword.charCodeAt(i + 2) - 2
      ) {
        sequentialChar = true;
      }
    }

    await userService
      .getUserDataById(location.state.user.userId)
      .then((data: any) => {
        if (data.firstName !== "") {
          if (newPassword.toLowerCase().includes(data.firstName.toLowerCase()))
            contextSpecific = true;
        }
        if (data.lastName !== "") {
          if (newPassword.toLowerCase().includes(data.lastName.toLowerCase()))
            contextSpecific = true;
        }
        if (data.email !== "") {
          if (newPassword.toLowerCase().includes(data.email.toLowerCase()))
            contextSpecific = true;
        }
      });

    if (newPassword.toLowerCase().includes("passguard")) contextSpecific = true;

    setPasswordStrength(
      (upperCase && lowerCase ? 1 : 0) +
        (number ? 1 : 0) +
        (specialChar ? 1 : 0) +
        (length ? 1 : 0)
    );

    setPasswordState({
      upperCase,
      lowerCase,
      number,
      specialChar,
      length,
      repeatedChar,
      sequentialChar,
      contextSpecific,
      frequentPassword: zxcvbnDictionary,
    });
  }

  return (
    <>
      <h2 className="m-2 font-bold text-lg dark:text-darktext-999">Security</h2>
      <div className="p-5 flex items-center justify-between rounded-b-none rounded-xl bg-gray-100 border border-gray-200 shadow-md dark:border-darkborder-999 dark:bg-darkcards-999">
        <div className="flex flex-col">
          <span className="font-semibold pb-2 dark:text-darktext-999">
            Change Master Password
          </span>
          <span className="font-nunito text-gray-500 dark:text-darksubtext-999">
            <span className="font-semibold text-sm ">
              Use this feature to change the main password used to access your
              account.
            </span>
          </span>
        </div>

        <div className="min-w-[13rem]">
          <Button
            value="Add"
            style="bg-black text-white hover:bg-yellow-400 max-w-[13rem] w-[13rem]"
            onClick={() => setIsModalOpen(true)}
          >
            Change Master Password
          </Button>
        </div>
      </div>

      <Modal
        show={isModalOpen}
        onClose={closeModal}
        size="xl"
        dismissible
        className="dark:bg-darkcards-999"
      >
        <Modal.Body className="dark:bg-darkcards-999">
          <form
            className="w-[28rem] mx-auto p-4 border-gray-300 dark:border-darkborder-999 "
            onSubmit={handleSubmit}
          >
            <h2 className="text-2xl font-nunito font-bold border-b-4 p-2 mb-4 dark:text-darktext-999 dark:border-darkborder-999">
              🔑 Setup New Password
            </h2>
            <LabelInput
              type={showCurrentPass ? "text" : "password"}
              required={true}
              value={currentPassword}
              label="Current Password"
              id="new-password"
              placeholder="Enter New Password"
              onChange={(e) => {
                setCurrentPassword(e.target.value);
              }}
            >
              <div className="">
                {showCurrentPass ? (
                  <Tooltip
                    content={"Hide"}
                    className="absolute -translate-x-[1.3rem]"
                  >
                    <FiEyeOff
                      onClick={(e: any) => {
                        e.preventDefault();
                        setshowCurrentPass(!showCurrentPass);
                      }}
                      size="1.3em"
                      className="ml-1 text-black dark:text-darksubtext-999
				 absolute translate-x-[24rem] top-[1.9rem]"
                    />
                  </Tooltip>
                ) : (
                  <Tooltip
                    content={"Show"}
                    className="absolute -translate-x-[1.3rem]"
                  >
                    <FiEye
                      onClick={(e: any) => {
                        e.preventDefault();
                        setshowCurrentPass(!showCurrentPass);
                      }}
                      size="1.3em"
                      className="ml-1 text-black dark:text-darksubtext-999
              absolute translate-x-[24rem] top-[1.9rem]"
                    />
                  </Tooltip>
                )}
              </div>
            </LabelInput>

            <div className="flex-row mt-2 ">
              <div className="ml-[25rem]">
                <Tooltip
                  content={
                    <>
                      <div className="">
                        <ul>
                          <li className="font-bold">
                            <span className="text-green-400">Suggestions:</span>{" "}
                            To Achieve a Stronger Password
                          </li>
                          <li className="mb-1 flex items-center">
                            {!passwordState.sequentialChar ? (
                              <FcCheckmark className="me-2 h-5 w-5 text-green-400 dark:text-green-500" />
                            ) : (
                              <HiXMark className="me-2 h-5 w-5 text-gray-300 dark:text-gray-400" />
                            )}
                            No Sequential Characters (e.g. 123)
                          </li>
                          <li className="mb-1 flex items-center">
                            {!passwordState.repeatedChar ? (
                              <FcCheckmark className="me-2 h-5 w-5 text-green-400 dark:text-green-500" />
                            ) : (
                              <HiXMark className="me-2 h-5 w-5 text-gray-300 dark:text-gray-400" />
                            )}
                            No Repeated Characters (e.g. aaa)
                          </li>
                          <li className="mb-1 flex items-center">
                            {!passwordState.contextSpecific ? (
                              <FcCheckmark className="me-2 h-5 w-5 text-green-400 dark:text-green-500" />
                            ) : (
                              <HiXMark className="me-2 h-5 w-5 text-gray-300 dark:text-gray-400" />
                            )}
                            No Context Specific Characters (e.g. service name,
                            username)
                          </li>
                          <li className="mb-1 flex items-center">
                            {!passwordState.frequentPassword ? (
                              <FcCheckmark className="me-2 h-5 w-5 text-green-400 dark:text-green-500" />
                            ) : (
                              <HiXMark className="me-2 h-5 w-5 text-gray-300 dark:text-gray-400" />
                            )}
                            No Common Phrases or Easily Guessable Words (e.g.
                            names)
                          </li>
                        </ul>
                      </div>
                    </>
                  }
                  arrow={false}
                  placement="top-end"
                >
                  <IoInformationCircleOutline className="text-black mb-1 dark:text-darksubtext-999"></IoInformationCircleOutline>
                </Tooltip>
              </div>

              <Tooltip
                placement="bottom"
                content={
                  <div className="">
                    <ul>
                      <li className="mb-1 flex items-center">
                        {passwordState.upperCase && passwordState.lowerCase ? (
                          <FcCheckmark className="me-2 h-5 w-5 text-green-400 dark:text-green-500" />
                        ) : (
                          <HiXMark className="me-2 h-5 w-5 text-gray-300 dark:text-gray-400" />
                        )}
                        Upper & lower case letters
                      </li>
                      <li className="mb-1 flex items-center">
                        {passwordState.specialChar ? (
                          <FcCheckmark className="me-2 h-5 w-5 text-green-400 dark:text-green-500" />
                        ) : (
                          <HiXMark className="me-2 h-5 w-5 text-gray-300 dark:text-gray-400" />
                        )}
                        A symbol (e.g. #$&)
                      </li>
                      <li className="flex items-center">
                        {passwordState.number ? (
                          <FcCheckmark className="me-2 h-5 w-5 text-green-400 dark:text-green-500" />
                        ) : (
                          <HiXMark className="me-2 h-5 w-5 text-gray-300 dark:text-gray-400" />
                        )}
                        A number (e.g. 123)
                      </li>
                      <li className="mt-1 flex items-center">
                        {passwordState.length ? (
                          <FcCheckmark className="me-2 h-5 w-5 text-green-400 dark:text-green-500" />
                        ) : (
                          <HiXMark className="me-2 h-5 w-5 text-gray-300 dark:text-gray-400" />
                        )}
                        A longer password (min. 8 chars.)
                      </li>
                    </ul>
                  </div>
                }
              >
                {/* Password Field */}
                <div className="w-[25.9rem]">
                  <MPasswdStrength
                    contextSpecific={passwordState.contextSpecific}
                    sequentialChar={passwordState.sequentialChar}
                    repeatedChar={passwordState.repeatedChar}
                    required={true}
                    value={newPassword}
                    strength={passwordStrength}
                    label="Password"
                    id="password"
                    placeholder=""
                    onChange={handleOnPasswordChange}
                  ></MPasswdStrength>
                </div>
              </Tooltip>
            </div>

            {/* Confirm Password Field */}
            <LabelInput
              onChange={(event) => {
                setConfirmNewPassword(event.target.value);
              }}
              required={true}
              type={showConfirmNewPass ? "text" : "password"}
              value={confirmNewPassword}
              label="Confirm Password"
              id="confirmPassword"
              placeholder=""
            >
              <div className="">
                {showConfirmNewPass ? (
                  <Tooltip
                    content={"Hide"}
                    className="absolute -translate-x-[1.3rem]"
                  >
                    <FiEyeOff
                      onClick={(e: any) => {
                        e.preventDefault();
                        setshowConfirmNewPass(!showConfirmNewPass);
                      }}
                      size="1.3em"
                      className="ml-1 text-black dark:text-darksubtext-999
				 absolute translate-x-[24rem] top-[1.9rem]"
                    />
                  </Tooltip>
                ) : (
                  <Tooltip
                    content={"Show"}
                    className="absolute -translate-x-[1.3rem]"
                  >
                    <FiEye
                      onClick={(e: any) => {
                        e.preventDefault();
                        setshowConfirmNewPass(!showConfirmNewPass);
                      }}
                      size="1.3em"
                      className="ml-1 text-black dark:text-darksubtext-999
              absolute translate-x-[24rem] top-[1.9rem]"
                    />
                  </Tooltip>
                )}
              </div>
            </LabelInput>

            {errorMessage && (
              <div className="flex mt-1">
                <CgDanger className="w-4 h-5 text-red-500" />
                <p className="text-red-500 text-sm">&nbsp; {errorMessage}</p>
              </div>
            )}

            <div className="mt-5">
              <Button value="Update" type="submit">
                Update Password
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ManagePassword;
