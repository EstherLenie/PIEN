import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

const resourceContext = createContext({
  openChoser: () => {},
  closeChoser: () => {},
  open: false,
  choose: () => {},
});

export default function ResourceChoser({ children }) {
  const chooserFunction = useRef(null);
  const [open, setOpen] = useState(false);

  const openChoser = useCallback((onChoose) => {
    chooserFunction.current = onChoose;
    setOpen(true);
  }, []);

  const closeChoser = useCallback(() => {
    chooserFunction.current = null;
    setOpen(false);
  }, []);

  const choose = useCallback((component) => {
    chooserFunction.current(component);
    closeChoser();
  }, []);

  return (
    <resourceContext.Provider value={{ open, openChoser, closeChoser, choose }}>
      {children}
    </resourceContext.Provider>
  );
}

export const useResourceChoser = function () {
  const context = useContext(resourceContext);
  if (!context) throw new Error("context non trouve");
  return context;
};
