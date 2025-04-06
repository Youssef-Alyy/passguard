import Button from "../Form/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import { useState } from "react";
import SecurityQuestion from "../SecurityQuestion/SecurityQuestion";

interface WipeAccountProps {}

const WipeAccount = (props: WipeAccountProps) => {
  const location = useLocation();
  const user = location.state.user;

  const [openAssuranceModal, setOpenAssuranceModal] = useState(false);
  const [secQuestionModal, setSecQuestionModal] = useState(false);

  async function handleWipeAccount(event: any): Promise<void> {
    console.log("Wipe Account", user);
    setOpenAssuranceModal(false);
    setSecQuestionModal(true);
  }

  return (
    <>
      <div className="p-5 flex items-center justify-between rounded-t-none rounded-b-3xl bg-gray-100 border border-gray-200 shadow-md dark:border-darkborder-999 dark:bg-darkcards-999">
        <div className="flex flex-col">
          <span className="font-semibold pb-2 dark:text-darktext-999">
            Wipe Account
          </span>

          <span className="font-nunito text-gray-500 dark:text-darksubtext-999">
            <span className="text-red-500 text-sm font-bold">⚠️ Warning:</span>{" "}
            <span className="font-semibold text-sm">
              This action is irreversible.
            </span>
          </span>
        </div>

        <div className="min-w-[13rem]">
          <Button
            value="Add"
            style="bg-black text-white hover:bg-yellow-400 max-w-[13rem] w-[13rem]"
            onClick={() => setOpenAssuranceModal(true)}
          >
            Wipe Account
          </Button>
        </div>
      </div>

      {openAssuranceModal && (
        <Modal
          show={openAssuranceModal}
          size="md"
          onClose={() => setOpenAssuranceModal(false)}
          popup
          className="dark:bg-darkcards-999"
        >
          <Modal.Header className="dark:bg-darkcards-999" />
          <Modal.Body className="dark:bg-darkcards-999">
            {" "}
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-red-500 dark:text-red-500" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to completely wipe your account?
              </h3>
              <div className="flex justify-center gap-4">
                <Button
                  value="Cancel"
                  onClick={() => setOpenAssuranceModal(false)}
                >
                  No, Cancel
                </Button>
                <Button value="confirmsignout" onClick={handleWipeAccount}>
                  Delete
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}

      {secQuestionModal && (
        <SecurityQuestion
          fromLoc={"wipeAccount"}
          openModal={true}
          closeModal={() => setSecQuestionModal(false)}
        />
      )}
    </>
  );
};

export default WipeAccount;
