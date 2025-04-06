import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UserService from "../../utils/userService";

const userService = new UserService();

interface AutolockProps {}

const Autolock = (props: AutolockProps) => {
  const location = useLocation();
  const user = location.state.user;
  const navigate = useNavigate();

  const preference = JSON.parse(user.preference);

  const handleSelectChange = async (e: any) => {
    preference.lockDuration = e.target.value;
    const updatedUser = await userService.updateUserPreference(
      user.userId,
      preference
    );
    navigate("/settings", { state: { user: updatedUser } });
  };

  return (
		<>
			<div className="p-5 flex items-center justify-between rounded-t-none rounded-b-3xl bg-gray-100 border border-gray-200 shadow-md dark:border-darkborder-999 dark:bg-darkcards-999">
				<div className="flex flex-col">
					<span className="font-semibold pb-2 dark:text-darktext-999">Autolock</span>
					<span className="font-nunito text-gray-500 dark:text-darksubtext-999">
						<span className="font-semibold text-sm">
							Specify how long before the application locks automatically.{" "}
							<span className="font-bold">(✅ Recommended)</span>
						</span>
					</span>
				</div>
				<div className="">
					<select
						className=" bg-gray-900 text-white font-medium rounded-lg w-[13rem] dark border-none"
						name="autoLock"
						id="autoLock-select"
						value={preference.lockDuration}
						onChange={handleSelectChange}
					>
						<option value="1">1 Minute</option>
						<option value="3">3 Minutes</option>
						<option value="5">5 Minutes</option>
						<option value="10">10 Minutes</option>
						<option value="30">30 Minutes</option>
						<option value="60">60 Minutes</option>
					</select>
				</div>
			</div>
		</>
	);
};

export default Autolock;
