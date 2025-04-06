import prisma from "../client";
import UserQueryService from "./UserQueryService";
import { encryptData, hashPassword, generateSalt } from "./Security/Encryption";
import * as fs from "fs";
import * as path from "path";
import { PrismaClient } from "@prisma/client";

const userQueryService = new UserQueryService();
export default class UserManagementService {
  //Add Methods Here for Creating, Updating, and Deleting
  //Use this example signature --> async createUser() {}

  //-------------------------User Model-------------------------//
  async importDB(dbPath: any) {
    try {
      console.log("Importing DB...");
      fs.copyFileSync(dbPath, path.join(__dirname, "../prisma/dev.db"));
      return true;
    } catch (error) {
      console.error("Error importing DB", error);
      return false;
    }
  }

  async createBackupDB(userId: any) {
    const originalDBPath = path.join(__dirname, "../prisma/dev.db");
    const copiedDBPath = path.join(__dirname, "../prisma/backup.db");

    try {
      const data = fs.readFileSync(originalDBPath);

      fs.writeFileSync(copiedDBPath, data);

      console.log("Database backup created successfully");
    } catch (error) {
      console.error("Error copying database file:", error);
      return;
    }

    const prismaBackup = new PrismaClient({
      datasources: {
        db: {
          url: "file:" + copiedDBPath,
        },
      },
    });

    try {
      const user = await prismaBackup.user.deleteMany({
        where: { NOT: { userId: userId } },
      });
      console.log("Users in backup database:", user);
    } catch (error) {
      console.error("Error deleting users from backup database:", error);
    } finally {
      await prismaBackup.$disconnect();
    }

    return fs.readFileSync(copiedDBPath).toString("base64");
  }

