import { FaTimes } from "react-icons/fa";

export interface ModalProps {
  onOutsideClick?: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = (props) => {
  const { onOutsideClick, title, children } = props;

  const outsideClicked = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (e.target === e.currentTarget) {
      onOutsideClick?.();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[999] w-full h-full bg-transparent backdrop-brightness-[60%] flex items-center justify-center"
      onClick={outsideClicked}
    >
      <div
        className={
          "rounded-xl border border-gray-300 bg-white shadow-lg p-6 flex flex-col max-w-lg w-full"
        }
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex flex-row items-center justify-between w-full mb-2">
            <p className="text-lg font-semibold text-gray-700">{title}</p>
            <button
              onClick={onOutsideClick}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        )}

        <hr className="mb-4 border-t border-gray-100" />

        <div className="w-full flex-1 max-h-[80vh] overflow-auto scrollbar-hide">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
