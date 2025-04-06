import bell from "../assets/icons/navbar/bell.svg";
import dashboard from "../assets/icons/navbar/dashboard.svg";
import document from "../assets/icons/navbar/document.svg";
import question from "../assets/icons/navbar/question.svg";
import setting from "../assets/icons/navbar/setting.svg";
import trash from "../assets/icons/common/trash.svg";

const navbarItems = [
  {
    name: "Dashboard",
    icon: dashboard,
    path: "/home",
  },
  {
    name: "Secured Documents",
    icon: document,
    path: "/secured-documents",
  },
  // {
  //     name: 'Trash',
  //     icon: trash,
  //     path: '/trash'
  // },
  // {
  //   name: "Notifications",
  //   icon: bell,
  //   path: "/notifications",
  // },
  {
    name: "About",
    icon: question,
    path: "/about",
  },
  {
    name: "Settings",
    icon: setting,
    path: "/settings",
  },
];
export default navbarItems;
