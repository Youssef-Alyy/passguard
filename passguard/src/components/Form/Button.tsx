import React from "react";
import buttonsArr from "../../data/buttons.tsx";

type FormProps = {
  type?: "button" | "submit" | "reset";
  value?: string;
  style?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;
};

const Button = (props: FormProps) => {
  return (
    <button
      type={props.type}
      value={props.value}
      onClick={props.onClick}
      className={`  inline-flex items-center  bg-gradient-to-r rounded-3xl
         hover:bg-gradient-to-bl focus:outline-none hover:text-black text-base 
         leading-normal tracking-tight font-semibold text-center
          transition-all duration-200 ease-out justify-center px-4 py-2 min-w-[8rem] 
		  ${props.style}
         ${
           props.value === "Add Document" ||
           props.value === "Login" ||
           props.value === "sendVerification" ||
           props.value === "createAccount" ||
           props.value === "Add" ||
           props.value === "GenPass"
             ? "bg-black hover:text-black hover:bg-yellow-400 text-white w-full dark:bg-blue-500 dark:hover:bg-yellow-400"
             : ""
         }
         ${
           props.value === "Save" || props.value === "Update"
             ? "bg-blue-500 border hover:bg-yellow-400 text-white w-full dark:border-darkborder-999"
             : ""
         }
         ${
           props.value === "Cancel"
             ? "text-blue-500 border border-gray-400 hover:bg-gray-200 w-full "
             : ""
         }
					${props.value === "GenConfirm" ? "bg-blue-500 hover:bg-yellow-400 text-white w-full" : ""}
		${props.value === "signout" ? "border bg-yellow-400 border-black rounded-xl  hover:bg-red-500 hover:text-white" : ""}
			${props.value === "GenCopy" ? "text-blue-500 border border-gray-400 hover:bg-gray-200 w-full" : ""}
			${props.value === "confirmsignout" ? "bg-red-500 hover:bg-yellow-400 text-white w-full" : ""}
         duration-[400ms]
         `}
    >
      {buttonsArr.map((item, index) =>
        item.icon !== "" && item.value === props.value ? (
          <img key={index} src={item.icon} alt={item.value} className="pr-1" />
        ) : (
          ""
        )
      )}
      {props.children}
    </button>
  );
};

export default Button;
