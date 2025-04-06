import bcrypt from "bcryptjs";

export default class UserService {
  async getUserDataById(userId: number) {
    try {
      return new Promise((resolve) => {
        window.ipcRenderer.send("getUserDataByIdRequest", userId);
        window.ipcRenderer.once("getUserDataByIdResponse", (event, arg) => {
          const parsedData = JSON.parse(JSON.parse(arg));
          resolve(parsedData);
        });
      });
    } catch (error) {
      console.error("Error getting user data", error);
      return {};
    }
  }
  async findUserByEmail(email: string) {
    try {
      return new Promise((resolve) => {
        window.ipcRenderer.send("findUserByEmailRequest", email);
        window.ipcRenderer.once("findUserByEmailResponse", (event, arg) => {
          const parsedData = JSON.parse(arg);
          resolve(parsedData);
        });
      });
    } catch (error) {
      console.error("Error finding user by email", error);
      return {};
    }
  }
  async sendSMS(userId: number, otp: string) {
    console.log("sendSMS: ", { userId, otp });
    window.ipcRenderer.send("sendSMS", { userId, otp });
  }

  async updateUser(
    userId: number,
    data: any,
    salt: string,
    masterPassword: string
  ) {
    try {
      const dataObj = {
        userId: userId,
        salt: salt,
        masterPassword: masterPassword,
        data: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          picture: data.picture,
          phone: "+97450119029",
        }),
      };

      return new Promise((resolve) => {
        window.ipcRenderer.send("updateUserRequest", dataObj);
        window.ipcRenderer.once("updateUserResponse", (event, arg) => {
          const parsedData = JSON.parse(arg);
          resolve(parsedData);
        });
      });
    } catch (error) {
      console.error("Error updating user", error);
      return {};
    }
  }

  async updateUserMasterPassword(
    userId: any,
    salt: any,
    newMasterPassword: any
  ) {
    try {
      const dataObj = {
        userId: userId,
        salt: salt,
        newMasterPassword: newMasterPassword,
      };

      return new Promise((resolve) => {
        window.ipcRenderer.send("updateUserMasterPasswordRequest", dataObj);
        window.ipcRenderer.once(
          "updateUserMasterPasswordResponse",
          (event, arg) => {
            const parsedData = JSON.parse(arg);
            resolve(parsedData);
          }
        );
      });
    } catch (error) {
      console.error("Error updating user master password", error);
      return {};
    }
  }

  async deleteUser(userId: number) {
    try {
      return new Promise((resolve) => {
        window.ipcRenderer.send("deleteUserRequest", userId);
        window.ipcRenderer.once("deleteUserResponse", (event, arg) => {
          const parsedData = JSON.parse(arg);
          console.log("parsedData", parsedData);
          resolve(parsedData);
        });
      });
    } catch (error) {
      console.error("Error deleting user", error);
      return {};
    }
  }

  async updateUserPreference(userId: number, preferences: any) {
    try {
      const dataObj = {
        userId: userId,
        preference: JSON.stringify(preferences),
      };

      return new Promise((resolve) => {
        window.ipcRenderer.send("updateUserPreferenceRequest", dataObj);
        window.ipcRenderer.once(
          "updateUserPreferenceResponse",
          (event, arg) => {
            const parsedData = JSON.parse(arg);
            resolve(parsedData);
          }
        );
      });
    } catch (error) {
      console.error("Error changing user preferences", error);
      return {};
    }
  }

  async createQuestion(userId: number, salt: any, secQuestionObj: any) {
    try {
      const dataObj = {
        userId: userId,
        salt: salt,
        secQuestionObj: secQuestionObj,
      };

      return new Promise((resolve) => {
        window.ipcRenderer.send("createQuestionRequest", dataObj);
        window.ipcRenderer.once("createQuestionResponse", (event, arg) => {
          const parsedData = JSON.parse(arg);
          resolve(parsedData);
        });
      });
    } catch (error) {
      console.error("Error creating question", error);
      return {};
    }
  }

  async findSecurityQuestionByUserId(userId: any) {
    try {
      return new Promise((resolve) => {
        window.ipcRenderer.send("getSecurityQuestionByUserIdRequest", userId);
        window.ipcRenderer.once(
          "getSecurityQuestionByUserIdResponse",
          (event, arg) => {
            const parsedData = JSON.parse(arg);
            resolve(parsedData);
          }
        );
      });
    } catch (error) {
      console.error("Error finding user's security question", error);
      return {};
    }
  }

  async verifySecQuestionAnswers(
    userId: number,
    firstQuestionAnswer: any,
    secondQuestionAnswer: any
  ) {
    try {
      const userSecurityQuestion: any =
        await this.findSecurityQuestionByUserId(userId);
      const data = JSON.parse(userSecurityQuestion.data);

      if (
        bcrypt.compareSync(firstQuestionAnswer, data.firstQuestionAnswer) &&
        bcrypt.compareSync(secondQuestionAnswer, data.secondQuestionAnswer)
      ) {
        return data; //Unlock successful
      } else {
        return null; //Incorrect password
      }
    } catch (error) {
      console.error("Error verifying security answers", error);
      return false;
    }
  }

  async updateUserBackupDate(userId: number) {
    try {
      return new Promise((resolve) => {
        window.ipcRenderer.send("updateUserBackupDateRequest", userId);
        window.ipcRenderer.once(
          "updateUserBackupDateResponse",
          (event, arg) => {
            const parsedData = JSON.parse(arg);
            resolve(parsedData);
          }
        );
      });
    } catch (error) {
      console.error("Error updating user backup date", error);
      return {};
    }
  }

  async createBackupDB(userId: number) {
    try {
      return new Promise((resolve) => {
        window.ipcRenderer.send("createBackupDBRequest", userId);
        window.ipcRenderer.once("createBackupDBResponse", (event, arg) => {
          const parsedData = JSON.parse(arg);
          resolve(parsedData);
        });
      });
    } catch (error) {
      console.error("Error creating backup DB", error);
      return {};
    }
  }
}
