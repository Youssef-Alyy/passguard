import "./grid.css";
import { useState, useEffect } from "react";
import Card from "./Card";
import CredentialService from "../../utils/credentialService";
import { serviceNames } from "../../data/dropdownItems";
import AddButton from "../Form/AddButton";
import {
  Dropdown,
  Label,
  Modal,
  TextInput,
  Toast,
  Tooltip,
} from "flowbite-react";
import { FaHeart, FaTrash } from "react-icons/fa";
import { CiCircleAlert } from "react-icons/ci";
import { SlGrid } from "react-icons/sl";
import { HiX } from "react-icons/hi";
import { HiCheck } from "react-icons/hi2";
import { useLocation } from "react-router-dom";
import emailjs from "emailjs-com";
import UserService from "../../utils/userService";
import { AiTwotoneMail } from "react-icons/ai";
import LabelInput from "../Form/LabelInput";
import Button from "../Form/Button";
import SecurityQuestion from "../SecurityQuestion/SecurityQuestion";

const credentialService = new CredentialService();
export interface CredentialData {
  title: string;
  credentialId: string;
  credentialTitle: string;
  credentialUsername: string;
  data: {
    userName: string;
    password: string;
  };
  dateCreated: string;
  dateUpdated: string;
  url: string;
  serviceName: string;
  picture: string;
}
type GridProps = {
  userId: number;
  forceRender: boolean;
  onCardClick: (credentialData: CredentialData, updateClicked: boolean) => void;
  onAddClick: () => void;
  onFormSubmit: boolean;
  notifyStats: () => void;
  showForm: (e: any) => void;
};

