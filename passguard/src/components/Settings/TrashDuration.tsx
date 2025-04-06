import { useLocation, useNavigate } from "react-router-dom";
import UserService from "../../utils/userService";
const userService = new UserService();

interface TrashDurationProps {}

const TrashDuration = (props: TrashDurationProps) => {
	const location = useLocation();
	const user = location.state.user;
	const navigate = useNavigate();

	const preference = JSON.parse(user.preference);

	const handleSelectChange = async (e: any) => {
		preference.trashDuration = e.target.value;
		const updatedUser = await userService.updateUserPreference(
			user.userId,
			preference
		);
		navigate("/settings", { state: { user: updatedUser } });
	};

	return (
		<>
			<div className="p-5 flex items-center justify-between rounded-t-xl rounded-b-none bg-gray-100 border border-gray-200 shadow-md dark:border-darkborder-999 dark:bg-darkcards-999">
				<div className="flex flex-col">
					<span className="font-semibold pb-2 dark:text-darktext-999">
						Credential Retention Duration{" "}
					</span>
					<span className="font-nunito text-gray-500 dark:text-darksubtext-999">
						<span className="font-semibold text-sm">
							Specify how long credentials will remain stored in the trash
							before being automatically deleted.
						</span>
					</span>
				</div>
				<div className="">
					<select
						className=" bg-gray-900 text-white font-medium rounded-lg w-[13rem] dark border-none dark:text-darktext-999"
						name="theme"
						id="theme-select"
						value={preference.trashDuration}
						onChange={handleSelectChange}
					>
						<option value="1">1 Day</option>
						<option value="2">2 Days</option>
						<option value="7">7 Days</option>
						<option value="30">30 Days</option>
						<option value="90">90 Days</option>
					</select>
				</div>
			</div>
		</>
	);
};

export default TrashDuration;
