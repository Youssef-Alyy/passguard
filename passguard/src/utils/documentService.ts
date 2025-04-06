

export default class DocumentService {
  async createDocument(formData: any, userId: number) {
    /*Here u should do something like this to not get actual password value.
        const password = data.get('password');
        const hashedPassword = /* perform your encryption or hashing here;
        Replace the original password with the hashed version
        data.set('password', hashedPassword);
        */

    const data = {
      category: formData.category,
      name: formData.name,
      path: formData.path,
      type: formData.type,
      userId: formData.userId,
    };

    window.ipcRenderer.send("createDocument", data);
  }

  async deleteDocumentById(documentId: number) {
    window.ipcRenderer.send("deleteDocumentById", documentId);
  }

  async findDocumentsByUserId(userId: any): Promise<any> {
    return new Promise((resolve) => {
      window.ipcRenderer.send("findDocumentsByUserIdRequest", userId);
      window.ipcRenderer.once("findDocumentsByUserIdResponse", (event, arg) => {
        const parsedData = JSON.parse(arg);
        resolve(parsedData);
      });
    });
  }
  async findDocumentById(credentialId: any): Promise<any> {
    return new Promise((resolve) => {
      window.ipcRenderer.send("findCredentialByIdRequest", credentialId);
      window.ipcRenderer.once("findCredentialByIdResponse", (event, arg) => {
        const parsedData = JSON.parse(arg);
        resolve(parsedData);
      });
    });
  }
  async deleteAllDocumentsByUserId(userId: number) { 
    window.ipcRenderer.send("deleteAllDocumentsByUserId", userId);
  }
}
