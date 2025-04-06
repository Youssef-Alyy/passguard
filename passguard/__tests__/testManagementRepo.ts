import UserManagementService from "../repositories/UserManagementService";
import { prismaMock } from "../singleton";

const userManagementService = new UserManagementService();

jest.useFakeTimers({ now: new Date() });
jest.setTimeout(30000);

test("Should Properly Create a New User ", async () => {
	const user = {
		userId: 9,
		masterPassword: "nonofurbusiness369",
		data: JSON.stringify({
			fName: "Essaa",
			lName: "Ahmed",
			email: "ea2004969@qu.edu.qa",
			picture: "C:/Users/Essa/Mypicture.png",
			phone: "66666666",
		}),
		salt: "et52ed",
		dateCreated: new Date(),
		dateUpdated: new Date(),
		lastBackupDate: new Date(),
		preference: JSON.stringify({}),
	};

	prismaMock.user.create.mockResolvedValue(user);

	await expect(userManagementService.createUser(user)).resolves.toEqual({
		userId: 9,
		masterPassword: "nonofurbusiness369",
		data: JSON.stringify({
			fName: "Essaa",
			lName: "Ahmed",
			email: "ea2004969@qu.edu.qa",
			picture: "C:/Users/Essa/Mypicture.png",
			phone: "66666666",
		}),
		salt: "et52ed",
		dateCreated: new Date(),
		dateUpdated: new Date(),
		lastBackupDate: new Date(),
		preference: JSON.stringify({}),
	});
});
test("Should Properly Create a New Credential", async () => {
	const credential = {
		credentialId: 8,
		serviceName: "Blackboard",
		title: "My Blackboard Account",
		data: JSON.stringify({
			userName: "ea2004969",
			password: "nonofurbusiness369",
		}),
		url: "https://elearning.qu.edu.qa/",
		isWeak: true,
		isReused: false,
		isOld: false,
		dateCreated: new Date(),
		dateUpdated: new Date(),
		serviceType: "Education",
		picture: "C:/Users/Essa/Mypicture.png",
		isFavourite: false,
		isTrashed: true,
		dateTrashed: new Date(),
		userId: 9,
	};
	jest
		.spyOn(userManagementService, "userExists")
		.mockResolvedValue(Promise.resolve(true));

	prismaMock.credential.create.mockResolvedValue(credential);

	await expect(
		userManagementService.createCredential(credential)
	).resolves.toEqual({
		credentialId: 8,
		serviceName: "Blackboard",
		title: "My Blackboard Account",
		data: JSON.stringify({
			userName: "ea2004969",
			password: "nonofurbusiness369",
		}),
		url: "https://elearning.qu.edu.qa/",
		isWeak: true,
		isReused: false,
		isOld: false,
		dateCreated: new Date(),
		dateUpdated: new Date(),
		serviceType: "Education",
		picture: "C:/Users/Essa/Mypicture.png",
		isFavourite: false,
		isTrashed: true,
		dateTrashed: new Date(),
		userId: 9,
	});
});

test("Should Properly Throw an Error When Trying to Create a Credential with a Non-Existing User", async () => {
	const nonExistingUserId = 3030; //Non Existing User

	const credential = {
		credentialId: 8,
		serviceName: "Facebook",
		title: "My Facebook Account",
		data: JSON.stringify({
			userName: "ea2004969",
			password: "nonofurbusiness369",
		}),
		url: "https://facebook.com",
		isWeak: true,
		isReused: false,
		isOld: false,
		dateCreated: new Date(),
		dateUpdated: new Date(),
		serviceType: "Social Media",
		picture: "C:/Users/Essa/Mypicture.png",
		isFavourite: false,
		isTrashed: true,
		dateTrashed: new Date(),
		userId: nonExistingUserId,
	};
	jest
		.spyOn(userManagementService, "userExists")
		.mockResolvedValue(Promise.resolve(false));
	prismaMock.credential.create.mockResolvedValue(credential);
	await expect(
		userManagementService.createCredential(credential)
	).rejects.toThrowError("User not found");
});

