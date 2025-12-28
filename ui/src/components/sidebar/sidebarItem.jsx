import { useContext } from "react";
import { sideBarContext } from "./sidebar";
import Icon from "../icon/icon";

export default function SideBarItem({ onClick, icon, children }) {
  const { open } = useContext(sideBarContext);

  return (
    <li
      className={`flex  ${
        open ? "justify-start" : "justify-center"
      } space-x-2 h-5 cursor-pointer px-2 items-center text-black text-sm font-medium`}
    >
      {icon && <Icon onClick={onClick} name={icon} className="w-5 h-5" />}
      <span
        className={`transition-all duration-1000 ease-out ${
          open ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"
        }`}
      >
        {children}
      </span>
    </li>
  );
}
