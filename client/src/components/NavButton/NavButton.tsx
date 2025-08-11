import { CSSProperties } from "react";
import "./NavButton.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag } from "@fortawesome/free-solid-svg-icons";


type Color = "red" | "blue" | "green"; // this called union

type Props = {
  children: React.ReactNode; 
  style: CSSProperties;
}

const NavButton = ({ children, style }: Props) => {
  return (
    <>
      <div className="flex justify-center items-center text-[#3F4355]">
       <div className="hover:cursor-pointer">
         <FontAwesomeIcon
          icon={faFlag}
          className="cursor-pointer rounded-xs mx-1"
        />
        <button
        className="nav-button rounded-xl"
        style={style}
        >
          {children}
        </button>
       </div>
      </div>
    </>
  );
};

export default NavButton;