test("Should Properly Update an Existing Credential", async () => {
	const credentialId = 8;

	const updatedCredentialData = {
		credentialId: credentialId,
		serviceName: "Facebook",
		title: "My Facebook Account",
		data: JSON.stringify({
			userName: "ea2004969",
			password: "newpassword",
		}),
		url: "https://facebook.com",
		isWeak: true,
		isReused: true,
		isOld: false,
		dateCreated: new Date(),
		dateUpdated: new Date(),
		serviceType: "Social Media",
		picture: "C:/Users/Essa/Mypicture.png",
		isFavourite: true,
		isTrashed: true,
		dateTrashed: new Date(),
		userId: 9,
	};
	jest
		.spyOn(userManagementService, "credentialExists")
		.mockResolvedValue(Promise.resolve(true));
	jest
		.spyOn(userManagementService, "checkForReusedPasswordOnUpdate")
		.mockResolvedValue(Promise.resolve(true));
	prismaMock.credential.update.mockResolvedValue(updatedCredentialData);

	const updatedCredential = await userManagementService.updateCredentialById(
		credentialId,
		updatedCredentialData
	);

	expect(updatedCredential).toEqual(updatedCredentialData);
});

test("Should Properly Delete an Existing Credential", async () => {
	const credentialIdToDelete = 8;

	const deletedCredentialData = {
		credentialId: credentialIdToDelete,
		serviceName: "Facebook",
		title: "My Facebook Account",
		data: JSON.stringify({
			userName: "ea2004969",
			password: "newpassword",
		}),
		url: "https://facebook.com",
		isWeak: true,
		isReused: true,
		isOld: false,
		dateCreated: new Date(),
		dateUpdated: new Date(),
		serviceType: "Social Media",
		picture: "C:/Users/Essa/Mypicture.png",
		isFavourite: true,
		isTrashed: true,
		dateTrashed: new Date(),
		userId: 9,
	};

	prismaMock.credential.delete.mockResolvedValue(deletedCredentialData);

	const deletedCredential =
		await userManagementService.deleteCredentialById(credentialIdToDelete);

	expect(deletedCredential.credentialId).toEqual(
		deletedCredentialData.credentialId
	);
});

test("Should Properly Throw an Error When Trying to Update a Non-Existing Credential", async () => {
	const nonExistingCredentialId = 69696;

	const nonExistingCredential = {
		credentialId: nonExistingCredentialId,
		serviceName: "Youtube",
		title: "My Youtube Account",
		data: JSON.stringify({
			userName: "nemesisgames123",
			password: "nonofurbusiness2469",
		}),
		url: "https://youtube.com/",
		isWeak: true,
		isReused: false,
		isOld: false,
		dateCreated: new Date(),
		dateUpdated: new Date(),
		serviceType: "Entertainment",
		picture: "C:/Users/Essa/Mypicture.png",
		isFavourite: false,
		isTrashed: true,
		dateTrashed: new Date(),
		userId: 3,
	};
	jest
		.spyOn(userManagementService, "credentialExists")
		.mockResolvedValue(Promise.resolve(false));
	prismaMock.credential.update.mockResolvedValue(nonExistingCredential);

	await expect(
		userManagementService.updateCredentialById(
			nonExistingCredentialId,
			nonExistingCredential
		)
	).rejects.toThrowError("Credential not found");
});

