import { createPortal } from "react-dom";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  fullScreen = true,
}) {
  const position = isOpen
    ? fullScreen
      ? "translate-y-0"
      : "-translate-y-[50%] top-[50%] left-[50%]"
    : "translate-y-full";
  const display = isOpen ? "flex" : "hidden";

  return createPortal(
    <>
      <div
        className={`fixed ${display} h-dvh bg-gray-900 z-40 w-full top-0 opacity-80`}
      ></div>
      <div
        className={`fixed bottom-0  ${
          fullScreen
            ? `w-full h-[90%] rounded-t-xl`
            : "-translate-x-[50%] h-fit  rounded-xl overflow-hidden"
        } z-50 flex items-end transition-all duration-300 justify-center ${position}`}
      >
        <div
          className="bg-white h-full max-h-full   shadow-lg flex-1 flex flex-col w-full  animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="flex justify-between items-center px-4 py-4 border-b w-full flex-shrink-0">
            <h2 id="modal-title" className="text-2xl font-semibold h-10">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-black"
              aria-label="Fermer"
            >
              &times;
            </button>
          </div>

          <div className="p-4 flex-1 overflow-y-auto">{children}</div>
        </div>
      </div>
    </>,

    document.body
  );
}
