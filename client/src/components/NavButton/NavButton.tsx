import "./NavButton.css";

interface Props {
  text: string;
}

const NavButton = ({ text }: Props) => {
  return (
    <>
      <button className="nav-button">{text}</button>
    </>
  );
};

export default NavButton;
