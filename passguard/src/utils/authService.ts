import bcrypt from "bcryptjs";
import Defaultuserphoto from "../assets/icons/common/DefaultuserPhoto.jpg";

type SignUpData = {
  firstName: string;
  lastName: string;
  email: string;
  masterPassword: string;
  confirmPassword: string;
  picture: string;
};

type LoginData = {
  email: string;
  password: string;
};

export const checkEmail = async (email: string): Promise<boolean> => {
  const user = new Promise((resolve) => {
    window.ipcRenderer.send("findUserByEmailRequest", email);
    window.ipcRenderer.once("findUserByEmailResponse", (event, arg) => {
      const parsedData = JSON.parse(arg);
      resolve(parsedData);
    });
  });

  try {
    const userData: any = await user;

    if (userData) {
      console.log("User already exists");
      return true;
    } else {
      console.log("User does not exist");
      return false;
    }
  } catch (error) {
    console.error("Error during checkEmail:", error);
    return false;
  }
};

export const SignUp = async (data: SignUpData): Promise<any> => {
  const { email, masterPassword, confirmPassword, ...rest } = data;

  const filteredData = {
    data: JSON.stringify({
      firstName: rest.firstName,
      lastName: rest.lastName,
      email: email,
      picture: rest.picture === "" ? Defaultuserphoto : rest.picture,
      phone: "+97450119029",
    }),
    masterPassword: masterPassword,
  };

  try {
    const userData: any = await new Promise((resolve) => {
      window.ipcRenderer.send("findUserByEmailRequest", email);
      window.ipcRenderer.once("findUserByEmailResponse", (event, arg) => {
        if (!arg) {
          resolve(false);
        }
        const parsedData = JSON.parse(arg);
        resolve(parsedData);
      });
    });

    if (userData) {
      console.log("User already exists");
      return -1;
    } else {
      const createdUser: any = await new Promise((resolve) => {
        window.ipcRenderer.send("createUserRequest", filteredData);
        window.ipcRenderer.once("createUserResponse", (event, arg) => {
          const parsedData = JSON.parse(arg);
          resolve(parsedData);
        });
      });
      console.log("Account created successfully!");
      return createdUser;
    }
  } catch (error) {
    console.error("Error during SignUp:", error);
    return -1;
  }
};

export const unlock = async (
  masterPassword: string,
  userId: number
): Promise<any> => {
  const user = new Promise((resolve) => {
    window.ipcRenderer.send("findUserByIdRequest", userId);
    window.ipcRenderer.once("findUserByIdResponse", (event, arg) => {
      const parsedData = JSON.parse(arg);
      resolve(parsedData);
    });
  });

  try {
    const userData: any = await user;

    if (userData) {
      const storedMasterPassword = userData.masterPassword;
      if (bcrypt.compareSync(masterPassword, storedMasterPassword)) {
        return userData; //Unlock successful
      } else {
        return false; //Incorrect password
      }
    } else {
      console.log("User not found");
      return false;
    }
  } catch (error) {
    console.error("Error during unlock:", error);
    return false;
  }
};

export const login = async ({ email, password }: LoginData): Promise<any> => {
  const user = new Promise((resolve) => {
    window.ipcRenderer.send("findUserByEmailRequest", email);
    window.ipcRenderer.once("findUserByEmailResponse", (event, arg) => {
      const parsedData = JSON.parse(arg);
      resolve(parsedData);
    });
  });

  try {
    const userData: any = await user;

    if (userData) {
      const masterPassword = userData.masterPassword;
      if (bcrypt.compareSync(password, masterPassword)) {
        console.log("Login successful!");
        return userData;
      } else {
        console.log("Incorrect password");
        return false;
      }
    } else {
      console.log("User not found");
      return false;
    }
  } catch (error) {
    console.error("Error during login:", error);
    return false;
  }
};
