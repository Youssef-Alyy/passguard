import prisma from "../client";
import { decryptData } from "./Security/Encryption";

let MASTER_PASSWORD: any;

export default class UserQueryService {
	//Add Methods Here for Reading
	//Use this example signature --> async getUsers() {}

	//-------------------------User Model--------------------------------------//
	// Find a user by Id
	async findUserById(userId: any) {
		return prisma.user.findUnique({
			where: { userId: userId },
		});
	}
	// Find a user by Data
	async findUserByUserData(userData: any) {
		return prisma.user.findUnique({
			where: { data: JSON.stringify(userData) },
		});
	}

	// Find a user by Email
	async findUserByEmail(email: any) {
		const users = await prisma.user.findMany();
		for (const user of users) {
			const dd = decryptData(user.data, user.masterPassword);
			if (JSON.parse(dd).email === email) {
				return user;
			}
		}
		return null;
	}

	async getUserDataById(userId: any) {
		const user = await prisma.user.findUnique({
			where: { userId: userId },
			select: {
				data: true,
				masterPassword: true,
			},
		});
		if (!user) return null;
		const data = decryptData(user.data, user.masterPassword);
		return data;
	}

	async getUserPhoneNumberById(userId: any) {
		const data = await this.getUserDataById(userId);
		if (!data) return null;
		return JSON.parse(data).phone;
	}
	async getUserMasterPasswordById(userId: any) {
		const masterPassword = await prisma.user.findUnique({
			where: { userId: userId },
			select: {
				masterPassword: true,
			},
		});
		MASTER_PASSWORD = JSON.stringify(masterPassword);
		return MASTER_PASSWORD;
	}

	// List all users
	async listUsers() {
		return prisma.user.findMany();
	}

	//-------------------------Security Question Model-------------------------//

	// Find a security question by SECURITYQUESTION_ID
	async findSecurityQuestionById(questionId: any) {
		return prisma.securityQuestion.findUnique({
			where: { securityQuestionId: questionId },
		});
	}

	//List All Security Questions for a user id
	async getSecurityQuestionByUserId(userId: any) {
		return prisma.securityQuestion.findFirst({
			where: { userId: userId },
		});
	}

	//-------------------------Credential Model-------------------------//
	//get user credentials by user id
	async getCredentialsByUserId(userId: any) {
		const credentials = await prisma.credential.findMany({
			where: {
				userId: userId,
			},
		});
		//decrypt data
		const masterPassword = await this.getUserMasterPasswordById(userId);
		if (!masterPassword) return null;
		credentials.forEach((element) => {
			element.data = decryptData(element.data, masterPassword);
		});
		return credentials;
	}
	async getAllCurrentCredentials() {
		const credentials = await prisma.credential.findMany({
			where: {
				isTrashed: false,
			},
		});
		credentials.forEach((element) => {
			element.data = decryptData(element.data, MASTER_PASSWORD);
		});
		return credentials;
	}

	//get a credential by credential id
  async getCredentialById(credentialId: any) {
    const credential = await prisma.credential.findUnique({
      where: {
        credentialId: credentialId,
      },
    });
//     if (credential?.credentialId === undefined) {
//       throw new Error("Credential not found");
//   }
		//decrypt data
		if (credential) {
			credential.data = JSON.parse(
				decryptData(credential.data, MASTER_PASSWORD)
			);
		}
		return credential;
	}
	async getDataByCredentialId(credentialId: any) {
		const credential = await prisma.credential.findFirst({
			where: {
				credentialId: credentialId,
			},
			select: {
				data: true,
				userId: true,
			},
		});
		//decrypt data
		if (credential) {
			credential.data = JSON.parse(
				decryptData(credential.data, MASTER_PASSWORD)
			);
		}
		return credential;
	}

	//get credentials by service name
	async getCredentialsByServiceName(serviceName: any) {
		return await prisma.credential.findMany({
			where: {
				serviceName: serviceName,
			},
		});
	}

	//get credentials by service type
	async getCredentialsByServiceType(serviceType: any) {
		return await prisma.credential.findMany({
			where: {
				serviceType: serviceType,
			},
		});
	}

	//get credential by title
	async getCredentialsByTitle(title: any) {
		return await prisma.credential.findMany({
			where: {
				title: title,
			},
		});
	}

	//get credential by URL
	async getCredentialsByUrl(url: any) {
		return await prisma.credential.findMany({
			where: {
				url: url,
			},
		});
	}
	async getTotalCredentialsCountByUserId(userId: number) {
		try {
			const count = await prisma.credential.count({
				where: {
					userId: userId,
					isTrashed: false,
				},
			});
			return count;
		} catch (error) {
			console.error("Error counting credentials", error);
			return 0;
		}
	}

	async getWeakPasswordsCountByUserId(userId: number) {
		try {
			const count = await prisma.credential.count({
				where: {
					userId: userId,
					isWeak: true,
					isTrashed: false,
				},
			});
			return count;
		} catch (error) {
			console.error("Error counting weak password credentials");
			return 0;
		}
	}
	async getOldPasswordsCountByUserId(userId: number) {
		try {
			const count = await prisma.credential.count({
				where: {
					userId: userId,
					isOld: true,
					isTrashed: false,
				},
			});
			return count;
		} catch (error) {
			console.error("Error counting old password credentials");
			return 0;
		}
	}
	async getReusedPasswordsCountByUserId(userId: number) {
		try {
			const count = await prisma.credential.count({
				where: {
					userId: userId,
					isReused: true,
					isTrashed: false,
				},
			});
			return count;
		} catch (error) {
			console.error("Error counting reused password credentials");
			return 0;
		}
	}

	//get credentials with reused passwords
	async getCredentialsWithReusedPasswords() {
		return await prisma.credential.findMany({
			where: {
				isReused: true,
			},
		});
	}

	//get credentials with old passwords
	async getCredentialsWithOldPasswords() {
		return await prisma.credential.findMany({
			where: {
				isOld: true,
			},
		});
	}
	async getTrashedCredentialsByUserId(userId: number) {
		return await prisma.credential.findMany({
			where: {
				userId: userId,
				isTrashed: true,
			},
		});
	}

	//----------------------- Documents Model-------------------------//
	async getDocumentsByUserId(userId: any) {
		const documents = await prisma.document.findMany({
			where: {
				userId: userId,
			},
		});
		const masterPassword = await this.getUserMasterPasswordById(userId);
		//decrypt data
		documents.forEach((element) => {
			element.path = decryptData(element.path, masterPassword);
		});
		return documents;
	}
}
