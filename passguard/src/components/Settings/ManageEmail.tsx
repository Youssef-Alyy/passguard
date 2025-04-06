import { useState } from "react";
import Button from "../Form/Button";
import SecurityQuestion from "../SecurityQuestion/SecurityQuestion";

const ManageEmail = () => {
  const [openModal, setIsModalOpen] = useState(false);

  function handleModals(): void {
    setIsModalOpen(false);
  }

  return (
    <>
      <h2 className="m-2 font-bold text-lg dark:text-white">Account</h2>
      <div className="p-5  flex items-center justify-between  rounded-xl rounded-b-none bg-gray-100 border border-gray-200 shadow-md dark:border-darkborder-999 dark:bg-darkcards-999">
        <div className="flex flex-col">
          <span className="font-semibold pb-2 dark:text-darktext-999">
            Change Account Email
          </span>
          <span className="font-nunito text-gray-500 dark:text-darksubtext-999">
            <span className="font-semibold text-sm">
              Use this feature if you would like to change you PassGuard account
              email.
            </span>
          </span>
        </div>

        <div className="min-w-[13rem]">
          <Button
            value="Add"
            style="bg-black text-white hover:bg-yellow-400 w-[13rem] max-w-[13rem]"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            Change Account Email
          </Button>
        </div>
      </div>

      {openModal && (
        <SecurityQuestion
          fromLoc="changeEmail"
          closeModal={handleModals}
          openModal={openModal}
        ></SecurityQuestion>
      )}
    </>
  );
};

export default ManageEmail;
