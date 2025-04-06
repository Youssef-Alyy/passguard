const CryptoJS = require("crypto-js");
const bcrypt = require("bcrypt");

//Encryption function
export function encryptData(data: string, key: string): string {
	try {
		return CryptoJS.AES.encrypt(data, key).toString();
	} catch (e) {
		return "Invalid key";
	}
}
//Decryption function
export function decryptData(data: string, key: string): string {
	try {
		return CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8);
	} catch (e) {
		return "Invalid key";
	}
}
export function generateSalt(): string {
	try {
		return bcrypt.genSaltSync(10);
	} catch (error) { 
		console.error("Error generating salt: ", error);
		throw error;

	}
}
// Function to derive encryption key from hashed master password
export async function hashPassword(
	masterPassword: string,
	salt: string
): Promise<string> {
	try {
		const hashedPassword = await bcrypt.hash(masterPassword, salt);
		return hashedPassword;
	} catch (error) {
		console.error("Error hashing password: ", error);
		throw error;
	}
}
