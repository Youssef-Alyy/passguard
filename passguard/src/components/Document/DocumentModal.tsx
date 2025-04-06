import { FileInput, Label, Modal, Select, TextInput } from "flowbite-react";
import AddButton from "../Form/Button";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import DocumentService from "../../utils/documentService";
import { IoInformationCircleOutline } from "react-icons/io5";
import LabelInput from "../Form/LabelInput";

const documentService = new DocumentService();

type DocumentModalProps = {
  modalVal: boolean;
  closeModal: () => void;
  warningModal: () => void;
};

function DocumentModal(props: DocumentModalProps) {
  const location = useLocation();
  const user = location.state.user;

  const [openModal] = useState(props.modalVal);
  const [pathErrorMessage, setPathErrorMessage] = useState("");
  const [nameErrorMessage, setNameErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    userId: user.userId,
    name: "",
    path: "",
    type: "",
    category: "Other",
  });

  async function handleAddDocument(event: any): Promise<void> {
    event.preventDefault();

    if (formData.path === "" && formData.name === "") {
      setPathErrorMessage("Please Upload a File");
      setNameErrorMessage("Please Enter a File Name");
      return;
    } else if (formData.path === "") {
      setPathErrorMessage(
        "Please Upload a File and make sure it is less than 2MB"
      );
      setNameErrorMessage("");
      return;
    } else if (formData.name === "") {
      setNameErrorMessage("Please Enter a File Name");
      setPathErrorMessage("");
      return;
    } else if (
      pathErrorMessage ===
      "Please Upload a File and make sure it is less than 2MB"
    ) {
      return;
    }

    await documentService.createDocument(formData, user.userId);

    props.warningModal();
  }

  function handleOnInputChange(event: any): void {
    if (event.target.id === "path") {
      if (event.target.files[0].size > 1571153) {
        setPathErrorMessage("File size is too large");
        return;
      }
      setPathErrorMessage("");
      
      formData.type = event.target.files[0].type;

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setFormData({
          ...formData,
          [event.target.id]: reader.result,
        });
      });
      reader.readAsDataURL(event.target.files[0]);
    } else {
      setFormData({ ...formData, [event.target.id]: event.target.value });
    }
  }

  return (
    <>
      <Modal
        show={openModal}
        size="lg"
        onClose={() => props.closeModal()}
        popup
        dismissible
        className="dark:bg-darkcards-999"
      >
        <Modal.Header className="dark:bg-darkcards-999" />
        <Modal.Body className="dark:bg-darkcards-999">
          <div className="space-y-6 dark:bg-darkcards-999">
            <p className="text-xl font-nunito border-b pb-2 border-gray-500 font-bold text-gray-900 dark:text-darktext-999 text-center dark:bg-darkcards-999 dark:border-darkborder-999">
              📄 Add Document
            </p>

            <form className="" onSubmit={handleAddDocument}>
              <div className="mb-1 block">
                <Label
                  htmlFor="path"
                  value="Upload File"
                  className="font-normal font-['Nunito'] pl-1
         text-gray-700 text-base peer-placeholder-shown:text-base
          peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 
          peer-focus: peer-focus:text-blue-600 transition-all"
                />
              </div>
              <FileInput
                accept=".pdf, image/jpeg, image/png, image/gif, image/svg+xml"
                required={true}
                id="path"
                className="font-nunito dark:bg-darkinset-999 bg-red-400 rounded-xl"
                onChange={handleOnInputChange}
              />

              <div className="flex ">
                <IoInformationCircleOutline className="mt-[0.3rem] text-gray-500 dark:text-darksubtext-999"></IoInformationCircleOutline>
                <p className="text-gray-500 text-sm mt-1 dark:text-darksubtext-999">
                  Files allowed (jpg, jpeg, gif, png, pdf, svg), Max Size: 1.5MB
                </p>
              </div>

              {/* <div className="mt-2 block">
                <Label htmlFor="name" value="File Name" className="" />
                <TextInput
                  required={true}
                  id="name"
                  className="w-full"
                  onChange={handleOnInputChange}
                />
              </div> */}

              <div
                className="font-normal font-['Nunito']
         text-gray-700 text-base peer-placeholder-shown:text-base
          peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 
          peer-focus: peer-focus:text-blue-600 transition-all "
              >
                <LabelInput
                  required={true}
                  type="text"
                  label="File Name"
                  id="name"
                  placeholder=""
                  onChange={handleOnInputChange}
                ></LabelInput>
              </div>

              <div className="mt-2 pb-1 block ">
                <Label
                  htmlFor="category"
                  value="Category"
                  className="font-normal font-['Nunito'] ml-2
                text-gray-700 text-base peer-placeholder-shown:text-base
                 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 
                 peer-focus: peer-focus:text-blue-600 transition-all"
                />
              </div>
              <Select
                id="category"
                required
                onChange={handleOnInputChange}
                defaultValue={"Other"}
                className="font-normal font-['Nunito'] rounded-xl
                text-gray-700 text-base peer-placeholder-shown:text-base
                 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 
                 peer-focus: peer-focus:text-blue-600 transition-all dark:bg-darkinset-999 "
              >
                <option>Image</option>
                <option>Passport/ID</option>
                <option>Bank Card</option>
                <option>Insurance</option>
                <option>Contract</option>
                <option>Medical</option>
                <option>Legal</option>
                <option>Receipt</option>
                <option>Other</option>
              </Select>

              {nameErrorMessage && (
                <p className="text-red-500 text-s mt-1">{nameErrorMessage}</p>
              )}
              {pathErrorMessage && (
                <p className="text-red-500 text-s mt-1">{pathErrorMessage}</p>
              )}

              <div className="w-full mt-6">
                <AddButton type="submit" value="Save">
                  Add
                </AddButton>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default DocumentModal;
