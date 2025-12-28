import EmptyState from "../../../../components/empty/empty";
import ModuleItem from "./moduleItem";

import Icon from "../../../../components/icon/icon";
import { useEffect, useRef, useState } from "react";

export default function Modules({ data: modules, onNew, onSearch, onSort }) {
  const [isMenuOpen, setIsMenuOpen] = useState();
  const menuRef = useRef();

  const toggleMenu = () => {
    setIsMenuOpen((s) => !s);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6 text-sm mb-3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">Modules</h2>
          <div className="flex justify-end gap-2">
            <button
              onClick={onNew}
              className="flex items-center gap-1 bg-primary text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition"
            >
              <Icon name="plus" className="w-4 h-4" />
              Ajouter un module
            </button>
            <div className="relative" ref={menuRef}>
              <Icon
                name="option"
                role="button"
                className="text-right w-6 h-full cursor-pointer rounded-sm bg-gray-300 p-1"
                onClick={toggleMenu}
              />

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1">
                  <button
                    onClick={() => {
                      onSort();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-red-50"
                  >
                    <Icon name="trash" className="w-4 h-4 mr-2" /> Organiser
                  </button>
                  <button
                    onClick={() => {
                      console.log("Supprimer");
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Icon name="trash" className="w-4 h-4 mr-2" /> Supprimer
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <form className="w-full">
          <fieldset className="w-full border-1 p-1 border-gray-400 rounded-sm flex mb-2">
            <input
              onChange={(e) => onSearch(e.target)}
              name="search"
              className="h-8 border-none flex-1 outline-0 "
            />
            <button className="bg-primary rounded-sm w-8">🔎</button>
          </fieldset>
        </form>
      </div>
      {modules.length > 0 ? (
        <ul className="flex w-full flex-wrap gap-4">
          {modules.map((module) => (
            <ModuleItem {...module} key={module.id} />
          ))}
        </ul>
      ) : (
        <div className="w-full flex justify-center items-center">
          <EmptyState />
        </div>
      )}
    </>
  );
}
