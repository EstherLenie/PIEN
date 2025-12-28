import {
  createContext,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";

export const sideBarContext = createContext({ toggle: () => {}, open: false });

export default function SideBar(props, ref) {
  const { children } = props;
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => {
    setOpen((state) => !state);
  }, []);

  const openSidebar = useCallback(() => {
    setOpen(true);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      toggle,
      open: openSidebar,
    }),
    []
  );

  const className = open ? "w-60" : "w-16";

  return (
    <sideBarContext.Provider value={{ toggle, open }}>
      <div
        className={`${className} relative h-full  bg-white border-r-1 border-gray-100  transition-all duration-300 ease-in-out pt-1 px-2`}
      >
        {children}
      </div>
    </sideBarContext.Provider>
  );
}
