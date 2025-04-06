import { Tooltip } from "flowbite-react";
import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import zxcvbn from "zxcvbn";

type MPasswordStrengthProps = {
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
  strength?: number;
  contextSpecific?: boolean;
  repeatedChar?: boolean;
  sequentialChar?: boolean;
};

const MPasswordStrength = (props: MPasswordStrengthProps) => {
  const [password, setPassword] = useState(props.value ? props.value : "");
  const [score, setScore] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = (e: any) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const testingPasswordStrength = (password: string) => {
    const atLeastMinimumLength = (password: string) =>
      new RegExp(/(?=.{8,})/).test(password);
    const atLeastOneUppercaseLetter = (password: string) =>
      new RegExp(/(?=.*?[A-Z])/).test(password);
    const atLeastOneLowercaseLetter = (password: string) =>
      new RegExp(/(?=.*?[a-z])/).test(password);
    const atLeastOneNumber = (password: string) =>
      new RegExp(/(?=.*?[0-9])/).test(password);
    const atLeastOneSpecialChar = (password: string) =>
      new RegExp(/(?=.*?[#?!@$ %^&*-])/).test(password);

    const zxcvbnScore = zxcvbn(password).score;
    let zxcvbnDictionary: boolean = false;

    const patternArr = zxcvbn(password).sequence;
    for (const index in patternArr) {
      if (patternArr[index].pattern === "dictionary") {
        zxcvbnDictionary = true;
      }
    }

    let strengthCount = 0;

    const fulfilledConditionsCount = [
      atLeastOneUppercaseLetter(password),
      atLeastOneLowercaseLetter(password),
      atLeastOneNumber(password),
      atLeastOneSpecialChar(password),
    ].filter((condition) => condition).length;

    if (fulfilledConditionsCount >= 2) {
      strengthCount++;
    }

    if (fulfilledConditionsCount >= 3) {
      strengthCount++;
    }

    if (
      atLeastOneLowercaseLetter(password) &&
      atLeastOneUppercaseLetter(password) &&
      atLeastOneNumber(password) &&
      atLeastOneSpecialChar(password)
    ) {
      strengthCount = 2;
    }

    if (
      atLeastOneLowercaseLetter(password) &&
      atLeastOneUppercaseLetter(password) &&
      atLeastOneNumber(password) &&
      atLeastOneSpecialChar(password) &&
      atLeastMinimumLength(password) &&
      zxcvbnDictionary
    ) {
      strengthCount = 2;
    } else if (
      atLeastOneLowercaseLetter(password) &&
      atLeastOneUppercaseLetter(password) &&
      atLeastOneNumber(password) &&
      atLeastOneSpecialChar(password) &&
      atLeastMinimumLength(password) &&
      zxcvbnScore == 3
    ) {
      strengthCount = 3;
    }

    if (
      !props.contextSpecific &&
      !props.repeatedChar &&
      !props.sequentialChar &&
      zxcvbnScore == 4 &&
      atLeastOneLowercaseLetter(password) &&
      atLeastOneUppercaseLetter(password) &&
      atLeastOneNumber(password) &&
      atLeastOneSpecialChar(password) &&
      atLeastMinimumLength(password)
    ) {
      strengthCount = 4;
    }

    return strengthCount;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const result = testingPasswordStrength(newPassword);
    setScore(result);
    props.onChange ? props.onChange(e) : "";
  };

  return (
    <>
      <div className="relative border-gray-300 flex items-center ">
        <input
          readOnly={props.viewOnly}
          type={showPassword ? "text" : "password"}
          name={props.id}
          id={props.id}
          required={props.required}
          value={password}
          onChange={handlePasswordChange}
          placeholder=""
          autoComplete={props.label}
          className={`peer h-10 w-full pl-2 pr-8 
           text-gray-900 placeholder-transparent text-sm border-gray-400
           ${props.viewOnly ? "bg-slate-100" : ""}
           rounded-lg border-2 justify-start items-start gap-14 inline-flex
           focus:outline-none dark:bg-darkinset-999 dark:text-darkwhite-999 dark:border-darkborder-999
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
                       : "focus:border-blue-600"
           }
           `}
        />

        <label
          htmlFor={props.id}
          className="ml-1 absolute left-1 -top-6 text-gray-600 text-base peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-6 peer-focus:text-blue-600 transition-all font-normal font-['Nunito']"
        >
          {"*"+props.label}
        </label>

        <div className="">
          {showPassword ? (
            <Tooltip
              content={"Hide"}
              className="absolute -translate-x-[1.3rem] -translate-y-2"
            >
              <FiEyeOff
                onClick={handleShowPassword}
                size="1.3em"
                className="ml-1 text-black dark:text-darksubtext-999
                  absolute translate-x-[24rem] top-[0.6rem]"
              />
            </Tooltip>
          ) : (
            <Tooltip
              content={"Show"}
              className="absolute -translate-x-[1.3rem] -translate-y-2"
            >
              <FiEye
                onClick={handleShowPassword}
                size="1.3em"
                className="ml-1 text-black dark:text-darksubtext-999
              absolute translate-x-[24rem] top-[0.6rem]"
              />
            </Tooltip>
          )}
        </div>
      </div>

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
    </>
  );
};

export default MPasswordStrength;
