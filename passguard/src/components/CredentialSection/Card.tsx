import twitterCard from "./testCardItems";
import { MouseEventHandler, useState } from "react";
import Kebab from "./Kebab";
import { Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import Button from "../Form/Button";

type CardProps = {
  index: React.Key;
  id: string;
  picture?: string;
  title: string;
  username: string;
  dateCreated: string;
  dateUpdated: string;
  isWeak: boolean;
  isOld: boolean;
  isReused: boolean;
  isTrashed: boolean;
  onClick: MouseEventHandler<HTMLDivElement>;
  onUpdateClick: (key: React.Key) => void;
  onShareClick: (key: React.Key) => void;
  onDeleteClick: (key: React.Key) => void;
  onRecoverClick: (key: React.Key) => void;
  onPermanentRemoveClick: (key: React.Key) => void;
};
const Card = (props: CardProps) => {
  const [openPermanentRemoveModal, setOpenPermanentRemoveModal] =
    useState(false);

  const credentialStatus = (): string => {
    if (props.isWeak) {
      if (props.isReused && props.isOld) {
        return "bg-gradient-to-r from-red-500 via-sky-700 to-purple-400";
      } else if (props.isReused) {
        return "bg-gradient-to-r from-red-500 to-sky-700";
      } else if (props.isOld) {
        return "bg-gradient-to-r from-red-500 to-purple-500";
      } else {
        return "bg-red-500";
      }
    } else if (props.isReused) {
      if (props.isOld) {
        return "bg-gradient-to-r from-sky-700 to-purple-500";
      } else if (!props.isOld && !props.isWeak) {
        return "bg-gradient-to-r from-sky-700 to-green-500";
      }
    } else if (props.isOld) {
      return "bg-purple-500";
    }
    return "bg-green-500";
  };

  function handleTrashCredential(event: any): void {
    props.onDeleteClick(props.index);
  }

  function handlePermanentRemoveCredential(event: any): void {
    setOpenPermanentRemoveModal(false);
    props.onPermanentRemoveClick(props.index);
  }

  return (
    <>
      <div
        id={props.id}
        className={`relative ${credentialStatus()}
      flex cursor-pointer h-48 w-52 max-w-xs flex-col justify-end rounded-3xl hover:scale-105 transition-all duration-300`}
        onClick={props.onClick}
      >
        <img
          src={props.picture}
          className="w-16 translate-x-32 translate-y-10"
          alt="logo"
        />

        <div className="rounded-2xl h-36 w-full bg-neutral-100 shadow-2xl dark:bg-darkcards-999 dark:text-darkwhite-999 dark:border dark:border-darkborder-999">
          <div className="flex items-center justify-between p-4 h-12">
            <h3 className="font-nunito font-medium break-words text-sm">
              {props.title}
            </h3>
            <Kebab
              onUpdateClick={() => props.onUpdateClick(props.index)}
              onShareClick={() => props.onShareClick(props.index)}
              onDeleteClick={() => {
                props.onDeleteClick(props.index);
              }}
              onRecoverClick={() => props.onRecoverClick(props.index)}
              onPermanentRemoveClick={() => {
                setOpenPermanentRemoveModal(true);
              }}
              isTrashed={props.isTrashed}
            ></Kebab>
          </div>
          <div className=" flex flex-col text-center items-center justify-center gap-1 h-24 ">
            <p className="text-xs font-medium font-nunito break-words">
              {props.username}
            </p>
            <p className="text-xs font-nunito font-light break-words dark:text-darksubtext-999">
              Created: {props.dateCreated}
            </p>
            <p className="text-xs font-nunito font-light break-words dark:text-darksubtext-999">
              Last updated: {props.dateUpdated}
            </p>
          </div>
        </div>
      </div>

      <Modal
        show={openPermanentRemoveModal}
        size="md"
        onClose={() => setOpenPermanentRemoveModal(false)}
        popup
      >
        <Modal.Header className="dark:bg-darkcards-999" />
        <Modal.Body className="dark:bg-darkcards-999">
          {" "}
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-red-500" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to permanently delete this credential?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                value="Cancel"
                onClick={() => setOpenPermanentRemoveModal(false)}
              >
                Cancel
              </Button>
              <Button
                value="confirmsignout"
                onClick={handlePermanentRemoveCredential}
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Card;
