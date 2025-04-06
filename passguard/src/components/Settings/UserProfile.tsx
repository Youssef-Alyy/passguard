import ManageEmail from "./ManageEmail";
import ManageUserProfile from "./ManageUserProfile";
import WipeAccount from "./WipeAccount";

type UserProfileProps = {
  userUpdated?: any;
};

const UserProfile = (props: UserProfileProps) => {
  return (
    <>
      <div className={`overflow-y-auto max-h-[100vh] h-[100vh] `}>
        <div className="pb-[10rem]">
          <ManageUserProfile
            userUpdated={props.userUpdated}
          ></ManageUserProfile>

          <div className="mt-4">
            <ManageEmail></ManageEmail>
            <WipeAccount></WipeAccount>
          </div>
          
        </div>
      </div>
    </>
  );
};

export default UserProfile;
