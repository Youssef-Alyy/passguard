import "../App.css";
import "primereact/resources/primereact.css";
import Form from "./Form/Form.tsx";
import Navbar from "./Navbar.tsx";
import Stats from "./Stats.tsx";
import Grid from "./CredentialSection/Grid.tsx";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CredentialData } from "./CredentialSection/Grid.tsx";
import AutoRedirectHook from "./Inactivity/AutoRedirectHook.tsx";
import UserService from "../utils/userService.ts";
import emailjs from "emailjs-com";

const userService = new UserService();

type HomeProps = {
  userUpdated?: any;
};

const Home = (props: HomeProps) => {
  const location = useLocation();

  useEffect(() => {
    window.history.pushState(null, "", "/login");
    window.onpopstate = function () {
      window.history.pushState(null, "", "/login");
    };
  }, []);

  let user = location.state.user;

  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [editInput, setEditInput] = useState(false);
  const [credential, setCredential] = useState<any>([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [forceGridRender, setForceGridRender] = useState(false);
  const [syncStats, setSyncStats] = useState(false);
  const [expanded, setExpanded] = useState(location.state?.expanded);
  const { redirect, setRedirect } = AutoRedirectHook(
    JSON.parse(location.state.user.preference).lockDuration,
    undefined,
    expanded
  );
  const [clipBoardClr, setClipBoardClr] = useState(
    parseInt(JSON.parse(user.preference).clipBoardClr)
  );

  const handleNotifyStats = (): void => {
    console.log("Notifying Stats");
    setSyncStats((syncStats) => !syncStats);
    setForceGridRender((forceGridRender) => !forceGridRender);
  };

  const handleAddClick = () => {
    setCredential({});
    setShowForm(false);
    setEditInput(true);
    // Introduce a delay before setting ShowForm to true
    setTimeout(() => {
      setShowForm(true);
    }, 0); // Adjust the delay time (in milliseconds) according to your needs
  };

  // Callback function to be passed to Grid
  const handleCardClickInApp = (
    credentialData: CredentialData,
    updateClicked: boolean
  ) => {
    setShowForm(false);

    // Introduce a delay before setting ShowForm to true
    setTimeout(() => {
      setShowForm(true);
    }, 0); // Adjust the delay time (in milliseconds) according to your needs
    setCredential(credentialData);
    setEditInput(updateClicked);
  };

  const handleFormBTN = (showForm: boolean) => {
    setShowForm(showForm);
  };

  function handleFormSubmitted(): void {
    setFormSubmitted((formSubmitted) => !formSubmitted);
    setSyncStats((syncStats) => !syncStats);
  }

  function handleForceRender(): void {
    setForceGridRender((forceGridRender) => !forceGridRender);
    setSyncStats((syncStats) => !syncStats);
    setShowForm(false);
  }
  function handleFavoriteRender(): void {
    setForceGridRender((forceGridRender) => !forceGridRender);
  }

  const sendBackupEmail = async (userEmail: any) => {
    const serviceID = "service_3ojecjd";
    const templateID = "template_sgrb5ri";
    const userID = "6igdyzCgketnFP148";

    try {
      const backUpFile = await userService.createBackupDB(user.userId);

      await emailjs.send(
        serviceID,
        templateID,
        {
          to_email: "bike.rider987@gmail.com", // with the recipient's email SHOULD BE WITH USEREMAIL
          file_content: backUpFile, // Base64-encoded file content
        },
        userID
      );

      console.log("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  const checkAndSendBackupEmails = async () => {
    const userPreference = parseInt(JSON.parse(user.preference).backUpDuration);

    if (Number.isNaN(userPreference))
      return console.error("No backups will be sent!");

    const lastBackupDate = new Date(user.lastBackupDate);
    const nextBackupDate: Date = new Date(
      lastBackupDate.getTime() + userPreference * 24 * 60 * 60 * 1000
    );

    if (new Date() >= nextBackupDate) {
      await userService.getUserDataById(user.userId).then(async (data: any) => {
        console.log("Sending backup to :", data.email);
        await sendBackupEmail(data.email);
      });
      const updatedUser = await userService.updateUserBackupDate(user.userId);
      user = updatedUser;
      console.log("User backup date updated successfully!");
    }
  };

  useEffect(() => {
    if (clipBoardClr === 1 || clipBoardClr === 2) {
      const intervalId = setInterval(
        async () => {
          try {
            await navigator.clipboard.writeText("");
            console.log("Clipboard cleared successfully!");
          } catch (error) {
            console.error("Error clearing clipboard:", error);
          }
        },
        clipBoardClr * 60 * 1000
      );
      return () => clearInterval(intervalId);
    }
  }, [clipBoardClr]);

  useEffect(() => {
    checkAndSendBackupEmails();
  }, []);

  function handleGridAreaClick(event: any): void {
    setShowForm(false);
  }

  return (
    <>
      {redirect}
      <div className="app-container h-screen dark:bg-darkbg-999">
        <div className="navbar">
          <Navbar
            isExpanded={location.state.expanded}
            handleExpand={(expanded) => setExpanded(expanded)}
          ></Navbar>
        </div>

        <div className="stats mb-5">
          <Stats sync={syncStats}></Stats>
        </div>

        <div className="form">
          {showForm ? (
            <Form
              onCardClick={handleCardClickInApp}
              userId={user.userId}
              formSubmitted={handleFormSubmitted}
              credentialObj={credential}
              editable={editInput}
              onBTNClick={handleFormBTN}
              forceRender={handleForceRender}
              favoriteRender={() =>
                setForceGridRender((forceGridRender) => !forceGridRender)
              }
            ></Form>
          ) : (
            ""
          )}
        </div>

        <div
          className="credentials overflow-auto ml-4 mt-3"
          onClick={handleGridAreaClick}
        >
          <Grid
            showForm={(val: any) => setShowForm(val)}
            forceRender={forceGridRender}
            userId={user.userId}
            onCardClick={handleCardClickInApp}
            onAddClick={handleAddClick}
            onFormSubmit={formSubmitted}
            notifyStats={handleNotifyStats}
          ></Grid>
        </div>
      </div>
    </>
  );
};

export default Home;
