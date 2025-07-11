import { CSSProperties } from "react";
import "./NavButton.css";

type Color = "red" | "blue" | "green"; // this called union

type Props = {
  children: React.ReactNode; 
  style: CSSProperties;
}

const NavButton = ({ children, style }: Props) => {
  return (
    <>
      <button
       className="nav-button"
       style={style}
       >
        {children}
      </button>
    </>
  );
};

export default NavButton;