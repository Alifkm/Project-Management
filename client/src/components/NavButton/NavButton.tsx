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
      <div className="flex justify-around align-center">
        <FontAwesomeIcon
          icon={faFlag}
          className="cursor-pointer hover:bg-gray-400 rounded-xs mx-1 bg-red-200"
        />
        <button
        className="nav-button rounded-xl"
        style={style}
        >
          {children}
        </button>
      </div>
    </>
  );
};

export default NavButton;