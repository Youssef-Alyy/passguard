import { Modal } from "flowbite-react";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import { FcRefresh } from "react-icons/fc";
import { useState } from "react";
import Button from "../Form/Button";
import LabelInput from "../Form/LabelInput";
import { CgDanger } from "react-icons/cg";


type CaptchaProps = {
  modalVal: boolean;
  closeModal: () => void;
};

const Captcha = (props: CaptchaProps) => {
  const [openModal] = useState(props.modalVal);
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaCode, setCaptchaCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const captchaCanvasRef = useRef<HTMLCanvasElement>(null);
  const ref: any = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      ref.current.click();
    }, 0);
  }, []);

  function generateCaptcha() {
    const canvas = captchaCanvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d")!;
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let captchaCode = "";
    const angleMin = -45;
    const angleMax = 45;
    const angleRange = angleMax - angleMin;
    const fontSizeMin = 20;
    const fontSizeMax = 30;
    const fontSizeRange = fontSizeMax - fontSizeMin;

    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 6; i++) {
      const character = characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
      captchaCode += character;

      context.font = `${fontSizeMin + Math.random() * fontSizeRange}px Arial`;
      context.textAlign = "center";
      context.textBaseline = "middle";

      context.fillStyle = `rgb(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)})`;

      const angle = angleMin + Math.random() * angleRange;
      context.translate(20 + i * 30, canvas.height / 2);
      context.rotate((angle * Math.PI) / 180);
      context.fillText(character, 0, 0);
      context.rotate((-angle * Math.PI) / 180);
      context.translate(-(20 + i * 30), -canvas.height / 2);
    }
    console.log(captchaCode);
    setCaptchaCode(captchaCode);
  }

  function handleRefreshCaptchaClick(): void {
    generateCaptcha();
    setErrorMessage("");
  }

  function handleContinueBTN(event: any): void {
    event.preventDefault();
    setCaptchaInput('')
    if (
      captchaInput !== captchaCode ||
      captchaInput === "" ||
      captchaCode === ""
    ) {
      setErrorMessage("Invalid captcha code. Please try again.");
      generateCaptcha();
      return;
    } else {
      console.log("Captcha code is correct");
      setErrorMessage("");
      props.closeModal();
    }
  }

  function handleOnChange(event: any): void {
    setErrorMessage("");
    setCaptchaInput(event.target.value);
  }

  return (
    <>
      <Modal
        show={openModal}
        size="md"
        onClose={() => props.closeModal()}
        popup
        className="dark:bg-darkcards-999"
      >
        <div className="shadow-md p-4  w-full max-w-lg mx-auto dark:bg-darkcards-999">
          <h1 className="text-xl font-bold text-gray-800 mb-6 text-center font-['Nunito'] dark:text-darktext-999">
            Enter the Code Below
          </h1>
          <div className="mb-3 flex justify-center mx-auto gap-2">
            <canvas
              id="captcha"
              ref={captchaCanvasRef}
              width="200"
              height="80"
              className="text-center bg-gray-900 border-2 border-gray-300 rounded-md shadow-md dark:bg-darkbg-999"
            ></canvas>
            <button
              type="button"
              ref={ref}
              className=" items-center bg-gradient-to-r rounded-3xl h-10 mt-5
              hover:bg-gradient-to-bl focus:outline-none  text-base 
              leading-normal tracking-tight font-semibold text-center
               transition-all duration-200 ease-out justify-center px-4 py-2 min-w-[8rem] 
                border border-gray-400 
               bg-black hover:text-black hover:bg-yellow-400 text-white dark:bg-blue-500 dark:hover:bg-yellow-400"
              id="refresh-captcha"
              onClick={() => handleRefreshCaptchaClick()}
            >
              <div className={`flex`}>
                <FcRefresh className="w-5 h-5 " />
                <h1 className="text-sm">Generate Captcha</h1>{" "}
                {/* MIGHT NEED MODIFICAION*/}
              </div>
            </button>
          </div>

          <form onSubmit={handleContinueBTN}>
            <div className="mx-auto w-72 mb-3">
              <LabelInput
                type="text"
                id="captcha-input"
                value={captchaInput}
                required={true}
                label="Enter Captcha"
                placeholder=""
                onChange={handleOnChange}
              ></LabelInput>
              {errorMessage && (
                <div className="flex mt-1">
                  <CgDanger className="w-4 h-5 text-red-500" />
                  <p className="text-red-500 text-sm">&nbsp; {errorMessage}</p>
                </div>
              )}
            </div>

            <div className="mx-auto w-72">
              <Button value="Save" type="submit">
                Continue
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default Captcha;
