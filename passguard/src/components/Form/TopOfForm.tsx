import { useState, useEffect } from "react";
import { FaHeart, FaRegTrashAlt } from "react-icons/fa";
import { serviceNames } from "../../data/dropdownItems";
import CredentialService from "../../utils/credentialService";
import { Modal, Tooltip } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import Button from "./Button";

const credentialService = new CredentialService();

function TopOfForm(props: any) {
  const [openModal, setOpenModal] = useState(false);
  const [isFavorited, setIsFavorited] = useState(props.credential.isFavourite);

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    if (props.credential.credentialId) {
      credentialService.favoriteCredentialById(
        props.credential.credentialId,
        !isFavorited
      );
    }
    props.favoriteRender();
    console.log("Favoried Credential", props.credential.credentialId);
  };

  const handleDeleteCredential = () => {
    setOpenModal(false);
    console.log("Trashing Credential", props.credential.credentialId);

    if (props.credential.credentialId) {
      credentialService.trashCredentialById(props.credential.credentialId);
    }
    props.credDeleted();

    setOpenModal(false);
  };

  return (
    <>
      <div className="flex items-center pt-4 box-border shadow-sm bg-neutral-100 h-min w-80 dark:bg-darkbg-999">
        <div className="w-20">
          <img
            className=""
            src={`
            ${
              serviceNames.find(
                (service: any) =>
                  service.name ===
                  (props.data.serviceName
                    ? props.data.serviceName
                    : props.credential.serviceName)
              )?.image || serviceNames[serviceNames.length-1].image
            }
            `}
            alt="image description"
          />
        </div>

        <div className="w-44 mr-4">
          <h1 className="MainXAccount text-zinc-800 dark:text-darktext-999 font-bold font-['Nunito'] leading-normal text-sm whitespace-nowrap">
            {props.credential.title
              ? props.credential.title
              : props.data.credentialTitle}
          </h1>
          <h2 className="SocialMedia h-3 text-neutral-500 dark:text-darksubtext-999 text-xs leading-none">
            {props.credential.serviceType
              ? props.credential.serviceType
              : props.data.serviceType}
          </h2>
        </div>

        <div id="logos" className="flex">
          {props.credential.credentialId && !props.credential.isTrashed ? (
            <div className="relative inline-block">
              <Tooltip
                content="Favorite"
                placement="bottom"
                className="mt-3"
                arrow={false}
              >
                <FaHeart
                  className={`w-6 h-6 cursor-pointer ${isFavorited ? "text-red-500 fill-current" : "text-gray-500"}`}
                  onClick={handleFavorite}
                />
              </Tooltip>
            </div>
          ) : (
            ""
          )}

          {props.credential.credentialId && !props.credential.isTrashed ? (
            <FaRegTrashAlt
              onClick={() => setOpenModal(true)}
              className={`w-5 h-5 -translate-y-8 ${props.credential.credentialId ? "text-blue-800" : "text-gray-600"}`}
            ></FaRegTrashAlt>
          ) : null}
          <Modal
            show={openModal && props.credential.credentialId}
            size="md"
            onClose={() => setOpenModal(false)}
            popup
          >
            <Modal.Header className="dark:bg-darkcards-999" />
            <Modal.Body className="dark:bg-darkcards-999">
              {" "}
              <div className="text-center">
                <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-red-500" />
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Are you sure you want to trash this credential?
                </h3>
                <div className="flex justify-center gap-4">
                  <Button value="Cancel" onClick={() => setOpenModal(false)}>
                    Cancel
                  </Button>
                  <Button
                    value="confirmsignout"
                    onClick={handleDeleteCredential}
                  >
                    Trash
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </>
  );
}

export default TopOfForm;
