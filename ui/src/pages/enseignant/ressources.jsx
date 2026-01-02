import { useLoaderData, useParams } from "react-router-dom";
import { useState } from "react";
import Loader from "../../components/loader/loader";
import Modal from "../../components/modal/modal";
import Icon from "../../components/icon/icon";
import { useRef, useEffect } from "react";
import COURS from "../../services/api/cours";
import useApi from "../../hooks/api";
import Input from "@mui/material/Input";
import AddRessourceForm from "../../features/class/components/cours/addRessourcesForm";
export default function Ressources() {
  const { classe } = useLoaderData();
  const [ressource, setRessource] = useState([]);
  const [filteredRessource, setFilteredRessource] = useState([]);
  const [isMetadataModalOpen, setIsMetadataModalOpen] = useState(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState();
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const menuRef = useRef();
  const [error, setError] = useState(null);
  const { classeId } = useParams();

  const { execute } = useApi();

  const load = async () => {
    const r = await execute(COURS.GET_RESSOURCES(classeId));
    if (r.error) {
      setError(r.error);
    }
    setRessource(r.data);
    setFilteredRessource(r.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [count]);

  const handleSuppression = async (ressourceId, ressourceTitre) => {
    alert(`La ressource ${ressourceTitre} va etre supprimee`);
    await execute(COURS.DELETE_RESSOURCES({ classeId, ressourceId }));
    setCount((prev) => prev + 1);
  };

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
  const openMetadataModal = () => {
    setIsMetadataModalOpen(true);
  };

  const closeMedatadaModal = () => {
    setIsMetadataModalOpen(false);
  };

  const openSortModal = () => {
    setIsSortModalOpen(true);
  };

  const closeSortModal = () => {
    setIsSortModalOpen(false);
  };
  const onSearchRessources = (e) => {
    const inputValue = e.value.trim().toLowerCase();
    setFilteredRessource(() =>
      ressource.filter((res) => {
        const lowerCaseName = res.titre.toLowerCase();
        return (
          lowerCaseName.startsWith(inputValue) ||
          lowerCaseName.split(" ").some((part) => part.startsWith(inputValue))
        );
      })
    );
  };
  const IconDownload = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="green"
      stroke="green"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="3" x2="12" y2="15" />
      <polyline points="7 10 12 15 17 10" />
      <rect x="5" y="18" width="14" height="2" rx="1" />
    </svg>
  );
  const IconTrash = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="red"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 21 6" />
      <path d="M8 6V4h8v2" />
      <rect x="6" y="6" width="12" height="14" rx="2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6 text-sm mb-3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">Ressources</h2>
          <div className="flex justify-end gap-2">
            <button
              onClick={openMetadataModal}
              className="flex items-center gap-1 bg-primary text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition"
            >
              <Icon name="plus" className="w-4 h-4" />
              Ajouter une ressources
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
              onChange={(e) => onSearchRessources(e.target)}
              name="search"
              className="h-8 border-none flex-1 outline-0 "
            />
            <button className="bg-primary rounded-sm w-8">🔎</button>
          </fieldset>
        </form>
      </div>
      <Modal
        title="Ajouter une ressource"
        isOpen={isMetadataModalOpen}
        onClose={closeMedatadaModal}
      >
        <AddRessourceForm
          classeId={classeId}
          closeMedatadaModal={closeMedatadaModal}
        />
      </Modal>

      <Modal
        onClose={closeSortModal}
        isOpen={isSortModalOpen}
        title="Organiser les ressources"
      ></Modal>

      {/* Tableau */}
      {loading ? (
        <p className="text-gray-500">Chargement des ressources...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filteredRessource.length === 0 ? (
        <p className="text-gray-500">Aucune ressource trouvée.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Titre
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                ></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRessource.map((ressource) => (
                <tr
                  key={ressource.id}
                  className="hover:bg-blue-50/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {ressource.titre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {ressource.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {ressource.type}
                  </td>
                  <td className="px-4 py-2 text-center flex justify-center gap-2">
                    {/* Boutons visuels pour prototype */}
                    <div
                      onClick={() => alert(`Telecharger ${ressource.titre}`)}
                      className="text-gray-400 space-y-2 hover:text-blue-600 p-1 rounded-full  hover:scale-110 transition-colors"
                    >
                      <IconDownload stroke="green" />
                    </div>
                    <div
                      // onClick={() => alert(`Supprimer la classe ${classe.nom}`)}
                      onClick={() =>
                        handleSuppression(ressource.id, ressource.titre)
                      }
                      className="text-gray-400 hover:text-blue-600 p-1 rounded-full hover:scale-110 transition-colors "
                    >
                      <IconTrash />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
