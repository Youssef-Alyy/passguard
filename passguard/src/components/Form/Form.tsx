import Button from "./Button.tsx";
import LabelInput from "./LabelInput.tsx";
import LabelDropDown from "./LabelDropDown.tsx";
import PasswordStrength from "./PasswordStrength.tsx";
import TopOfForm from "./TopOfForm.tsx";
import { useState } from "react";
import CredentialService from "../../utils/credentialService.ts";
import { serviceNames } from "../../data/dropdownItems.tsx";

const credentialService = new CredentialService();

type FormProps = {
  userId: number;
  formSubmitted: () => void;
  forceRender: () => void;
  favoriteRender: () => void;
  onBTNClick: (showForm: boolean) => void;
  onCardClick: (credentialData: any, updateClicked: boolean) => void;
  editable?: boolean;
  credentialObj?: {
    credentialId: string;
    title: string;
    serviceName: string;
    serviceType: string;
    data: string;
    url: string;
  };
};

function Form(props: FormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formValues, setFormValues] = useState(false);
  const [formData, setFormData] = useState({
    credentialTitle: "",
    serviceType: "",
    serviceName: "",
  });

  const handleCancelBTN = (e: any) => {
    e.preventDefault();
    props.onBTNClick(false);
  };

  const handleEditClick = (e: any) => {
    props.onCardClick(props.credentialObj, true);
  };

  const handleSubmitForm = async (e: any) => {
    e.preventDefault();
    if (!props.editable) {
      handleEditClick(e);
      return;
    }

    const formData = new FormData(e.target);

    if (props.credentialObj?.title) {
      credentialService.updateCredential(
        props.credentialObj.credentialId,
        formData,
        props.userId
      );
    } else {
      credentialService.createCredential(formData, props.userId);
    }
    setFormValues(!formValues);
    props.formSubmitted();
    props.onBTNClick(false);
  };

  function handleOnChange(event: any): void {
    setFormData({ ...formData, [event.target.id]: event.target.value });
  }

  return (
    <>
      <aside
        className={`items-center flex flex-col border-l border-t  border-opacity-30 overflow-x-hidden overflow-hidden h-screen dark:border-darkborder-999`}
      >
        <TopOfForm
          credential={props.credentialObj}
          data={formData}
          credDeleted={props.forceRender}
          favoriteRender={props.favoriteRender}
        ></TopOfForm>

        <form
          onSubmit={handleSubmitForm}
          className=" flex-col p-3 border-t border-opacity-30 dark:border-darkborder-999"
        >
          <LabelInput
            required={true}
            type="text"
            label="Credential Title"
            id="credentialTitle"
            value={props.credentialObj ? props.credentialObj.title : ""}
            viewOnly={!props.editable}
            onChange={handleOnChange}
            placeholder=""
          ></LabelInput>

          <LabelDropDown
            type="text"
            id="serviceName"
            value={props.credentialObj ? props.credentialObj.serviceName : ""}
            list="serviceNames"
            viewOnly={!props.editable}
            placeholder=""
            label="Service Name"
            onChange={handleOnChange}
          ></LabelDropDown>

          <LabelDropDown
            type="text"
            id="serviceType"
            value={props.credentialObj ? props.credentialObj.serviceType : ""}
            list="serviceTypes"
            viewOnly={!props.editable}
            placeholder=""
            label="Service Type"
            onChange={handleOnChange}
          ></LabelDropDown>

          <LabelInput
            type="text"
            required={true}
            label="Username / Email"
            value={
              props.credentialObj?.data
                ? JSON.parse(props.credentialObj?.data).userName
                : ""
            }
            viewOnly={!props.editable}
            id="userName"
            placeholder=""
          ></LabelInput>

          <PasswordStrength
            type={showPassword ? "text" : "password"}
            label="Password"
            required={true}
            viewOnly={!props.editable}
            value={
              props.credentialObj?.data
                ? JSON.parse(props.credentialObj?.data).password
                : ""
            }
            id="password"
            name="password"
          ></PasswordStrength>

          <LabelInput
            type="text"
            label="Login Page URL"
            value={
              serviceNames.find(
                (service: any) => service.name === formData.serviceName
              )?.url || props.credentialObj?.url
            }
            autofill={props.credentialObj}
            id="loginPageUrl"
            viewOnly={!props.editable}
            placeholder={" "}
          ></LabelInput>

          <div className="flex justify-between mt-16 px-1">
            <div className="mr-1">
              <Button value="Cancel" type="button" onClick={handleCancelBTN}>
                Cancel
              </Button>
            </div>

            {props.credentialObj?.title ? (
              <div className="ml-1">
                <Button value="Update" type="submit">
                  {props.editable ? "Update" : "Edit"}
                </Button>
              </div>
            ) : (
              <div className="ml-1">
                <Button value="Save" type="submit">
                  Save
                </Button>
              </div>
            )}
          </div>
        </form>
      </aside>
    </>
  );
}

export default Form;
