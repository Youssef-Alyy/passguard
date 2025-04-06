import { useLocation, useNavigate } from "react-router-dom";
import UserService from "../../utils/userService";

const userService = new UserService();

interface BackupPrefProps {}

const BackupPref = (props: BackupPrefProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state.user;

  const preference = JSON.parse(user.preference);

  async function handleBackupDurationChange(e: any): Promise<void> {
    preference.backUpDuration = e.target.value;
    const updatedUser = await userService.updateUserPreference(
      user.userId,
      preference
    );
    navigate("/settings", { state: { user: updatedUser } });
  }

  return (
    <>
      <div className="p-5 flex items-center justify-between rounded-t-none rounded-b-3xl bg-gray-100 border border-gray-200 shadow-md dark:border-darkborder-999 dark:bg-darkcards-999">
        <div className="flex flex-col">
          <span className="font-semibold pb-2 dark:text-darktext-999">
            Backup Duration
          </span>
          <span className="font-nunito text-gray-500 dark:text-darksubtext-999">
            <span className="font-semibold text-sm">
              Choose the duration for automatic backup of your data (This sends
              an encrypted backup of your data to your email address).
            </span>
          </span>
        </div>
        <div className="">
          <select
            className=" bg-gray-900 text-white font-medium rounded-lg w-[13rem] dark border-none dark:text-darktext-999"
            name="forgetPassOTP"
            id="forgetPassOTP-select"
            value={preference.backUpDuration}
            onChange={handleBackupDurationChange}
          >
            <option value="none">None</option>
            <option value="1">1 Day</option>
            <option value="7">7 Days</option>
            <option value="14">14 Days</option>
            <option value="30">30 Days</option>
          </select>
        </div>
      </div>
    </>
  );
};

export default BackupPref;
