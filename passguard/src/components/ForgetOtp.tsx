import React, { useState, useEffect } from "react";
import loginImg from "../assets/icons/common/appLogo.svg";
import { useNavigate } from "react-router-dom";
import LabelInput from "./Form/LabelInput";
import { AiTwotoneMail } from "react-icons/ai";
import Button from "./Form/Button";
import UserService from "../utils/userService";
import Captcha from "./Captcha/Captcha";
import { CiCircleChevLeft } from "react-icons/ci";

const ForgetOTP: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const checkEmail = (modalClosed: boolean) => {
    const userService = new UserService();
    setEmail(email);
    userService.findUserByEmail(email).then((data: any) => {
      if (data) {
        console.log("Email found");
        setOpenModal(true);
        if (modalClosed) {
          setOpenModal(false);
          const forgetPassPereference = JSON.parse(
            data.preference
          ).forgetPassOtp;
          if (forgetPassPereference === "sms") {
            navigate("/sms", { state: { user: data, fromForgetOTP: true } });
          } else {
            navigate("/otp", { state: { user: data, fromForgetOTP: true } });
          }
        }
      } else {
        console.log("Email not found");
        setMessage("Email not found");
      }
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 h-screen w-full">
        <div className="hidden sm:block">
          <img
            className="w-full h-full object-cover"
            src={loginImg}
            alt="Login visual"
          />
        </div>
        <div className="bg-gray-100 flex flex-col justify-center dark:bg-darkbg-999">
          <form
            className="max-w-[400px] w-full mx-auto bg-white p-4 shadow-md dark:bg-darkcards-999"
            onSubmit={(e) => {
              e.preventDefault();
              checkEmail(false);
            }}
          >
            <CiCircleChevLeft
              className="w-8 h-8 hover:text-blue-500 cursor-pointer dark:text-darkbuttonblue-999 dark:hover:text-yellow-400"
              onClick={() => navigate("/login", {})}
            ></CiCircleChevLeft>
            <div className="flex justify-center items-center">
              <AiTwotoneMail className="text-4xl dark:text-darkbg-999" />

              <div className="flex items-center justify-center">
                <h2 className="text-4xl text-center pl-2 py-2 font-bold font-nunito dark:text-darktext-999">
                  Enter your&nbsp;
                </h2>
                <h2 className="text-4xl text-center py-2 font-bold font-nunito text-yellow-400">
                  email
                </h2>
              </div>
            </div>
            <p className="text-center text-sm text-gray-600 dark:text-darksubtext-999">
              We will send you a verification code to reset your password.
            </p>
            <div className="mt-4">
              <LabelInput
                type="text"
                required={true}
                value={email}
                label="Email"
                id="email"
                placeholder=""
                onChange={handleEmailChange}
                status={message ? false : true}
              ></LabelInput>
            </div>

            <div className="mt-10">
              <Button type="submit" value="sendVerification">
                Send verification code
              </Button>
            </div>
          </form>
        </div>
      </div>

      {openModal && (
        <Captcha
          modalVal={openModal}
          closeModal={() => checkEmail(true)}
        ></Captcha>
      )}
    </>
  );
};

export default ForgetOTP;
