import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../Form/Button";
import { SignUp, unlock } from "../../utils/authService";
import { Modal, ModalHeader, Tooltip } from "flowbite-react";
import { AiTwotoneMail } from "react-icons/ai";
import LabelInput from "../Form/LabelInput";
import UserService from "../../utils/userService";
import { CgDanger } from "react-icons/cg";
import { FiEye, FiEyeOff } from "react-icons/fi";

const userService = new UserService();

type SecurityQuestionProps = {
  openModal: any;
  closeModal?: () => void;
  fromLoc?: string;
  isDismissable?: boolean;
  secQuestionsVerified?: () => void;
};

const SecurityQuestion = (props: SecurityQuestionProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state.user;

  const [openSuccessModal] = useState<boolean>(props.openModal);
  const [showSecQuestion, setShowSecQuestion] = useState<boolean>(true);
  const [showNewEmail, setShowNewEmail] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>("");
  const [firstQuestion, setFirstQuestion] = useState<string>(
    "Name of a college you applied to but didn’t attend?"
  );
  const [secondQuestion, setSecondQuestion] = useState<string>(
    "What was your maths teacher's surname in your 8th year of school?"
  );
  const [firstQuestionAnswer, setFirstQuestionAnswer] = useState<string>();
  const [secondQuestionAnswer, setSecondQuestionAnswer] = useState<string>("");
  const [email, setEmail] = useState("");
  const [isSecurityQuestionChecked, setIsSecurityQuestionChecked] =
    useState(true);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    window.history.pushState(null, "", "/login");
    window.onpopstate = function () {
      window.history.pushState(null, "", "/login");
    };
    if (!location.pathname.includes("/otp")) {
      userService.findSecurityQuestionByUserId(user.userId).then((res: any) => {
        if (res) {
          const data = JSON.parse(res.data);
          setFirstQuestion(data.firstQuestion);
          setSecondQuestion(data.secondQuestion);
        }
      });
    }
  }, [location.pathname, user.userId]);

  async function verifySecQuestionAnswers() {
    const isVerified = await userService.verifySecQuestionAnswers(
      user.userId,
      firstQuestionAnswer?.toLowerCase(),
      secondQuestionAnswer.toLowerCase()
    );
    return isVerified;
  }

  async function handleOnClick(event: any): Promise<void> {
    event.preventDefault();
    if (isSecurityQuestionChecked) {
      let isVerified = null;
      if (!(props.fromLoc === "signUp")) {
        isVerified = await verifySecQuestionAnswers();
      }
      if (
        props.fromLoc === "forgetPassEmailOTP" ||
        props.fromLoc === "forgetPassSMSOTP"
      ) {
        if (isVerified) {
          navigate("/new-password", { state: { user, fromForgetPass: true } });
        }
      } else if (props.fromLoc === "wipeAccount") {
        verifySecQuestionAnswers();
        console.log(JSON.parse(user.preference).forgetPassOtp);
        if (isVerified) {
          if (JSON.parse(user.preference).forgetPassOtp === "email") {
            navigate("/otp", { state: { user, wipeAccount: true } });
          } else {
            navigate("/sms", { state: { user, wipeAccount: true } });
          }
        }
      } else if (props.fromLoc === "wipeCredentials") {
        verifySecQuestionAnswers();
        console.log(JSON.parse(user.preference).forgetPassOtp);
        if (isVerified) {
          if (JSON.parse(user.preference).forgetPassOtp === "email") {
            navigate("/otp", { state: { user, wipeCredentials: true } });
          } else {
            navigate("/sms", { state: { user, wipeCredentials: true } });
          }
        }
      } else if (props.fromLoc === "wipeDocuments") {
        verifySecQuestionAnswers();
        console.log(JSON.parse(user.preference).forgetPassOtp);
        if (isVerified) {
          if (JSON.parse(user.preference).forgetPassOtp === "email") {
            navigate("/otp", { state: { user, wipeDocuments: true } });
          } else {
            navigate("/sms", { state: { user, wipeDocuments: true } });
          }
        }
      } else if (props.fromLoc === "shareCredential") {
        verifySecQuestionAnswers();
        if (isVerified) {
          console.log("Share Credential Verified");
          if (props.secQuestionsVerified) {
            props.secQuestionsVerified();
          }
        }
      } else if (
        location.pathname === "/otp" &&
        firstQuestionAnswer &&
        secondQuestionAnswer
      ) {
        console.log("from OTP");
        const signUpResult = await SignUp({
          firstName: user.state.firstName,
          lastName: user.state.lastName,
          email: user.state.email,
          masterPassword: user.state.password,
          confirmPassword: user.state.confirmPassword,
          picture: user.state.picture,
        });
        if (signUpResult) {
          const secQuestionObj = {
            firstQuestion: firstQuestion,
            firstQuestionAnswer: firstQuestionAnswer?.toLowerCase(),
            secondQuestion: secondQuestion,
            secondQuestionAnswer: secondQuestionAnswer.toLowerCase(),
          };
          await userService.createQuestion(
            signUpResult.userId,
            signUpResult.salt,
            secQuestionObj
          );
        } else {
          console.log("Sign up failed");
        }
        navigate("/login", { state: { fromSecurityQuestion: true } });
      }

      if (props.fromLoc === "changeEmail") {
        verifySecQuestionAnswers();
        if (isVerified) {
          setShowSecQuestion(false);
          setShowNewEmail(true);
        }
      }

      setErrorMessage("Incorrect answers. Please try again.");
    } else {
      const isVerified = await unlock(password, user.userId);
      if (isVerified) {
        if (props.fromLoc === "wipeAccount") {
          console.log(JSON.parse(user.preference).forgetPassOtp);
          if (isVerified) {
            if (JSON.parse(user.preference).forgetPassOtp === "email") {
              navigate("/otp", { state: { user, wipeAccount: true } });
            } else {
              navigate("/sms", { state: { user, wipeAccount: true } });
            }
          }
        } else if (props.fromLoc === "wipeCredentials") {
          console.log(JSON.parse(user.preference).forgetPassOtp);
          if (isVerified) {
            if (JSON.parse(user.preference).forgetPassOtp === "email") {
              navigate("/otp", { state: { user, wipeCredentials: true } });
            } else {
              navigate("/sms", { state: { user, wipeCredentials: true } });
            }
          }
        } else if (props.fromLoc === "wipeDocuments") {
          console.log(JSON.parse(user.preference).forgetPassOtp);
          if (isVerified) {
            if (JSON.parse(user.preference).forgetPassOtp === "email") {
              navigate("/otp", { state: { user, wipeDocuments: true } });
            } else {
              navigate("/sms", { state: { user, wipeDocuments: true } });
            }
          }
        } else if (props.fromLoc === "shareCredential") {
          if (isVerified) {
            console.log("Share Credential Verified");
            if (props.secQuestionsVerified) {
              props.secQuestionsVerified();
            }
          }
        } else if (props.fromLoc === "changeEmail") {
          if (isVerified) {
            setShowSecQuestion(false);
            setShowNewEmail(true);
          }
        }
      } else {
        setErrorMessage("Incorrect master password. Please try again.");
      }
    }
  }

  async function handleSubmitNewEmail(event: any): Promise<void> {
    event.preventDefault();

    const isEmailFound = await userService.findUserByEmail(email);

    if (isEmailFound) {
      console.log("Email found");
      setEmailErrorMessage("Email already exists");
      return;
    }

    await userService.getUserDataById(user.userId).then((res: any) => {
      navigate("/otp", {
        state: {
          user: {
            id: user.userId,
            data: res,
            email: email,
            masterPassword: user.masterPassword,
            salt: user.salt,
          },
          fromSettings: true,
        },
      });
    });
  }

  return (
    <>
      <Modal
        show={openSuccessModal}
        size="2xl"
        popup
        onClose={() => {
          if (props.closeModal) {
            props.closeModal();
          }
          setShowSecQuestion(true);
          setShowNewEmail(false);
        }}
        className="dark:bg-darkcards-999"
      >
        {(location.pathname === "/settings" ||
          props.fromLoc === "shareCredential") && (
          <ModalHeader className="dark:bg-darkcards-999"></ModalHeader>
        )}

        {showSecQuestion && location.pathname !== "/otp" && (
          <label className="relative inline-flex cursor-pointer select-none items-center py-2 dark:bg-darkcards-999">
            <input
              id="masterPasswordCheckbox"
              type="checkbox"
              className="sr-only"
            />
            <span className="label flex items-center text-sm font-medium text-black pr-2">
              <Tooltip content={"Master Password"}>🔑</Tooltip>
            </span>
            <label className="relative inline-flex items-center cursor-pointer slider duration-200 ">
              <input
                id="securityQuestionCheckbox"
                type="checkbox"
                className="sr-only peer"
                checked={isSecurityQuestionChecked}
                onChange={(e: any) => {
                  setIsSecurityQuestionChecked(e.target.checked);
                  setErrorMessage("");
                }}
              />
              <div
                className="w-11 h-6 bg-gray-200 dark:bg-darkbg-999 peer-focus:outline-none peer-focus:ring-4 rounded-full 
                peer dark:border-darkborder-999 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
                peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px]
                after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
              ></div>
              <span className="ms-3 text-sm font-medium text-gray-900 dark:text-darktext-999"></span>
            </label>
            <span className="label flex items-center text-sm font-medium text-black ">
              <Tooltip content={"Security Question"}>🔐</Tooltip>
            </span>
          </label>
        )}

        {showSecQuestion &&
          (location.pathname === "/otp" ||
            location.pathname === "/settings" ||
            props.fromLoc === "shareCredential" ||
            location.pathname === "/sms") && (
            <div className="">
              <form className="w-full mx-auto p-4 shadow-md dark:bg-darkcards-999">
                {location.pathname === "/otp" &&
                props.fromLoc != "forgetPassEmailOTP" ? (
                  <div className="flex items-center justify-center border-b-4 dark:border-darkborder-999">
                    <h2 className="text-2xl text-center py-2 font-bold font-nunito dark:text-darktext-999">
                      📝 Setup Security
                    </h2>
                    <h2 className="text-2xl text-center py-2 font-bold font-nunito text-yellow-400">
                      &nbsp;Questions
                    </h2>
                  </div>
                ) : (
                  <div className="flex items-center justify-center border-b-4 dark:border-darkborder-999">
                    <h2 className="text-2xl text-center py-2 font-bold font-nunito dark:text-darktext-999">
                      {isSecurityQuestionChecked
                        ? "🔐 Answer the Security"
                        : "🔑 Enter your"}
                    </h2>
                    <h2 className="text-2xl text-center py-2 font-bold font-nunito text-yellow-400">
                      &nbsp;
                      {isSecurityQuestionChecked
                        ? "Questions"
                        : "master password"}
                    </h2>
                  </div>
                )}

                {isSecurityQuestionChecked ? (
                  /* Security Questions */
                  <div className="mt-7">
                    {location.pathname === "/otp" &&
                      props.fromLoc != "forgetPassEmailOTP" && (
                        <p className="text-sm text-gray-600 mb-2 dark:text-darksubtext-999">
                          Choose two security questions to answer.
                          (case-insensitive)*
                        </p>
                      )}
                    <div className="border border-gray-300 p-4 rounded-lg shadow-md dark:border-darkborder-999">
                      <p className="text-gray-800 pt-3 font-medium dark:text-darktext-999">
                        {" "}
                        Select Question 1
                      </p>
                      <select
                        placeholder="Select a question"
                        className="w-full bg-gray-900 text-white border rounded-lg  font-medium mb-1 mt-3 text-center dark:border-darkborder-999 dark:text-darksubtext-999"
                        onChange={(event) =>
                          setFirstQuestion(event.target.value)
                        }
                        name="firstQuestion"
                        value={firstQuestion}
                        id="firstQuestion-select"
                        disabled={
                          location.pathname === "/otp" &&
                          props.fromLoc != "forgetPassEmailOTP"
                            ? false
                            : true
                        }
                      >
                        <option id="Q1">
                          Name of a college you applied to but didn’t attend?
                        </option>
                        <option id="Q2">
                          {" "}
                          What was the name of your first stuffed toy?
                        </option>
                        <option id="Q3">
                          Where was the destination of your most memorable
                          school field trip?
                        </option>
                      </select>
                      <LabelInput
                        type="text"
                        onChange={(event) =>
                          setFirstQuestionAnswer(event.target.value)
                        }
                        placeholder="Answer"
                        label="Answer"
                        id="answer1"
                        required={true}
                      />
                    </div>

                    <div className="border border-gray-300 p-4 rounded-lg mt-3 shadow-md dark:border-darkborder-999">
                      <p className="text-gray-800 pt-3 font-medium dark:text-darktext-999">
                        {" "}
                        Select Question 2
                      </p>
                      <select
                        className="w-full p-2 bg-gray-900  text-white border font-medium rounded-lg mb-1 mt-3 text-center dark:border-darkborder-999 dark:text-darksubtext-999"
                        value={secondQuestion}
                        onChange={(event) =>
                          setSecondQuestion(event.target.value)
                        }
                        disabled={
                          location.pathname === "/otp" &&
                          props.fromLoc != "forgetPassEmailOTP"
                            ? false
                            : true
                        }
                      >
                        <option id="Q4">
                          What was your maths teacher's surname in your 8th year
                          of school?
                        </option>
                        <option id="Q5">
                          Name of the first school you remember attending?
                        </option>
                        <option id="Q6">
                          What was your driving instructor's first name?
                        </option>
                      </select>
                      <LabelInput
                        type="text"
                        onChange={(event) =>
                          setSecondQuestionAnswer(event.target.value)
                        }
                        label="Answer"
                        placeholder="Answer"
                        id="answer2"
                        required={true}
                      />
                    </div>
                  </div>
                ) : (
                  /* Master Password*/
                  <LabelInput
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={true}
                    label="Password"
                    id="password"
                    placeholder=""
                  >
                    <div className="grid grid-rows-2 grid-cols-2">
                      {showPassword ? (
                        <Tooltip
                          content={"Hide"}
                          className="absolute -translate-x-[1.3rem]"
                        >
                          <FiEyeOff
                            onClick={() => setShowPassword(!showPassword)}
                            size="1.3em"
                            className="ml-1 text-black dark:text-darksubtext-999
                                      absolute translate-x-[36rem] top-[1.9rem]"
                          />
                        </Tooltip>
                      ) : (
                        <Tooltip
                          content={"Show"}
                          className="absolute -translate-x-[1.3rem]"
                        >
                          <FiEye
                            onClick={() => setShowPassword(!showPassword)}
                            size="1.3em"
                            className="ml-1 text-black dark:text-darksubtext-999
                                      absolute translate-x-[36rem] top-[1.9rem]"
                          />
                        </Tooltip>
                      )}
                    </div>
                  </LabelInput>
                )}

                {errorMessage && (
                  <div className="flex mt-1">
                    <CgDanger className="w-4 h-5 text-red-500 " />
                    <p className="text-red-500 text-sm">
                      &nbsp; {errorMessage}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <div className="mt-2">
                  <Button
                    type="submit"
                    onClick={handleOnClick}
                    value="createAccount"
                  >
                    {props.fromLoc === "forgetPassEmailOTP" ||
                    props.fromLoc === "forgetPassSMSOTP" ||
                    props.fromLoc === "wipeAccount" ||
                    props.fromLoc === "wipeCredentials" ||
                    props.fromLoc === "wipeDocuments" ||
                    props.fromLoc === "changeEmail"
                      ? "Continue"
                      : props.fromLoc === "shareCredential"
                        ? "Send"
                        : "Create Account"}
                  </Button>
                </div>
              </form>
            </div>
          )}

        {showNewEmail && (
          <div className="flex flex-col justify-center pb-10 dark:bg-darkcards-999">
            <form
              className="max-w-[360px] w-full mx-auto"
              onSubmit={handleSubmitNewEmail} // Prevent form submission
            >
              <div className="flex justify-center items-center">
                <AiTwotoneMail className="text-4xl" />
                <div className="flex items-center justify-center">
                  <h2 className="text-3xl text-center pl-2 py-2 font-bold font-nunito dark:text-darktext-999">
                    Enter your new&nbsp;
                  </h2>
                  <h2 className="text-3xl text-center py-2 font-bold font-nunito text-yellow-400">
                    email&nbsp;
                  </h2>
                </div>
              </div>
              <p className="text-center text-sm text-gray-600 dark:text-darksubtext-999">
                We will send you a verification code to verify your email.
              </p>
              <div className="mt-4">
                <LabelInput
                  type="email"
                  value={email}
                  required={true}
                  label="Email"
                  id="email"
                  placeholder=""
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                ></LabelInput>
              </div>

              {emailErrorMessage && (
                <div className="flex">
                  <CgDanger className="w-4 h-5 text-red-500" />
                  <p className="text-red-500 text-sm">
                    &nbsp; {emailErrorMessage}
                  </p>
                </div>
              )}

              <div className="mt-7">
                <Button type="submit" value="sendVerification">
                  Send verification code
                </Button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </>
  );
};

export default SecurityQuestion;
