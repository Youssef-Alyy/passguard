import React, { useEffect, useState } from "react";
import { Modal, Tooltip } from "flowbite-react";
import Button from "./Form/Button";
import { HiOutlineClipboardDocument } from "react-icons/hi2";

type PasswordGeneratorModalProps = {
  onConfirm?: (password: string) => void;
  openModal?: any;
  closeModal?: any;
};

const PasswordGeneratorModal = (props: PasswordGeneratorModalProps) => {
  const [modalOpen, setModalOpen] = useState<boolean>(props.openModal);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [passwordLength, setPasswordLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeSpecialSymbols, setIncludeSpecialSymbols] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true); // New state for including numbers

  useEffect(() => {
    generatePassword();
  }, [
    includeUppercase,
    includeLowercase,
    includeSpecialSymbols,
    includeNumbers,
    passwordLength,
  ]);

  const generatePassword = () => {
    // Validate at least one checkbox is selected
    if (
      !includeUppercase &&
      !includeLowercase &&
      !includeSpecialSymbols &&
      !includeNumbers
    ) {
      return;
    }

    let characters = "";
    if (includeUppercase) characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLowercase) characters += "abcdefghijklmnopqrstuvwxyz";
    if (includeSpecialSymbols) characters += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    if (includeNumbers) characters += "0123456789"; // Include numbers if selected

    let password = "";
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }

    setGeneratedPassword(password);
  };

  const toggleModal = () => {
    if (props.closeModal) {
      props.closeModal();
    }
    setModalOpen(!modalOpen);
    if (!modalOpen) {
      generatePassword();
    }
  };
  const syncInputField = () => {
    setModalOpen(!modalOpen);
    if (props.onConfirm) props.onConfirm(generatedPassword);
  };
  const getCharacterStyle = (char: any) => {
    if (/[A-Z]/.test(char)) {
      return { color: "black" }; // Uppercase characters
    } else if (/[a-z]/.test(char)) {
      return { color: "#a855f7" }; // Lowercase characters
    } else if (/[0-9]/.test(char)) {
      return { color: "#3b82f6" }; // Numbers
    } else {
      return { color: "#ef4444" }; // Symbols
    }
  };

  return (
    <>
      {props.onConfirm ? (
        <Button value="GenPass" type="button" onClick={toggleModal}>
          🔑 Generate Password
        </Button>
      ) : (
        ""
      )}
      <Modal
        show={modalOpen}
        size="lg"
        onClose={toggleModal}
        dismissible
        // Added to show close button in modal header
      >
        <div className="p-4 dark:bg-darkcards-999 dark:text-darkwhite-999">
          <div className="p-2">
            <h1 className="text-2xl font-nunito font-bold border-b-4 dark:border-darkborder-999">
              Password Generator
            </h1>
            <br />
            <h2 className="text-lg font-nunito font-semibold p-1">
              Current Length:{" "}
              <span className="font-bold text-blue-500">{passwordLength}</span>
            </h2>
            <div className="flex justify-center items-center border bg-gray-200 text-blue-500 border-gray-300 p-2 w-full rounded-2xl text-center text-lg font-bold font-nunito dark:border-darkborder-999 dark:bg-dark-999">
              {generatedPassword.split("").map((char, index) => (
                <span key={index} style={getCharacterStyle(char)}>
                  {char}
                </span>
              ))}
              <Tooltip
                content="Copied to Clipboard!"
                trigger="click"
                arrow={false}
                property="right"
                className={` translate-x-[5rem] translate-y-[3.5rem] bg-black`}
              >
                <HiOutlineClipboardDocument
                  size="1.3em"
                  className="absolute ml-1 text-black translate-x-[25rem] translate-y-[-0.75rem] dark:text-darksubtext-999"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedPassword);
                  }}
                />
              </Tooltip>
            </div>
          </div>
          <div className="flex justify-between items-center p-2 border rounded-lg border-gray-400 mb-5 mt-2 dark:border-darkborder-999">
            <span className="font-bold text-blue-500 ">8</span>
            <input
              type="range"
              value={passwordLength}
              min={8}
              max={30}
              step={1}
              onChange={(e) => setPasswordLength(Number(e.target.value))}
              className="border border-gray-300  w-full ml-2 mr-2 rounded "
            />
            <span className="font-bold text-blue-500">30</span>
          </div>
          <div
            className="flex justify-between items-center p-2 border rounded-lg border-gray-400 m-2 dark:border-darkborder-999"
            onClick={() => setIncludeUppercase(!includeUppercase)}
          >
            <label className="font-nunito font-medium">Include Uppercase</label>
            <input
              type="checkbox"
              checked={includeUppercase}
              onChange={() => setIncludeUppercase(!includeUppercase)}
            />
          </div>
          <div
            className="flex justify-between items-center p-2 border rounded-lg border-gray-400 m-2 dark:border-darkborder-999"
            onClick={() => setIncludeLowercase(!includeLowercase)}
          >
            <label className="font-nunito font-medium">
              Include <span className="text-purple-500">Lowercase</span>
            </label>
            <input
              type="checkbox"
              checked={includeLowercase}
              onChange={() => setIncludeLowercase(!includeLowercase)}
            />
          </div>
          <div
            className="flex justify-between items-center p-2 border rounded-lg border-gray-400 m-2 dark:border-darkborder-999"
            onClick={() => setIncludeSpecialSymbols(!includeSpecialSymbols)}
          >
            <label className="font-nunito font-medium">
              Include <span className="text-red-500">Special Symbols</span>
            </label>
            <input
              type="checkbox"
              checked={includeSpecialSymbols}
              onChange={() => setIncludeSpecialSymbols(!includeSpecialSymbols)}
            />
          </div>
          <div
            className="flex justify-between items-center p-2 border rounded-lg border-gray-400 m-2 mb-0 dark:border-darkborder-999"
            onClick={() => setIncludeNumbers(!includeNumbers)}
          >
            <label className="font-nunito font-medium">
              Include <span className="text-blue-500">Numbers</span>
            </label>
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={() => setIncludeNumbers(!includeNumbers)}
            />
          </div>
        </div>
        {!props.openModal ? (
          <div className="w-full flex items-center justify-center p-5 dark:bg-darkcards-999">
            <Button value="GenConfirm" onClick={syncInputField}>
              Confirm
            </Button>
          </div>
        ) : (
          ""
        )}
      </Modal>
    </>
  );
};

export default PasswordGeneratorModal;