test("Should Properly Throw an Error When Trying to Delete a Non-Existing Credential", async () => {
	const nonExistingCredentialId = 3000;

	const nonExistingCredential = {
		credentialId: nonExistingCredentialId,
		serviceName: "Youtube",
		title: "My Youtube Account",
		data: JSON.stringify({
			userName: "nemesisgames123",
			password: "nonofurbusiness2469",
		}),
		url: "https://youtube.com/",
		isWeak: true,
		isReused: false,
		isOld: false,
		dateCreated: new Date(),
		dateUpdated: new Date(),
		serviceType: "Entertainment",
		picture: "C:/Users/Essa/Mypicture.png",
		isFavourite: false,
		isTrashed: true,
		dateTrashed: new Date(),
		userId: 3,
	};
	jest
		.spyOn(userManagementService, "credentialExists")
		.mockResolvedValue(Promise.resolve(false));
	prismaMock.credential.delete.mockResolvedValue(nonExistingCredential);

	await expect(
		userManagementService.deleteCredentialById(nonExistingCredentialId)
	).rejects.toThrowError("Credential not found");
});

//--------------SDP-2 Unit-Testing-----------------//
 const user = {
		userId: 3,
		master: "nonofurbusiness369",
		data: JSON.stringify({
			fName: "Essaa",
			lName: "Ahmed",
			email: "",
			picture: "",
			phone: "66666666",
		}),
		salt: "et52ed",
		dateCreated: new Date(),
		dateUpdated: new Date(),
		lastBackupDate: new Date(),
		preference: JSON.stringify({}),
 };

//update user backup date
test("Should Properly Update User Backup Date", async () => {
	const userId = 3;
	const updatedUser = {
		userId: userId,
		masterPassword: "nonofurbusiness369",
		data: JSON.stringify({
			fName: "Essaa",
			lName: "Ahmed",
			email: "",
			picture: "",
			phone: "66666666",
		}),
		salt: "et52ed",
		dateCreated: new Date(),
		dateUpdated: new Date(),
		lastBackupDate: new Date(),
		preference: JSON.stringify({}),
	};
	prismaMock.user.update.mockResolvedValue(updatedUser);
	const result = await userManagementService.updateUserBackupDate(userId);
	expect(result).toEqual(updatedUser);
});

