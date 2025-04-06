import React, { useEffect, useState } from "react";
import { HiOutlineClipboardDocument } from "react-icons/hi2";
import { HiOutlineExternalLink } from "react-icons/hi";
import { Tooltip } from "flowbite-react";
import redinfo from "../../assets/icons/stats/redinfo.svg";
import CredentialService from "../../utils/credentialService";

const credentialService = new CredentialService();

type LabelInputProps = {
  type?: string;
  required?: boolean;
  label?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  id?: string;
  placeholder?: string;
  children?: React.ReactNode;
  viewOnly?: boolean;
  status?: boolean;
  autofill?: {
    credentialId: string;
    title: string;
    serviceName: string;
    serviceType: string;
    data: string;
    url: string;
  };
};
const LabelInput = (props: LabelInputProps) => {
  const [value, setValue] = useState(props.value ? props.value : "");
  const [isHTTPS, setIsHTTPS] = useState(
    props.value?.includes("http") ? true : false
  );
  const [TooltipClicked, setTooltipClicked] = useState(false);

  const handleTooltipClick = () => {
    setTooltipClicked(true);
    setTimeout(() => {
      setTooltipClicked(false);
    }, 900);
  };

  useEffect(() => {
    setValue(props.value ? props.value : "");
    setIsHTTPS(props.value?.includes("http") ? true : false);
  }, [props.value]);

  const handleOnChange = (e: any) => {
    setValue(e.target.value);
    props.onChange ? props.onChange(e) : "";
  };

  return (
    <div className="mt-1 relative border-gray-300 flex items-center">
      <input
        id={props.id}
        name={props.id}
        value={value}
        required={props.required}
        type={props.type}
        maxLength={
          props.id === "credentialTitle"
            ? 25
            : props.id === "userName"
              ? 36
              : props.id === "email"
                ? 31
                : 100
        }
        className={`p-0 m-0 pl-2 mt-5 pr-6 peer h-10 w-full  bg-opacity-50 border-gray-400
        ${props.viewOnly ? "bg-gray-200 text-gray-500" : "text-black dark:text-darktext-999"} ${props.status == false ? "border-red-500" : ""}
        rounded-lg justify-start items-start gap-14 inline-flex text-sm
         placeholder-transparent focus:outline-none focus:border-blue-600 border-2 dark:bg-darkinset-999 dark:border-darkborder-999 `}
        placeholder={props.placeholder}
        onChange={handleOnChange}
        readOnly={props.viewOnly}
      />
      {props.status == false ? (
        <div className="absolute top-16 flex items-center">
          <img src={redinfo} className="w-3 m-1" />
          <p className="text-red-500 text-sm">Invalid Email</p>
        </div>
      ) : (
        ""
      )}
      <label
        htmlFor={props.id}
        className="p-1 mt-4 absolute left-1 -top-6 font-normal font-['Nunito']
         text-gray-800 text-base peer-placeholder-shown:text-base
          peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 
          peer-focus:-top-6 peer-focus:text-blue-600 transition-all dark:text-darktext-999"
      >
        {props.required && !props.viewOnly ? `${props.label}*` : props.label}
      </label>
      {props.children ? (
        props.children
      ) : props.id === "userName" ? (
        <Tooltip
          content={TooltipClicked ? "Copied!" : "Copy"}
          trigger="hover"
          className="absolute -translate-x-[0.8rem]"
        >
          <HiOutlineClipboardDocument
            size="1.3em"
            className="absolute text-black translate-x-[15.4rem] dark:text-darksubtext-999"
            onClick={() => {
              {
                handleTooltipClick();
                props.value
                  ? navigator.clipboard.writeText(props.value)
                  : navigator.clipboard.writeText(value);
              }
            }}
          />
        </Tooltip>
      ) : props.id === "loginPageUrl" ? (
        <Tooltip content={"Redirect"} className="-translate-x-4" placement="top">
          <HiOutlineExternalLink
            size="1.3em"
            className="absolute text-black translate-x-[15.4rem] top-7 dark:text-darksubtext-999"
            onClick={async () => {
              // isHTTPS
              //   ? window.open(
              //       props.value,
              //       "MyWindow",
              //       "width=1200 ,height=800 "
              //     )
              //   : window.open(
              //       "https://" + props.value,
              //       "MyWindow",
              //       "width=1200 ,height=800 "
              //     );
              //  await fillLoginForm(props.value,'username','password');
              if (props.autofill?.url && props.autofill?.data)
                credentialService.autofillCredentialById(
                  props.autofill?.url,
                  JSON.parse(props.autofill?.data).userName,
                  JSON.parse(props.autofill?.data).password
                );
            }}
          />
        </Tooltip>
      ) : (
        ""
      )}
    </div>
  );
};

export default LabelInput;
