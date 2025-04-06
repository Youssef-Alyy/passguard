import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UserService from "../../utils/userService";

const userService = new UserService();

interface ClipboardClrProps {}

const ClipboardClr = (props: ClipboardClrProps) => {
  const location = useLocation();
  const user = location.state.user;
  const navigate = useNavigate();

  const preference = JSON.parse(user.preference);

  const handleSelectChange = async (e: any) => {
    preference.clipBoardClr = e.target.value;
    const updatedUser = await userService.updateUserPreference(
      user.userId,
      preference
    );
    navigate("/settings", { state: { user: updatedUser } });
  };

  return (
    <>
      <div className="p-5 flex items-center justify-between rounded-t-none bg-gray-100 border border-gray-200 shadow-md dark:border-darkborder-999 dark:bg-darkcards-999">
        <div className="flex flex-col">
          <span className="font-semibold pb-2 dark:text-darktext-999">
            Clear copied item data
          </span>
          <span className="font-nunito text-gray-500 dark:text-darksubtext-999">
            <span className="font-semibold text-sm">
              Automatically clear copied item details from clipboard.{" "}
              <span className="font-bold">(✅ Recommended)</span>
            </span>
          </span>
        </div>
        <div className="">
          <select
            className=" bg-gray-900 text-white font-medium rounded-lg w-[13rem] dark border-none"
            name="autoLock"
            id="autoLock-select"
            value={preference.clipBoardClr}
            onChange={handleSelectChange}
          >
            <option value="none">Never</option>
            <option value="1">1 Minute</option>
            <option value="2">2 Minute</option>
          </select>
        </div>
      </div>
    </>
  );
};

export default ClipboardClr;