  async updateUserBackupDate(userId: any) {
    try {
      const updatedUser = await prisma.user.update({
        where: { userId: userId },
        data: { lastBackupDate: new Date() },
      });
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async createDocument(document: any) {
    const masterPassword = await userQueryService.getUserMasterPasswordById(
      document.userId
    );
    const encryptedData = encryptData(document.path, masterPassword);
    try {
      const newDocument = await prisma.document.create({
        data: {
          ...document,
          path: encryptedData,
        },
      });
      return newDocument;
    } catch (error) {
      throw error;
    }
  }

  async deleteDocumentById(documentId: any) {
    try {
      const deletedDocument = await prisma.document.delete({
        where: { documentId: documentId },
      });
      return deletedDocument;
    } catch (error) {
      throw error;
    }
  }
  async checkSecurityAnswer(userData: any, securityAnswer: any) {
    try {
      // Find the user by USER_DATA and include the SECURITYQUESTION
      const user = await prisma.user.findUnique({
        where: { data: userData },
        include: {
          securityquestions: true,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Check if there is a matching security answer
      const matchingSecurityAnswer = user.securityquestions.find(
        (question: { data: any }) => question.data === securityAnswer
      );

      if (!matchingSecurityAnswer) {
        throw new Error("Incorrect security question answer");
      }

      return user; // Return the user if the answer is correct
    } catch (error) {
      throw error;
    }
  }

  async login(userData: any, securityAnswer: any) {
    try {
      // Find the user by USER_DATA and include the SECURITYQUESTION
      const user = await prisma.user.findUnique({
        where: { data: userData },
        include: {
          securityquestions: true,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Check if there is a matching security answer
      const matchingSecurityAnswer = user.securityquestions.find(
        (question: { data: any }) => question.data === securityAnswer
      );

      if (!matchingSecurityAnswer) {
        throw new Error("Incorrect security question answer");
      }

      return user; // Return the user if the answer is correct
    } catch (error) {
      throw error;
    }
  }

  async createUser(user: any) {
    try {
      const salt = generateSalt();
      const hashedPassword = await hashPassword(user.masterPassword, salt);
      const encryptedData = encryptData(user.data, hashedPassword);
      const preference = JSON.stringify({
        trashDuration: "2",
        lockDuration: "5",
        theme: "light",
        loginOtp: "email",
        forgetPassOtp: "email",
        backUpDuration: "none",
        clipBoardClr: "none",
      });

      const newUser = await prisma.user.create({
        data: {
          ...user,
          data: encryptedData,
          masterPassword: hashedPassword,
          salt: salt,
          preference: preference,
        },
      });
      return newUser;
    } catch (error) {
      console.error("Error creating user", error);
      throw error;
    }
  }

  async deleteUserById(userId: any) {
    try {
      const deletedUser = await prisma.user.delete({
        where: { userId: userId },
      });
      return deletedUser;
    } catch (error) {
      throw error;
    }
  }

  async updateUserById(userId: any, data: any) {
    try {
      return await prisma.user.update({
        where: { userId: userId },
        data: {
          data: encryptData(data.data, data.masterPassword),
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async updateUserPreferenceById(userId: any, preference: any) {
    try {
      const updatedUser = await prisma.user.update({
        where: { userId: userId },
        data: {
          preference: preference,
        },
      });
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async updateUserMasterPassword(
    userId: any,
    salt: any,
    newMasterPassword: any
  ) {
    let updatedUser = null;
    const hashedPassword = await hashPassword(newMasterPassword, salt);

    const data = {
      data: await userQueryService.getUserDataById(userId),
      masterPassword: hashedPassword,
    };
    await this.updateUserById(userId, data);

    const oldCredentialsDEC =
      await userQueryService.getCredentialsByUserId(userId);
    if (!oldCredentialsDEC) return null;

    const oldDocumentsDEC = await userQueryService.getDocumentsByUserId(userId);
    if (!oldDocumentsDEC) return null;

    try {
      updatedUser = await prisma.user.update({
        where: { userId: userId },
        data: {
          masterPassword: hashedPassword,
        },
      });
    } catch (error) {
      throw error;
    }

    const newMasterPasswordObj =
      await userQueryService.getUserMasterPasswordById(userId);

    oldCredentialsDEC.forEach((element) => {
      //Encryping and updating the data field in user table
      element.data = encryptData(element.data, newMasterPasswordObj);
    });
    for (const cred of oldCredentialsDEC) {
      await prisma.credential.update({
        where: { credentialId: cred.credentialId },
        data: {
          data: cred.data,
        },
      });
    }

    oldDocumentsDEC.forEach((element) => {
      element.path = encryptData(element.path, newMasterPasswordObj);
    });
    for (const doc of oldDocumentsDEC) {
      await prisma.document.update({
        where: { documentId: doc.documentId },
        data: {
          path: doc.path,
        },
      });
    }

    return updatedUser;
  }
  async userExists(userId: any) {
    if ((await userQueryService.findUserById(userId)) == null) return false;
    return true;
  }
  async credentialExists(credentialId: any) {
    if ((await userQueryService.getCredentialById(credentialId)) == null)
      return false;
    return true;
  }
  //-------------------------Credential Model-------------------------//
  async createCredential(credential: any) {
    if (!(await this.userExists(credential.userId)))
      throw new Error("User not found");
    //need to take user id here
    const isReused = await this.checkForReusedPasswordOnCreation(credential); //pass userid and credential
    const masterPassword = await userQueryService.getUserMasterPasswordById(
      credential.userId
    );
    const encryptedData = encryptData(credential.data, masterPassword);
    if (isReused) {
      credential.isReused = true;
    }
    try {
      const newCredential = await prisma.credential.create({
        data: {
          ...credential,
          data: encryptedData,
        },
      });
      return newCredential;
    } catch (error) {
      throw error;
    }
  }
  async trashCredentialById(credentialId: number) {
    await this.checkForReusedPasswordOnDeletion(credentialId);
    try {
      const trashedCredential = await prisma.credential.update({
        where: { credentialId: credentialId },
        data: {
          credentialId: credentialId,
          isTrashed: true,
          dateTrashed: new Date().toISOString(),
        },
      });
      return trashedCredential;
    } catch (error) {
      throw error;
    }
  }
  async favoriteCredentialById(credentialId: number, isFavorited: boolean) {
    try {
      const favoritedCredential = await prisma.credential.update({
        where: { credentialId: credentialId },
        data: {
          isFavourite: isFavorited,
        },
      });
      return favoritedCredential;
    } catch (error) {
      throw error;
    }
  }
  async recoverCredentialById(credentialId: number) {
    const recoveredCredential =
      await userQueryService.getCredentialById(credentialId);
    const preparedCredential = { ...recoveredCredential };
    preparedCredential.data = JSON.stringify(preparedCredential.data);
    const isReused =
      await this.checkForReusedPasswordOnCreation(preparedCredential);
    if (isReused) {
      await prisma.credential.update({
        where: { credentialId: credentialId },
        data: { isReused: true, isTrashed: false },
      });
    } else {
      try {
        const recoveredCredential = await prisma.credential.update({
          where: { credentialId: credentialId },
          data: { isTrashed: false, isReused: false },
        });
        return recoveredCredential;
      } catch (error) {
        throw error;
      }
    }
  }
  async deleteCredentialById(credentialId: number) {
    if (!(await this.credentialExists(credentialId)))
      throw new Error("Credential not found");
    await this.checkForReusedPasswordOnDeletion(credentialId);
    try {
      const deletedCredential = await prisma.credential.delete({
        where: { credentialId: credentialId },
      });
      console.log("credential deleted....");
      return deletedCredential;
    } catch (error) {
      throw error;
    }
  }

  async updateCredentialById(credentialId: any, credential: any) {
    if (!(await this.credentialExists(credentialId)))
      throw new Error("Credential not found");
    const stillReused = await this.checkForReusedPasswordOnUpdate(credential);
    const masterPassword = await userQueryService.getUserMasterPasswordById(
      credential.userId
    );
    const encryptedData = encryptData(credential.data, masterPassword);
    try {
      const updatedCredential = await prisma.credential.update({
        where: { credentialId: credentialId },
        data: {
          ...credential,
          data: encryptedData,
          isReused: stillReused,
        },
      });
      console.log("credential updated....");
      return updatedCredential;
    } catch (error) {
      console.error("Error updating credential", error);
    }
  }
  async updateCredentialValidityById(credentialId: any) {
    try {
      const updatedCredential = await prisma.credential.update({
        where: { credentialId: credentialId },
        data: { isOld: true },
      });
      // Ensure that updatedCredential is a valid object
      if (updatedCredential && typeof updatedCredential === "object") {
        return updatedCredential;
      } else {
        console.error("Invalid response from database:", updatedCredential);
        // Handle the invalid response appropriately
      }
    } catch (error) {
      console.error("Error updating credentials' validity", error);
    }
  }
  async deleteAllCredentialsByUserId(userId: any) {
    try {
      const deletedCredentials = await prisma.credential.deleteMany({
        where: { userId: userId },
      });
      return deletedCredentials;
    } catch (error) {
      throw error;
    }
  }
  async deleteAllDocumentsByUserId(userId: any) {
    try {
      const deletedDocuments = await prisma.document.deleteMany({
        where: { userId: userId },
      });
      return deletedDocuments;
    } catch (error) {
      throw error;
    }
  }

  //-------------------------Security Question Model-------------------------//
  async createSecurityQuestion(
    userId: any,
    salt: any,
    securityQuestionObj: any
  ) {
    try {
      securityQuestionObj.firstQuestionAnswer = await hashPassword(
        securityQuestionObj.firstQuestionAnswer,
        salt
      );
      securityQuestionObj.secondQuestionAnswer = await hashPassword(
        securityQuestionObj.secondQuestionAnswer,
        salt
      );
      const newSecurityQuestion = await prisma.securityQuestion.create({
        data: {
          userId: userId,
          data: JSON.stringify(securityQuestionObj),
        },
      });
      return newSecurityQuestion;
    } catch (error) {
      throw error;
    }
  }

  async deleteSecurityQuestionById(securityQuestionId: any) {
    try {
      const deletedSecurityQuestion = await prisma.securityQuestion.delete({
        where: { securityQuestionId: securityQuestionId },
      });
      return deletedSecurityQuestion;
    } catch (error) {
      throw error;
    }
  }

  async updateSecurityQuestionById(
    securityQuestionId: any,
    securityQuestion: any
  ) {
    try {
      const updatedSecurityQuestion = await prisma.securityQuestion.update({
        where: { securityQuestionId: securityQuestionId },
        data: securityQuestion,
      });
      return updatedSecurityQuestion;
    } catch (error) {
      throw error;
    }
  }

  async checkForReusedPasswordOnCreation(credential?: any) {
    const password = JSON.parse(credential.data).password;
    const allCredentials = await userQueryService.getCredentialsByUserId(
      credential.userId
    );
    const existingCredentials = allCredentials?.filter((cred) => {
      if (!cred.isTrashed) {
        const credData = JSON.parse(cred.data);
        return credData.password === password;
      }
    });
    if (existingCredentials != null)
      if (existingCredentials.length > 0) {
        for (const cred of existingCredentials) {
          await prisma.credential.update({
            where: { credentialId: cred.credentialId },
            data: { isReused: true },
          });
        }
        return true;
      }
    return false;
  }
  async checkForReusedPasswordOnDeletion(credentialId: any) {
    const data = await userQueryService.getDataByCredentialId(credentialId);
    if (!data) return;
    const password = JSON.parse(JSON.stringify(data.data)).password;
    const userId = await userQueryService
      .getCredentialById(credentialId)
      .then((cred) => cred?.userId);
    console.log("userId", userId);
    const allCredentials =
      await userQueryService.getCredentialsByUserId(userId);
    const existingCredentials = allCredentials?.filter((cred) => {
      if (!cred.isTrashed) {
        const credData = JSON.parse(cred.data);
        return credData.password === password;
      }
    });
    console.log("existingCredentials", existingCredentials);
    if (existingCredentials != null)
      if (existingCredentials.length == 2) {
        // 2 because the one being deleted is also included
        for (const cred of existingCredentials) {
          await prisma.credential.update({
            where: { credentialId: cred.credentialId },
            data: { isReused: false },
          });
        }
      }
  }
  async checkForReusedPasswordOnUpdate(credential: any) {
    const newPassword = JSON.parse(credential.data).password; // new password
    const isChanged = await this.isPasswordChanged(
      credential.credentialId,
      newPassword
    );
    if (!isChanged) {
      // console.log("Password not changed");
      return;
    }
    //Check if old password was reused
    const allCredentials = await userQueryService.getCredentialsByUserId(
      credential.userId
    );
    // console.log("new pass: ", newPassword);
    await this.isOldPasswordReused(credential.credentialId, allCredentials);

    const stillReused = await this.checkForReusedPasswordOnCreation(credential); // check if new password is still reused
    if (stillReused) {
      // console.log("Password still reused");
      return true;
    } else {
      // console.log("Password not reused");
      return false;
    }
  }
  async isPasswordChanged(credentialId: any, newPassword: any) {
    const oldData = await userQueryService.getDataByCredentialId(credentialId);
    // console.log("old data", oldData);
    const oldPassword = JSON.parse(JSON.stringify(oldData?.data)).password;
    // console.log("old pass", oldPassword);
    // console.log("new pass", newPassword);
    if (oldPassword === newPassword) {
      return false;
    }
    return true;
  }

  async isOldPasswordReused(credentialId: any, allCredentials: any) {
    // next checking which credentials had the old password and updating them accordingly
    const oldData = await userQueryService.getDataByCredentialId(credentialId);
    const oldPassword = JSON.parse(JSON.stringify(oldData?.data)).password;
    // console.log("old pass", oldPassword);
    const existingCredentials = allCredentials.filter((cred: any) => {
      const credData = JSON.parse(cred.data);
      return credData.password === oldPassword;
    });
    if (existingCredentials.length == 2) {
      // 2 because the one being updated is also included
      for (const cred of existingCredentials) {
        // console.log(
        // 	"exactly one other credential with old pass found",
        // 	cred.credentialId
        // );
        await prisma.credential.update({
          where: {
            credentialId: cred.credentialId,
          },
          data: { isReused: false },
        });
      }
    }
  }
  
}
