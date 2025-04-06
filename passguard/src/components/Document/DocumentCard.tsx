import { Modal } from "flowbite-react";
import Kebab from "../CredentialSection/Kebab";
import ViewButton from "../Form/Button";
import { useState } from "react";
import fileTypeItems from "../../data/filetypes";
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import Button from "../Form/Button";

type DocumentCardProps = {
  index: React.Key;
  onDeleteClick: (key: React.Key) => void;
  id: string;
  name: string;
  type: string;
  category: string;
  path: string;
};

function DocumentCard(props: DocumentCardProps) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

  function handleClickOnYes(event: any): void {
    props.onDeleteClick(props.index);
    setTimeout(() => {
      setOpenDeleteModal(false);
    }, 999);
  }

  // const fileType = fileTypeItems.find(
  //   (item) => item.extension === props.type
  // )?.icon;

  return (
		<>
			<div
				id={props.id}
				className={`
              relative flex cursor-pointer flex-col justify-end 
              rounded-3xl hover:scale-105 transition-all duration-300 w-52 max-w-xs`}
			>
				<div className="rounded-2xl bg-white shadow-lg border-2 h-72 dark:bg-darkcards-999 dark:text-darktext-999 dark:border-darkborder-999">
					<div className="TopOfCard flex items-center justify-between border-b-2 p-2 dark:border-darkborder-999">
						<div onClick={() => setOpenModal(!openModal)}>
							<p className="font-nunito break-words text-sm font-bold">
								{props.name}
							</p>
							<p className="font-nunito font-medium break-words text-xs dark:text-darksubtext-999">
								{props.category}
							</p>
						</div>

						<Kebab
							onDeleteClick={() => setOpenDeleteModal(true)}
							isCard={true}
						></Kebab>

						<Modal
							show={openDeleteModal}
							size="md"
							onClose={() => setOpenDeleteModal(false)}
							popup
							dismissible
							className="dark:bg-darkcards-999"
						>
							<Modal.Header className="dark:bg-darkcards-999" />
							<Modal.Body className="dark:bg-darkcards-999">
								{" "}
								<div className="text-center">
									<HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-red-500 dark:text-red-500" />
									<p className="mb-5 text-lg font-nunito text-gray-500 dark:text-gray-400">
										Are you sure you want to permanently delete this document?
									</p>
									<div className="flex justify-center gap-4">
										<Button
											value="Cancel"
											onClick={() => setOpenDeleteModal(false)}
										>
											Cancel
										</Button>
										<Button value="confirmsignout" onClick={handleClickOnYes}>
											Delete
										</Button>
									</div>
								</div>
							</Modal.Body>
						</Modal>
					</div>

					{/* how to display all file types? */}
					<div
						className="flex items-center justify-center"
						onClick={() => setOpenModal(!openModal)}
					>
						{props.type === "application/pdf" ? (
							<embed
								src={props.path + `#page=1`}
								className="overflow-hidden border-none w-44 h-44 mt-1"
								onClick={() => setOpenModal(!openModal)}
							></embed>
						) : (
							<img
								src={props.path}
								className="w-44 h-44 mt-6"
								onClick={() => setOpenModal(!openModal)}
							/>
						)}
					</div>

						{props.type === "application/pdf" ? (
							<div className="absolute w-36 bottom-2 ml-8">
							<div className="">
								<Button value="Login" onClick={() => setOpenModal(!openModal)}>
									View
								</Button>
							</div>
						</div>
						) : (
							""
						)}
				</div>
			</div>

			{openModal ? (
				<Modal show={openModal} onClose={() => setOpenModal(false)}
				className="dark:bg-darkcards-999">
					<Modal.Header className="font-nunito font-medium break-words text-sm dark:bg-darkcards-999 dark:border-darkborder-999">
						{props.name} - {props.category}
					</Modal.Header>
					<Modal.Body
						className={`${props.type === "application/pdf" ? "overflow-hidden" : ""} dark:bg-darkcards-999`}
					>
						<div
							onDoubleClick={() => setOpenModal(!openModal)}
							className="flex items-center justify-center"
						>
							{props.type === "application/pdf" ? (
								<embed
									src={props.path}
									className="w-screen h-screen overflow-hidden"
									onClick={() => setOpenModal(!openModal)}
								></embed>
							) : (
								<img
									src={props.path + `#toolbar=0`}
									className="w-screen"
									onClick={() => setOpenModal(!openModal)}
								/>
							)}
						</div>
					</Modal.Body>
				</Modal>
			) : (
				""
			)}
		</>
	);
}

export default DocumentCard;
