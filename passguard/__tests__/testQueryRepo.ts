import UserQueryService from "../repositories/UserQueryService";
import { prismaMock } from "../singleton";

const userQueryService = new UserQueryService();

test("Should Properly Find a User By Id", async () => {
	const userIdToFind = 3;

	const existingUser = {
		userId: userIdToFind,
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

	prismaMock.user.findUnique.mockResolvedValue(existingUser);

	const foundUser = await userQueryService.findUserById(userIdToFind);

	expect(foundUser).toMatchObject({
		userId: userIdToFind,
		masterPassword: existingUser.masterPassword,
		data: existingUser.data,
		salt: existingUser.salt,
		dateCreated: expect.any(Date),
		dateUpdated: expect.any(Date),
		lastBackupDate: expect.any(Date),
		preference: existingUser.preference,
	});
});

//---------------SDP-2 Unit-Testing---------------//

//USER Queries
const user = {
	userId: 3,
	masterPassword: "nonofurbusiness369",
	data: JSON.stringify({
		fName: "Essaa",
		lName: "Ahmed",
		email: "ya@ya.com",
		picture: "",
		phone: "66666666",

	}),
	salt: "et52ed",
	dateCreated: new Date(),
	dateUpdated: new Date(),
	lastBackupDate: new Date(),
	preference: JSON.stringify({}),
	
};
//find user by data
test("Find User By Data", async () => {
	prismaMock.user.findUnique.mockResolvedValue(user);
	const result = await userQueryService.findUserByUserData(user.data);
	expect(result).toEqual(user); 
});

//get user master password by id
test("Get User Master Password By Id", async () => {
	prismaMock.user.findUnique.mockResolvedValue(user.masterPassword as any);
	const result = await userQueryService.getUserMasterPasswordById(3);
	expect(result).toEqual(JSON.stringify(user.masterPassword)); 
});

//Security Questions Queries
const securityQuestion = {
	securityQuestionId: 1,
	data: "What is your favourite color?",	
	question: "What is your favourite color?",
	answer: "Blue",
	userId: 3,
};
//find security question by sec question id
test("Find Security Question By Id", async () => {
	prismaMock.securityQuestion.findUnique.mockResolvedValue(securityQuestion);
	const result = await userQueryService.findSecurityQuestionById(1);
	expect(result).toEqual(securityQuestion); 
});
//get security question by user id
test("Get Security Question By User Id", async () => {
	prismaMock.securityQuestion.findFirst.mockResolvedValue(securityQuestion);
	const result = await userQueryService.getSecurityQuestionByUserId(3);
	expect(result).toEqual(securityQuestion); 
});

//Credential Queries
const credential = {
	credentialId: 1,
	serviceName: "Facebook",
	title: "My Facebook Account",
	data: JSON.stringify({
		userName: "",
		password: "",
	}),
	url: "https://www.facebook.com/",
	isWeak: false,
	isReused: false,
	isOld: false,
	dateCreated: new Date(),
	dateUpdated: new Date(),
	serviceType: "Social Media",
	picture: "",
	isFavourite: false,
	isTrashed: false,
	dateTrashed: new Date(),
	userId: 3,
};

//get credentials by user id
test("Get Credentials By User Id", async () => {
	prismaMock.credential.findMany.mockResolvedValue([credential]);
	await userQueryService.getCredentialsByUserId(3);
	expect(prismaMock.credential.findMany).toHaveBeenCalledTimes(1); 
});
//get all current credentials
test("Get All Current Credentials", async () => {
	prismaMock.credential.findMany.mockResolvedValue([credential]);
	const result = await userQueryService.getAllCurrentCredentials();
	expect(result).toEqual([credential]); 
});
//get credential by service name
test("Get Credential By Service Name", async () => {
	prismaMock.credential.findMany.mockResolvedValue(credential as any);
	const result = await userQueryService.getCredentialsByServiceName("Facebook");
	expect(result).toEqual(credential); 
});
//get credential by service type
test("Get Credential By Service Type", async () => {
	prismaMock.credential.findMany.mockResolvedValue(credential as any);
	const result = await userQueryService.getCredentialsByServiceType("Social Media");
	expect(result).toEqual(credential); 
});
//get credential by title
test("Get Credential By Title", async () => {
	prismaMock.credential.findMany.mockResolvedValue(credential as any);
	const result = await userQueryService.getCredentialsByTitle("My Facebook Account");
	expect(result).toEqual(credential); 
});
//get credential by url
test("Get Credential By Url", async () => {
	prismaMock.credential.findMany.mockResolvedValue(credential as any);
	const result = await userQueryService.getCredentialsByUrl("https://www.facebook.com/");
	expect(result).toEqual(credential); 
});
//get total credentials count by user id
test("Get Total Credentials Count By User Id", async () => {
	prismaMock.credential.count.mockResolvedValue(1);
	const result = await userQueryService.getTotalCredentialsCountByUserId(3);
	expect(result).toEqual(1); 
});
//get weak passwords count by user id
test("Get Weak Passwords Count By User Id", async () => {
	prismaMock.credential.count.mockResolvedValue(1);
	const result = await userQueryService.getWeakPasswordsCountByUserId(3);
	expect(result).toEqual(1); 
});
//get reused passwords count by user id
test("Get Reused Passwords Count By User Id", async () => {
	prismaMock.credential.count.mockResolvedValue(1);
	const result = await userQueryService.getReusedPasswordsCountByUserId(3);
	expect(result).toEqual(1); 
});
//get old passwords count by user id
test("Get Old Passwords Count By User Id", async () => {
	prismaMock.credential.count.mockResolvedValue(1);
	const result = await userQueryService.getOldPasswordsCountByUserId(3);
	expect(result).toEqual(1); 
});
//get trashed credentials by user id
test("Get Trashed Credentials By User Id", async () => {
	prismaMock.credential.findMany.mockResolvedValue([credential]);
	const result = await userQueryService.getTrashedCredentialsByUserId(3);
	expect(result).toEqual([credential]); 
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
//get documents by user id
test("Get Documents By User Id", async () => {
	prismaMock.document.findMany.mockResolvedValue([document] as any);
	const result = await userQueryService.getDocumentsByUserId(3);
	expect(result).toEqual([document]); 
});
