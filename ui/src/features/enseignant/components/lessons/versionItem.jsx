import { useState, useRef, useEffect } from "react"; // Ajout de hooks
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../../components/button/button";
import Card from "../../../../components/card/card";
import CardBody from "../../../../components/card/cardBody";
import CardHeader from "../../../../components/card/cardHeader";
import CardFooter from "../../../../components/card/cardFooter";
import Icon from "../../../../components/icon/icon";
import useApi from "../../../../hooks/api";
import COURS from "../../../../services/api/cours";
import Modal from "../../../../components/modal/modal";
import DeleteConfirmation from "../../../class/components/cours/deleteConfirmation";

export default function VersionItem({ version, isActive = false }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [supressionState, setSupressionState] = useState("");
  const [isSupressionModalOpen, setIsSupressionModalOpen] = useState(false);

  const menuRef = useRef(null);
  const { moduleId, classeId, leconId } = useParams();
  const { execute } = useApi();

  const openSupressionModal = () => {
    setIsSupressionModalOpen(true);
  };

  const closeSupressionModal = () => {
    setIsSupressionModalOpen(false);
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

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const onDelete = async () => {
    const r = await execute(
      COURS.DELETE_LECON_CONTENT({
        moduleId,
        classeId,
        leconId,
        versionId: version.id,
      })
    );

    closeSupressionModal();
  };

  return (
    <Card className="relative">
      <CardHeader className="flex justify-between items-start">
        <div className="flex flex-col items-start gap-1">
          <h3 className="font-bold">{version.nom}</h3>
          <p className="text-xs rounded-sm bg-green-300 shrink-0 px-1 italic">
            {isActive ? "Actif" : ""}
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
              {!isActive && (
                <button
                  onClick={() => {
                    console.log("Archiver");
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Icon name="archive" className="w-4 h-4 mr-2" /> Definir comme
                  Actif
                </button>
              )}
              <button
                onClick={() => {
                  openSupressionModal();
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
        <p className="text-xs text-gray-600 flex justify-between gap-4 min-w-0 mb-3">
          <span className="flex items-center gap-1 whitespace-nowrap">
            <Icon name="clock" className="w-4 h-4" />
            Dernière modification
          </span>
          <span>{version.modification}</span>
        </p>
      </CardBody>
      <CardFooter className="flex gap-2">
        <Button
          onClick={() => navigate(`contenus/${version.id}?action=modifier`)}
          className="flex-1 bg-primary text-white px-4 py-2 rounded-lg"
        >
          Modifier
        </Button>
      </CardFooter>
      <Modal
        title="Supprimer ce module?"
        isOpen={isSupressionModalOpen}
        onClose={closeSupressionModal}
        fullScreen={false}
      >
        <DeleteConfirmation
          onDelete={onDelete}
          supressionState={supressionState}
          onChange={(e) => {
            setSupressionState(e.target.value);
          }}
        />
        {/* <form
                onSubmit={onDelete}
                className="w-120 px-4 py-4 flex flex-col items-start gap-4"
              >
                <label htmlFor="delete" className="">
                  Veuillez confirmer la suppression. Tapez{" "}
                  <span className="italic text-gray-500">"confirmer"</span> dans le
                  champs de texte ci-dessous.
                </label>
                <input
                  id="delete"
                  type="text"
                  placeholder="confirmer"
                  value={supressionState}
                  onChange={(e) => {
                    setSupressionState(e.target.value);
                  }}
                  className="border w-full rounded-sm p-2"
                />
                <button
                  disabled={supressionState !== "confirmer"}
                  type="submit"
                  className="bg-red-500 text-white py-2 px-4 rounded-sm disabled:cursor-not-allowed disabled:bg-red-200"
                >
                  Supprimer
                </button>
              </form> */}
      </Modal>
    </Card>
  );
}
