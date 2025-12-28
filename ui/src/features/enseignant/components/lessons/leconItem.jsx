import { useState, useRef, useEffect } from "react"; // Ajout de hooks
import { useNavigate } from "react-router-dom";
import Button from "../../../../components/button/button";
import Card from "../../../../components/card/card";
import CardBody from "../../../../components/card/cardBody";
import CardHeader from "../../../../components/card/cardHeader";
import CardFooter from "../../../../components/card/cardFooter";
import Icon from "../../../../components/icon/icon";

export default function LeconItem({ lecon }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

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

  return (
    <Card as="li" className={`relative order-${lecon.ordre}`}>
      <CardHeader className="flex justify-between items-start">
        <div className="flex flex-col items-start gap-1">
          <h3 className="font-bold">{lecon.titre}</h3>
          <p className="text-xs rounded-sm bg-green-300 shrink-0 px-1 italic">
            {lecon.versionActiveId ? "Publie" : "Non publie"}
          </p>
        </div>

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
        <p className="text-sm mb-4">{lecon.description}</p>
        <p className="text-xs text-gray-600 flex justify-between gap-4 min-w-0 mb-3">
          <span className="flex items-center gap-1 whitespace-nowrap">
            <Icon name="clock" className="w-4 h-4" />
            Dernière modification
          </span>
          <span>{lecon.modification}</span>
        </p>
      </CardBody>
      <CardFooter className="flex gap-2">
        <Button
          onClick={() => navigate(`lecons/${lecon.id}`)}
          className="flex-1 bg-primary text-white px-4 py-2 rounded-lg"
        >
          Modifier
        </Button>
        <Button
          onClick={() => navigate(`lecons/${lecon.id}`)}
          className="flex-1 bg-gray-300 text-primary px-4 py-2 rounded-lg"
        >
          Visualiser
        </Button>
      </CardFooter>
    </Card>
  );
}
