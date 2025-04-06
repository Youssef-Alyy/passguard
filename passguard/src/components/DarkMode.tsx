import "../App.css";
import "primereact/resources/primereact.css";
import { IoSunnyOutline } from "react-icons/io5";
import { IoMoonOutline } from "react-icons/io5";


function DarkMode() {
  return (
    <>
      <label className="relative inline-flex cursor-pointer select-none items-center">
        <input type="checkbox" className="sr-only" checked />
        <span className="label flex items-center text-sm font-medium text-black pr-2">
        <IoSunnyOutline size="1.3em"
          className="top-8 text-black"/>

        </span>
        <label className="relative inline-flex items-center cursor-pointer slider duration-200">
          <input type="checkbox" value="" className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
          <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
        </label>
        <span className="label flex items-center text-sm font-medium text-black">
        <IoMoonOutline size="1.3em"
          className="top-8 text-black"/>
        </span>
      </label>
    </>
  );
}

export default DarkMode;