//DOCUMENT Queries
const document = {
	documentId: 1,
	title: "My Document",
	data: JSON.stringify({
		content: "This is my document",
	}),
	userId: 3,
};
//delete document by id
test("Should Properly Delete a Document By Id", async () => {
	const documentId = 1;
	prismaMock.document.delete.mockResolvedValue(document as any);
	const result = await userManagementService.deleteDocumentById(documentId);
	expect(result).toEqual(document);
});
//delete user by id
test("Should Properly Delete a User By Id", async () => {

  prismaMock.user.delete.mockResolvedValue(user as any);
  const result = await userManagementService.deleteUserById(user.userId);
  expect(result).toEqual(user);
});
//update user preference by id
test("Should Properly Update User Preference By Id", async () => {
  const userId = 3;
  const updatedUser = {
    userId: userId,
    masterPassword: "nonofurbusiness369",
    data: JSON.stringify({
      fName: "Essaa",
      lName: "Ahmed",
      email: "",
      picture: "",
      phone: "66666666",
    }),
    salt: "et52ed",
    dateCreated: new Date(),
    dateUpdated: new Date(),
    lastBackupDate: new Date(),
    preference: JSON.stringify({}),
  };
  prismaMock.user.update.mockResolvedValue(updatedUser);
  const result = await userManagementService.updateUserPreferenceById(userId,updatedUser.preference);
  expect(result).toEqual(updatedUser);
});
//trash credential by id
test("Should Properly Trash a Credential By Id", async () => {
  const credentialId = 8;
  const trashedCredential = {
    credentialId: credentialId,
    serviceName: "Facebook",
    title: "My Facebook Account",
    data: JSON.stringify({
      userName: "ea2004969",
      password: "nonofurbusiness369",
    }),
    url: "https://facebook.com",
    isWeak: true,
    isReused: false,
    isOld: false,
    dateCreated: new Date(),
    dateUpdated: new Date(),
    serviceType: "Social Media",
    picture: "C:/Users/Essa/Mypicture.png",
    isFavourite: false,
    isTrashed: true,
    dateTrashed: new Date(),
    userId: 9,
  };
  prismaMock.credential.update.mockResolvedValue(trashedCredential);
  const result = await userManagementService.trashCredentialById(credentialId);
  expect(result).toEqual(trashedCredential);
});
//favorite credential by id
test("Should Properly Favorite a Credential By Id", async () => {
  const credentialId = 8;
  const favoritedCredential = {
    credentialId: credentialId,
    serviceName: "Facebook",
    title: "My Facebook Account",
    data: JSON.stringify({
      userName: "ea2004969",
      password: "nonofurbusiness369",
    }),
    url: "https://facebook.com",
    isWeak: true,
    isReused: false,
    isOld: false,
    dateCreated: new Date(),
    dateUpdated: new Date(),
    serviceType: "Social Media",
    picture: "C:/Users/Essa/Mypicture.png",
    isFavourite: true,
    isTrashed: false,
    dateTrashed: new Date(),
    userId: 9,
  };
  prismaMock.credential.update.mockResolvedValue(favoritedCredential);
  const result = await userManagementService.favoriteCredentialById(credentialId,favoritedCredential.isFavourite);
  expect(result).toEqual(favoritedCredential);
});
//update credential validity by id
test("Should Properly Update Credential Validity By Id", async () => {
  const credentialId = 8;
  const updatedCredential = {
    credentialId: credentialId,
    serviceName: "Facebook",
    title: "My Facebook Account",
    data: JSON.stringify({
      userName: "ea2004969",
      password: "nonofurbusiness369",
    }),
    url: "https://facebook.com",
    isWeak: true,
    isReused: false,
    isOld: true,
    dateCreated: new Date(),
    dateUpdated: new Date(),
    serviceType: "Social Media",
    picture: "C:/Users/Essa/Mypicture.png",
    isFavourite: false,
    isTrashed: false,
    dateTrashed: new Date(),
    userId: 9,
  };
  prismaMock.credential.update.mockResolvedValue(updatedCredential);
  const result = await userManagementService.updateCredentialValidityById(credentialId);
  expect(result).toEqual(updatedCredential);
});
//delete all credentials by user id
test("Should Properly Delete All Credentials By User Id", async () => {
  const userId = 3;
  prismaMock.credential.deleteMany.mockResolvedValue({count: 1});
  const result = await userManagementService.deleteAllCredentialsByUserId(userId);
  expect(result).toEqual({count: 1});
});
//delete all documents by user id
test("Should Properly Delete All Documents By User Id", async () => {
  const userId = 3;
  prismaMock.document.deleteMany.mockResolvedValue({count: 1});
  const result = await userManagementService.deleteAllDocumentsByUserId(userId);
  expect(result).toEqual({count: 1});
});
const securityQuestion = {
  securityQuestionId: 1,
  question: "What is your favorite color?",
  answer: "Blue",
  userId: 3,
};
//delete security question by id
test("Should Properly Delete a Security Question By Id", async () => {
  const questionId = 1;
  prismaMock.securityQuestion.delete.mockResolvedValue(securityQuestion as any);
  const result = await userManagementService.deleteSecurityQuestionById(questionId);
  expect(result).toEqual(securityQuestion);
});
//update security question by id
test("Should Properly Update Security Question By Id", async () => {
  const questionId = 1;
  const updatedSecurityQuestion = {
    securityQuestionId: questionId,
    data: "What is your favorite color?",
    question: "What is your favorite color?",
    answer: "Red",
    userId: 3,
  };
  prismaMock.securityQuestion.update.mockResolvedValue(updatedSecurityQuestion);
  const result = await userManagementService.updateSecurityQuestionById(questionId,updatedSecurityQuestion);
  expect(result).toEqual(updatedSecurityQuestion);
});