const Grid = (props: GridProps) => {
  const location = useLocation();
  const trashDuration = JSON.parse(
    location.state.user.preference
  ).trashDuration;

  const [currentCredentials, setCurrentCredentials] = useState<any>([]);
  const [filteredCondition, setFilteredCondition] = useState<string>(
    "(item) => !item.isTrashed"
  );
  const [credentialsTitle, setCredentialsTitle] =
    useState<string>("My Credentials");
  const [sync, setSync] = useState<boolean>(false);
  const [showDeleteToast, setShowDeleteToast] = useState<boolean>(false);
  const [showRecoverToast, setShowRecoverToast] = useState<boolean>(false);
  const [showPermanentRemoveToast, setShowPermanentRemoveToast] =
    useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [recipient, setRecipient] = useState<string>("");
  const [dataShared, setDataShared] = useState<any>({});
  const [secQuestionModal, setSecQuestionModal] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<any>();
  const [secQuestionsVerified, setSecQuestionsVerified] =
    useState<boolean>(false);
  const [showSentToast, setShowSentToast] = useState<boolean>(false);

  const handleCardClick = (
    credentialData: CredentialData,
    updateClicked: boolean
  ) => {
    props.onCardClick(credentialData, updateClicked);
  };

  const handleShareClick = (credentialData: CredentialData) => {
    const data = {
      title: credentialData.title,
      data: JSON.parse(JSON.parse(JSON.stringify(credentialData.data))),
      url: credentialData.url,
      serviceName: credentialData.serviceName,
      picture: credentialData.picture,
    };
    setOpenModal(true);
    setDataShared(data);
  };

  const sendSharedCredential = async (
    credentialData: any,
    recipient: string
  ) => {
    const userService = new UserService();
    const firstName = await userService
      .getUserDataById(props.userId)
      .then((data: any) => {
        return data.firstName;
      });
    try {
      const templateParams = {
        from_name: firstName,
        to_email: recipient,
        credential_title: credentialData.title,
        credential_username: credentialData.data.userName,
        credential_password: credentialData.data.password,
        credential_url: credentialData.url,
        credential_service: credentialData.serviceName,
      };
      setTimeout(async () => {
        await emailjs.send(
          "service_3ojecjd",
          "template_v5syq9y",
          templateParams,
          "6igdyzCgketnFP148"
        );
        console.log("Email sent successfully!");
      }, 500);
      setShowSentToast(true);
      setTimeout(() => {
        setShowSentToast(false);
      }, 3000);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  const handleDeleteClick = (credentialId: number) => {
    credentialService.trashCredentialById(credentialId);
    setShowDeleteToast(true);

    setTimeout(() => {
      setShowDeleteToast(false);
    }, 3000);

    const updatedCredentials = currentCredentials.map((item: any) => {
      if (item.credentialId === credentialId) {
        item.isTrashed = true;
      }
      return item;
    });
    setCurrentCredentials(updatedCredentials);
    setSync((sync) => !sync);
    console.log("Syncing", sync);
    props.notifyStats();
    props.showForm(false);
  };

  const handlePermanentRemoveClick = async (credentialId: number) => {
    await credentialService.deleteCredential(credentialId);
    setShowPermanentRemoveToast(true);
    setTimeout(() => {
      setShowPermanentRemoveToast(false);
    }, 3000);
    const updatedCredentials = currentCredentials.filter((item: any) => {
      return item.credentialId !== credentialId;
    });
    setCurrentCredentials(updatedCredentials);
  };

  const handleRecoverClick = (credentialId: number) => {
    credentialService.recoverCredentialById(credentialId);
    setShowRecoverToast(true);
    setTimeout(() => {
      setShowRecoverToast(false);
    }, 3000);
    const updatedCredentials = currentCredentials.map((item: any) => {
      if (item.credentialId === credentialId) {
        item.isTrashed = false;
      }
      return item;
    });
    setCurrentCredentials(updatedCredentials);
    props.notifyStats();
    props.showForm(false);
  };

  const handleSearch = () => {
    const input = document.getElementById("searchInput");
    if (input) {
      input.addEventListener("keyup", (e) => {
        const inputElement = e.target as HTMLInputElement;
        const searchString = inputElement.value.toLowerCase();
        const filteredCredentials = currentCredentials.filter(
          (credential: any) => {
            return credential.title.toLowerCase().includes(searchString);
          }
        );
        setCurrentCredentials(filteredCredentials);
      });
    }
  };

  const handleFilterChange = (value: any) => {
    const filter = value;
    let filterCondition;

    if (filter === "current") {
      filterCondition = "(item) => !item.isTrashed";
      setCredentialsTitle("My Credentials");
    } else if (filter === "favorite") {
      filterCondition = "(item) => !item.isTrashed && item.isFavourite";
      setCredentialsTitle("Favorite Credentials");
    } else if (filter === "weak") {
      filterCondition = "(item) => !item.isTrashed && item.isWeak";
      setCredentialsTitle("Weak Passwords");
    } else if (filter === "old") {
      filterCondition = "(item) => !item.isTrashed && item.isOld";
      setCredentialsTitle("Old Passwords");
    } else if (filter === "reused") {
      filterCondition = "(item) => !item.isTrashed && item.isReused";
      setCredentialsTitle("Reused Passwords");
    } else if (filter === "strong") {
      filterCondition =
        "(item) => !item.isTrashed && !item.isWeak && !item.isOld && !item.isReused";
      setCredentialsTitle("Strong Passwords");
    } else if (filter === "trash") {
      filterCondition = "(item) => item.isTrashed";
      setCredentialsTitle("Trashed Credentials");
    } else {
      filterCondition = "() => true";
    }
    setFilteredCondition(filterCondition);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setTimeout(async () => {
          const result = await credentialService.findCredentialsByUserId(
            props.userId
          );
          setCurrentCredentials(result);
        }, 100);
        await credentialService.checkTrashStatus(props.userId, trashDuration);
      } catch (error) {
        console.error("Error fetching credentials:", error);
      }
    };
    fetchData();
    return () => {
      window.ipcRenderer.removeAllListeners("findCredentialsByIdResponse");
    };
  }, [props.onFormSubmit, filteredCondition, sync, props.forceRender]);

  const credentialsLength = currentCredentials.filter(
    eval(filteredCondition)
  ).length;

  const injectCard = () => {
    return currentCredentials
      .filter(eval(filteredCondition))
      .map((item: any, index: any) => (
        <Card
          onClick={() => handleCardClick(item, false)}
          onUpdateClick={() => handleCardClick(item, true)}
          onShareClick={() => handleShareClick(item)}
          onDeleteClick={() => handleDeleteClick(item.credentialId)}
          onRecoverClick={() => handleRecoverClick(item.credentialId)}
          onPermanentRemoveClick={() =>
            handlePermanentRemoveClick(item.credentialId)
          }
          key={index}
          index={index}
          id={item.credentialId.toString()}
          title={item.title}
          username={JSON.parse(item.data).userName}
          dateCreated={item.dateCreated.toString().slice(0, 10)}
          dateUpdated={item.dateUpdated.toString().slice(0, 10)}
          isWeak={item.isWeak}
          isOld={item.isOld}
          isReused={item.isReused}
          isTrashed={item.isTrashed}
          picture={
            serviceNames.find(
              (service: any) => service.name === item.serviceName
            )?.card || serviceNames[serviceNames.length - 1].card
          }
        ></Card>
      ));
  };

  const handleSecQuestionSubmit = () => {
    setSecQuestionModal(false);
    sendSharedCredential(dataShared, emailInput);
  };

  const handleSubmitForm = (e: any) => {
    e.preventDefault();
    const emailInput = document.getElementById("email") as HTMLInputElement;
    setEmailInput(emailInput.value);
    setOpenModal(false);
    setSecQuestionModal(true);
  };

  return (
    <>
      <div className="sticky top-0 bg-neutral-100 z-10 flex items-center justify-start p-4 gap-3 dark:bg-darkbg-999 dark:text-darktext-999">
        <h3 className="text-xl font-medium w-56">
          {credentialsTitle} ({credentialsLength})
        </h3>
        <div>
          <div id="search-container" className="relative w-80 ">
            <input
              id="searchInput"
              type="text"
              placeholder="Search"
              className="font-nunito ml-2 w-full h-8 p-4 text-s rounded-xl border-2 transition-all duration-300 shadow-md focus:shadow-lg focus:outline-none focus:border-blue-600 dark:bg-darkinset-999 dark:border-darkborder-999"
              onClick={handleSearch}
            />
          </div>
        </div>
        <div id="filter-container" className="m-1">
          <Dropdown label={credentialsTitle} dismissOnClick={true} color="dark">
            <Dropdown.Item
              value={"current"}
              icon={SlGrid}
              onClick={() => handleFilterChange("current")}
            >
              My Credentials
            </Dropdown.Item>
            <Dropdown.Item
              value={"favorite"}
              icon={FaHeart}
              onClick={() => handleFilterChange("favorite")}
              className="text-green-500"
            >
              Favorite Credentials
            </Dropdown.Item>
            <Dropdown.Item
              value={"weak"}
              icon={CiCircleAlert}
              onClick={() => handleFilterChange("weak")}
              className="text-red-500"
            >
              Weak Passwords
            </Dropdown.Item>
            <Dropdown.Item
              value={"reused"}
              icon={CiCircleAlert}
              onClick={() => handleFilterChange("reused")}
              className="text-blue-500"
            >
              Reused Passwords
            </Dropdown.Item>
            <Dropdown.Item
              value={"old"}
              icon={CiCircleAlert}
              onClick={() => handleFilterChange("old")}
              className="text-purple-500"
            >
              Old Passwords
            </Dropdown.Item>
            <Dropdown.Item
              value={"trash"}
              icon={FaTrash}
              onClick={() => handleFilterChange("trash")}
            >
              Trash
            </Dropdown.Item>
          </Dropdown>
        </div>
        <Tooltip content="Add a Credential" placement="bottom">
          <AddButton onClick={props.onAddClick}></AddButton>
        </Tooltip>

        <div className="absolute left-[52rem]">
          {showDeleteToast && (
            <Toast>
              <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                <FaTrash className="h-5 w-5" />
              </div>
              <div className="ml-3 text-sm font-normal">
                Credential has been Trashed.
              </div>
              <Toast.Toggle />
            </Toast>
          )}
        </div>

        <div className="absolute left-[53rem]">
          {showPermanentRemoveToast && (
            <Toast>
              <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                <HiX className="h-5 w-5" />
              </div>
              <div className="ml-3 text-sm font-normal">
                Credential permenantly removed.
              </div>
              <Toast.Toggle />
            </Toast>
          )}
        </div>
        <div className="absolute left-[53rem]">
          {showSentToast && (
            <Toast>
              <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                <HiCheck className="h-5 w-5" />
              </div>
              <div className="ml-3 text-sm font-normal">
                Credential sent successfully.
              </div>
              <Toast.Toggle />
            </Toast>
          )}
        </div>
        <div className="absolute left-[53rem]">
          {showRecoverToast && (
            <Toast>
              <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                <HiCheck className="h-5 w-5" />
              </div>
              <div className="ml-3 text-sm font-normal">
                Credential recovered.
              </div>
              <Toast.Toggle />
            </Toast>
          )}
        </div>
      </div>
      <div className="cards p-3 gap-5">{injectCard()}</div>

      <Modal
        show={openModal}
        size="md"
        onClose={() => closeModal()}
        popup
        dismissible
      >
        <Modal.Header className="dark:bg-darkcards-999" />
        <Modal.Body className="dark:bg-darkcards-999">
          <div className="flex items-center justify-center p-1">
            <AiTwotoneMail className="text-2xl dark:text-darksubtext-999" />
            <h3 className="text-2xl p-2 font-nunito font-bold text-gray-900 dark:text-white text-center">
              Share Credential
            </h3>
          </div>

          <form onSubmit={handleSubmitForm}>
            <div className="mb-1 block">
              <LabelInput
                id="email"
                placeholder=""
                label="Recipient Email"
                type="email"
                required={true}
              ></LabelInput>
            </div>

            <div className="mt-6">
              <Button type="submit" value="GenPass">
                Continue
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {secQuestionModal && (
        <SecurityQuestion
          fromLoc={"shareCredential"}
          openModal={true}
          secQuestionsVerified={handleSecQuestionSubmit}
          closeModal={() => setSecQuestionModal(false)}
        />
      )}
    </>
  );
};

export default Grid;
