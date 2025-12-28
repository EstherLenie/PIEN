import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../../components/button/button";
import Card from "../../../../components/card/card";
import CardBody from "../../../../components/card/cardBody";
import CardFooter from "../../../../components/card/cardFooter";
import Icon from "../../../../components/icon/icon";
import CardHeader from "../../../../components/card/cardHeader";
import { useEffect, useRef, useState } from "react";
import useApi from "../../../../hooks/api";
import COURS from "../../../../services/api/cours";

export default function ModuleItem({ titre, id, lecons = [], modification }) {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { classeId, moduleId } = useParams();
  const { execute } = useApi();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const onDelete = async () => {
    const r = await execute(COURS.DELETE_MODULE({ moduleId, classeId }));
  };

  return (
    <Card key={id}>
      <CardHeader className="flex justify-between">
        <h2>{titre}</h2>
        <div className="relative" ref={menuRef}>
          <Icon
            name="option"
            role="button"
            className="text-right w-6 h-6 cursor-pointer hover:bg-gray-100 rounded-full p-1"
            onClick={toggleMenu}
          />

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1">
              <button
                onClick={() => {
                  console.log("Archiver");
                  setIsMenuOpen(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Icon name="archive" className="w-4 h-4 mr-2" /> Archiver
              </button>
              <button
                onClick={() => {
                  onDelete();
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
      </CardHeader>

      <CardBody>
        <p className="text-sm  text-gray-600 flex justify-between">
          <span className="flex items-center gap-1">
            <Icon name="lesson" className="w-4 h-4" /> Lecons
          </span>
          <span>{lecons.length}</span>
        </p>
        <p className="text-xs  text-gray-600 flex justify-between gap-4 min-w-0 mb-3">
          <span className="flex items-center gap-1 whitespace-nowrap">
            <Icon name="clock" className="w-4 h-4" />
            Derniere modification
          </span>
          <span>{modification}</span>
        </p>
      </CardBody>

      <CardFooter>
        <Button
          onClick={() => navigate(`modules/${id}`)}
          className="flex-1 bg-primary text-white mx-0 "
        >
          Gerer Module
        </Button>
      </CardFooter>
    </Card>
  );
}
