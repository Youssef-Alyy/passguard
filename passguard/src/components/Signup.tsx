import React, { useState } from "react";
import loginImg from "../assets/icons/common/appLogo.svg";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { checkEmail } from "../utils/authService";
import { useNavigate } from "react-router-dom";
import LabelInput from "./Form/LabelInput";
import Button from "./Form/Button";
import MPasswdStrength from "./MPasswdStrength";
import { FileInput, Tooltip } from "flowbite-react";
import { FcCheckmark } from "react-icons/fc";
import { HiXMark } from "react-icons/hi2";
import { CgDanger } from "react-icons/cg";
import { IoInformationCircleOutline } from "react-icons/io5";
import { CiCircleChevLeft } from "react-icons/ci";
import zxcvbn from "zxcvbn";

interface State {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  picture: string;
  showConfirmPassword: boolean;
}

interface PasswordState {
  upperCase: boolean;
  lowerCase: boolean;
  number: boolean;
  specialChar: boolean;
  length: boolean;
  repeatedChar: boolean;
  sequentialChar: boolean;
  contextSpecific: boolean;
  frequentPasswords: boolean;
}

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<number>(0);

  const [state, setState] = useState<State>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    picture: "",
    showConfirmPassword: false,
  });
  const [passwordState, setPasswordState] = useState<PasswordState>({
    upperCase: false,
    lowerCase: false,
    number: false,
    specialChar: false,
    length: false,
    repeatedChar: false,
    sequentialChar: false,
    contextSpecific: false,
    frequentPasswords: false,
  });

  function handleFileInput(event: any): void {
    if (event.target.files[0].size > 1000000) {
      setErrorMessage("File size is too large");
      return;
    }
    setErrorMessage("");

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setState({
        ...state,
        [event.target.id]: reader.result,
      });
    });
    reader.readAsDataURL(event.target.files[0]);
  }

  const toggleConfirmPasswordVisibility = () => {
    setState((prevState) => ({
      ...prevState,
      showConfirmPassword: !prevState.showConfirmPassword,
    }));
  };

  const handleSignUpClick = async (event: any) => {
    event.preventDefault();

    const lettersOnlyRegex = /^[A-Za-z\s]+$/;
    if (
      !lettersOnlyRegex.test(state.firstName) ||
      !lettersOnlyRegex.test(state.lastName)
    ) {
      setErrorMessage("First and Last Name must contain only letters.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(state.email)) {
      setErrorMessage("Invalid email format.");
      return;
    }

    if (state.password !== state.confirmPassword) {
      setErrorMessage("Passwords do not match.");
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

    if (errorMessage === "File size is too large") {
      return;
    }

    checkEmail(state.email).then((result) => {
      if (result) {
        setErrorMessage("Email already exists");
      } else {
        navigate("/otp", {
          state: {
            user: { state },
            fromSignup: true,
          },
        });
      }
    });
  };

  function handleLoginClick(): void {
    navigate("/login", { replace: true });
  }

  function handleOnPasswordChange(event: any): void {
    const newPassword = event.target.value;
    setState((prevState) => ({
      ...prevState,
      password: newPassword,
    }));

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

    if (state.firstName !== "") {
      if (newPassword.toLowerCase().includes(state.firstName.toLowerCase()))
        contextSpecific = true;
    }
    if (state.lastName !== "") {
      if (newPassword.toLowerCase().includes(state.lastName.toLowerCase()))
        contextSpecific = true;
    }
    if (state.email !== "") {
      if (newPassword.toLowerCase().includes(state.email.toLowerCase()))
        contextSpecific = true;
    }
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
      frequentPasswords: zxcvbnDictionary,
    });
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 h-screen w-full overflow-hidden">
      <div className="hidden sm:block">
        <img
          className="w-full h-full object-cover"
          src={loginImg}
          alt="Signup visual"
        />
      </div>
      <div className="bg-gray-100 flex flex-col justify-center dark:bg-darkbg-999">
        <form className="max-w-[400px] min-w-[450px] w-full mx-auto bg-white p-4 shadow-md dark:bg-darkcards-999">
          <CiCircleChevLeft
            className="w-8 h-8 hover:text-blue-500 cursor-pointer dark:text-darkbuttonblue-999 dark:hover:text-yellow-400"
            onClick={() => navigate("/login", {})}
          ></CiCircleChevLeft>
          <div className="flex items-center justify-center">
            <h2 className="text-4xl text-center py-2 font-bold font-nunito dark:text-darktext-999">
              📝 Sign
            </h2>
            <h2 className="text-4xl text-center py-2 font-bold font-nunito text-yellow-400">
              Up&nbsp;
            </h2>
          </div>

          {/* First Name Field */}
          <LabelInput
            required={true}
            type="text"
            value={state.firstName}
            label="First Name"
            id="firstName"
            placeholder=""
            onChange={(event) => {
              setState((prevState) => ({
                ...prevState,
                firstName: event.target.value,
              }));
            }}
          ></LabelInput>

          {/* Last Name Field */}
          <LabelInput
            required={true}
            type="text"
            value={state.lastName}
            label="Last Name"
            id="lastName"
            placeholder=""
            onChange={(event) => {
              setState((prevState) => ({
                ...prevState,
                lastName: event.target.value,
              }));
            }}
          ></LabelInput>

          {/* Email Field */}
          <LabelInput
            required={true}
            type="email"
            value={state.email}
            label="Email"
            id="email"
            placeholder=""
            onChange={(event) => {
              setState((prevState) => ({
                ...prevState,
                email: event.target.value,
              }));
            }}
          ></LabelInput>

          <div className="flex-row mt-2">
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
                          {!passwordState.frequentPasswords ? (
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
                    <span className="font-bold text-red-500">
                      Requirements:
                    </span>
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
                      A number
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
              <div className="w-[26.2rem]">
                <MPasswdStrength
                  contextSpecific={passwordState.contextSpecific}
                  sequentialChar={passwordState.sequentialChar}
                  repeatedChar={passwordState.repeatedChar}
                  required={true}
                  value={state.password}
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
              setState((prevState) => ({
                ...prevState,
                confirmPassword: event.target.value,
              }));
            }}
            required={true}
            type={state.showConfirmPassword ? "text" : "password"}
            value={state.confirmPassword}
            label="Confirm Password"
            id="confirmPassword"
            placeholder=""
          >
            <div className="">
              {state.showConfirmPassword ? (
                <Tooltip
                  content={"Hide"}
                  className="absolute -translate-x-[1.3rem]"
                >
                  <FiEyeOff
                    onClick={toggleConfirmPasswordVisibility}
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
                    onClick={toggleConfirmPasswordVisibility}
                    size="1.3em"
                    className="ml-1 text-black dark:text-darksubtext-999
              absolute translate-x-[24rem] top-[1.9rem]"
                  />
                </Tooltip>
              )}
            </div>
          </LabelInput>

          <div className="mb-1 block mt-5">
            <label
              htmlFor="picture"
              className="p-1 font-normal font-['Nunito'] dark:text-darksubtext-999
         text-gray-700 text-base peer-placeholder-shown:text-base
          peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 
          peer-focus: peer-focus:text-blue-600 transition-all"
            >
              Upload Profile Picture{" "}
              <span className="text-gray-500 ">(Optional)</span>
            </label>
          </div>
          <FileInput
            accept="image/jpeg, image/png, image/gif, image/svg+xml"
            id="picture"
            className="font-nunito"
            onChange={handleFileInput}
          />
          <div className="flex items-center">
            <IoInformationCircleOutline className="mt-[0.3rem] text-red-500 dark:text-darksubtext-999"></IoInformationCircleOutline>
            <p className="text-gray-500 text-sm mt-1  dark:text-darksubtext-999">
              Files allowed (jpg, jpeg, gif, png, svg), Max Size: 1MB
            </p>
          </div>

          {errorMessage && (
            <div className="flex mt-1">
              <CgDanger className="w-4 h-5 text-red-500" />
              <p className="text-red-500 text-sm">&nbsp; {errorMessage}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-7">
            <Button
              type="submit"
              onClick={handleSignUpClick}
              value="createAccount"
            >
              Continue
            </Button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-8 font-normal font-['Nunito'] dark:text-darksubtext-999">
            Already have an account?
            <a
              onClick={handleLoginClick}
              href="#"
              className="text-blue-500 text-sm hover:text-blue-700 ml-1 font-normal font-['Nunito'] "
            >
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
