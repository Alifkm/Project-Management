type ModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children?: React.ReactNode;
};

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="w-50 h-1/2 rounded-xl bg-cyan-700">
      <input type="text" placeholder="project name" />
    </div>
  );
};

export default Modal;
