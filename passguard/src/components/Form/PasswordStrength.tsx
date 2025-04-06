import React, { useRef, useState } from "react";
import zxcvbn from "zxcvbn";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { HiOutlineClipboardDocument } from "react-icons/hi2";
import { IoInformationCircleOutline } from "react-icons/io5";
import { List, Tooltip } from "flowbite-react";
import GeneratePassword from "../GenPass";

type PasswordProps = {
  type?: string;
  value?: string;
  required?: boolean;
  hidden?: boolean;
  id?: string;
  label?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  viewOnly?: boolean;
  name?: string;
};

const PasswordStrength = (props: PasswordProps) => {
  const [password, setPassword] = useState(props.value ? props.value : "");
  const [score, setScore] = useState(
    props.value ? zxcvbn(props.value).score : 0
  );
  const [feedback, setFeedback] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [TooltipClicked, setTooltipClicked] = useState(false);

  const handleShowPassword = (e: any) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    const result = zxcvbn(newPassword);
    setScore(result.score);

    setFeedback(result.feedback.suggestions.join(" "));

    props.onChange ? props.onChange(e) : "";
  };

  const handleConfirm = (password: string) => {
    setPassword(password);
    const result = zxcvbn(password);
    setScore(result.score);
    setOpen(false);
  };
  const handleTooltipClick = () => {
    setTooltipClicked(true);
    setTimeout(() => {
      setTooltipClicked(false);
    }, 900);
  };

  return (
    <div className="">
      <div className="mb-3 flex mt-1 relative hover:text-blue-300 items-center ">
        <input
          readOnly={props.viewOnly}
          type={showPassword ? "text" : "password"}
          name={props.id}
          id={props.id}
          required={props.required}
          value={password}
          placeholder={" "}
          onChange={handlePasswordChange}
          autoComplete={props.label}
          className={`mt-5 peer h-10 w-full pl-2 pr-12
           text-gray-900 placeholder-transparent text-sm
           ${props.viewOnly ? "bg-slate-100 text-gray-500" : "text-black dark:text-darktext-999"}
           rounded-lg border-2 justify-start items-start gap-14 inline-flex border-gray-400
           focus:outline-none dark:bg-darkinset-999  dark:border-darkborder-999 dark:text-darksubtext-999
           ${
             score <= 0 && password.length > 0
               ? "border border-red-500"
               : score === 1
                 ? "border border-yellow-500"
                 : score === 2
                   ? "border border-orange-500"
                   : score === 3
                     ? "border border-lime-500"
                     : score === 4
                       ? "border border-green-500"
                       : "focus:border-blue-500"
           }
           `}
        />

        <input
          type="hidden"
          name="isWeak"
          value={score === 0 || score === 1 ? "true" : "false"}
        />

        <label
          htmlFor={props.id}
          className="p-1 mt-4 absolute left-1 -top-6 text-gray-600 text-base peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-6 peer-focus:text-blue-600 transition-all font-normal font-['Nunito'] dark:text-darktext-999"
        >
          {props.required && !props.viewOnly ? `${props.label}*` : props.label}
        </label>

        <div>

          {showPassword ? (
            <Tooltip
              content={"Hide"}
              className="-translate-x-[2.3rem] text-center"
            >
              <FiEyeOff
                onClick={handleShowPassword}
                size="1.3em"
                className="absolute text-black translate-x-[14rem] dark:text-darksubtext-999"
              />
            </Tooltip>
          ) : (
            <Tooltip
              content={"Show"}
              className="-translate-x-[2.3rem] text-center"
            >
              <FiEye
                onClick={handleShowPassword}
                size="1.3em"
                className="absolute text-black translate-x-[14rem] dark:text-darksubtext-999"
              />
            </Tooltip>
          )}

          <Tooltip
            content={TooltipClicked ? "Copied!" : "Copy"}
            trigger="hover" 
            className="absolute -translate-x-4"
          >
            <HiOutlineClipboardDocument
              size="1.3em"
              className="absolute ml-1 text-black translate-x-[15.1rem] dark:text-darksubtext-999"
              onClick={() => {
                {
                  handleTooltipClick();

                  props.value
                    ? navigator.clipboard.writeText(props.value)
                    : navigator.clipboard.writeText(password);
                }
              }}
            />
          </Tooltip>
        </div>
      </div>
      {!props.viewOnly ? (
        <div className="pb-5">
          <GeneratePassword onConfirm={handleConfirm}></GeneratePassword>
        </div>
      ) : (
        ""
      )}
      <div className="text-sm font-nunito font-bold text-gray-500 pl-2">
        Status:{" "}
        <span
          className={`${
            score <= 0
              ? "text-red-500"
              : score === 1
                ? "text-yellow-500"
                : score === 2
                  ? "text-orange-500"
                  : score === 3
                    ? "text-lime-500"
                    : score === 4
                      ? "text-green-500"
                      : ""
          }`}
        >
          {score <= 0 && password.length > 0
            ? "Very Weak"
            : score === 1
              ? "Weak"
              : score === 2
                ? "Moderate"
                : score === 3
                  ? "Strong"
                  : score === 4
                    ? "Very Strong"
                    : ""}
        </span>
      </div>
      <div className="-mx-1 pl-1 w-full">
        <div className="px-1 grid grid-cols-4 gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={`h-2 mt-1 rounded-xl transition-colors ${
                i < score
                  ? score <= 0
                    ? "bg-red-500"
                    : score === 1
                      ? "bg-yellow-500"
                      : score === 2
                        ? "bg-orange-500"
                        : score === 3
                          ? "bg-lime-500"
                          : score === 4
                            ? "bg-green-500"
                            : "bg-red-800"
                  : "bg-gray-200"
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PasswordStrength;
