import { useState } from "react";

type Button = {
  text: string;
  background?: string;
  onClick?: () => void;
};

const Button = ({ text, background, onClick }: Button) => {
  return (
    <>
      <div>
        <button
          className={`${background} rounded-xl px-5 py-2  hover:bg-opacity-80 hover:cursor-pointer`}
          onClick={onClick}
        >
          {text}
        </button>
      </div>
    </>
  );
};

export default Button;
