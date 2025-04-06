import { FaRegFilePdf } from "react-icons/fa";
import { BsFiletypeDoc } from "react-icons/bs";
import { BsFiletypeDocx } from "react-icons/bs";
import { BsFiletypePng } from "react-icons/bs";
import { BsFiletypeJpg } from "react-icons/bs";
import { BsFiletypePpt } from "react-icons/bs";
import { BsFiletypePptx } from "react-icons/bs";
import { BsFiletypeXls } from "react-icons/bs";
import { BsFiletypeXlsx } from "react-icons/bs";
import { BsFiletypeTxt } from "react-icons/bs";
import { TbFileTypeZip } from "react-icons/tb";
import { BsFiletypeMp3 } from "react-icons/bs";
import { BsFiletypeMp4 } from "react-icons/bs";
import { BsFiletypeWav } from "react-icons/bs";
import { BsFiletypeMov } from "react-icons/bs";
import { BsFiletypeGif } from "react-icons/bs";
import { BsFiletypeHtml } from "react-icons/bs";
import { BsFiletypeSvg } from "react-icons/bs";
import { IoDocument } from "react-icons/io5";

const fileTypeItems = [
  {
    extension: "pdf",
    icon: <FaRegFilePdf className="text-9xl" />,
  },
  {
    extension: "doc",
    icon: <BsFiletypeDoc className="text-9xl" />,
  },
  {
    extension: "docx",
    icon: <BsFiletypeDocx className="text-9xl" />,
  },
  {
    extension: "png",
    icon: <BsFiletypePng className="text-9xl" />,
  },
  {
    extension: "jpg",
    icon: <BsFiletypeJpg className="text-9xl" />,
  },
  {
    extension: "ppt",
    icon: <BsFiletypePpt className="text-9xl" />,
  },
  {
    extension: "pptx",
    icon: <BsFiletypePptx className="text-9xl" />,
  },
  {
    extension: "xls",
    icon: <BsFiletypeXls className="text-9xl" />,
  },
  {
    extension: "xlsx",
    icon: <BsFiletypeXlsx className="text-9xl" />,
  },
  {
    extension: "txt",
    icon: <BsFiletypeTxt className="text-9xl" />,
  },
  {
    extension: "zip",
    icon: <TbFileTypeZip className="text-9xl" />,
  },
  {
    extension: "mp3",
    icon: <BsFiletypeMp3 className="text-9xl" />,
  },
  {
    extension: "mp4",
    icon: <BsFiletypeMp4 className="text-9xl" />,
  },
  {
    extension: "wav",
    icon: <BsFiletypeWav className="text-9xl" />,
  },
  {
    extension: "mov",
    icon: <BsFiletypeMov className="text-9xl" />,
  },
  {
    extension: "gif",
    icon: <BsFiletypeGif className="text-9xl" />,
  },
  {
    extension: "html",
    icon: <BsFiletypeHtml className="text-9xl" />,
  },
  {
    extension: "svg",
    icon: <BsFiletypeSvg className="text-9xl" />,
  },
  {
    extension: "other",
    icon: <IoDocument className="text-9xl" />,
  },
];
export default fileTypeItems;
