import { useContext, useState } from "react";
import AsyncSelect from "../../../../components/select/select";
import CLASSE from "../../../../services/api/classe";
import { AuthContext } from "../../../../context/authContext";
import { sendRequest } from "../../../../services/utils/request";
import useApi from "../../../../hooks/api";
import { split } from "../../../../utils/utils";

const ListPreview = ({ content, title }) => {
  const items = content
    .split("\n")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  if (items.length === 0) return null;

  return (
    <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
      <h5 className="text-xs font-semibold uppercase text-gray-500 mb-1">
        {title} (Aperçu)
      </h5>
      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
        {items.map((item, index) => (
          <li key={index}>{item.replace(/^(-|\*)\s*/, "")}</li>
        ))}
      </ul>
    </div>
  );
};

const ModuleMetadataForm = ({
  onSubmit,
  data: { id, titre = "", description = "", classId },
  mode = "SAVE",
}) => {
  const [formData, setFormData] = useState({
    classe: classId ?? id,
    titre: titre,
    description: description,
    objectifs: "",
    competencesCiblees: "",
    prerequis: "",
    isPublished: false,
  });

  const {
    user: { id: userId },
  } = useContext(AuthContext);

  const { execute } = useApi();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newModule = { ...formData };
    newModule.competencesCiblees = split(newModule.competencesCiblees);
    newModule.prerequis = split(newModule.prerequis);
    newModule.objectifs = split(newModule.objectifs);
    onSubmit(newModule);
  };

  async function fetchOptions() {
    const response = await execute(CLASSE.ENSEIGNANT(userId));
    if (!response.data) {
      return [];
    }
    return response.data;
  }

  return (
    <div className="p-6 bg-white border-gray-100 w-full mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="titre"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Classe <span className="text-red-500">*</span>
          </label>
          <AsyncSelect
            onChange={(v) =>
              handleChange({ target: { name: "classe", value: v } })
            }
            value={formData.classe}
            showSearch={false}
            fetchOptions={fetchOptions}
            getOptionLabel={(option) => option.nom}
            getOptionValue={(option) => option.id}
          />
        </div>
        <div>
          <label
            htmlFor="titre"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Titre du module <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="titre"
            id="titre"
            value={formData.titre}
            onChange={handleChange}
            required
            placeholder="Ex: Les Modèles de Propagation des Ondes Radio"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description Courte (Aperçu)
          </label>
          <textarea
            name="description"
            id="description"
            rows="2"
            value={formData.description}
            onChange={handleChange}
            placeholder="Résumez en une ou deux phrases le sujet principal de la leçon."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="objectifs"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Objectifs de la Leçon
            <span className="ml-2 text-xs font-normal text-blue-500">
              (Écrivez un objectif par ligne)
            </span>
          </label>
          <textarea
            name="objectifs"
            id="objectifs"
            rows="4"
            value={formData.objectifs}
            onChange={handleChange}
            placeholder="Écrivez le premier objectif ici...&#10;Écrivez le second objectif ici..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="competencesCiblees"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Compétences Ciblées
              <span className="ml-2 text-xs font-normal text-blue-500">
                (Une compétence par ligne)
              </span>
            </label>
            <textarea
              name="competencesCiblees"
              id="competencesCiblees"
              rows="4"
              value={formData.competencesCiblees}
              onChange={handleChange}
              placeholder="Ex: Modéliser l'environnement de propagation.&#10;Ex: Évaluer la performance du lien."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <ListPreview
              content={formData.competencesCiblees}
              title="Aperçu des Compétences"
            />
          </div>

          <div>
            <label
              htmlFor="prerequis"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Prérequis
              <span className="ml-2 text-xs font-normal text-blue-500">
                (Un prérequis par ligne)
              </span>
            </label>
            <textarea
              name="prerequis"
              id="prerequis"
              rows="4"
              value={formData.prerequis}
              onChange={handleChange}
              placeholder="Ex: Maîtrise des nombres complexes.&#10;Ex: Connaissances de base en électromagnétisme."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <ListPreview
              content={formData.prerequis}
              title="Aperçu des Prérequis"
            />
          </div>
        </div>

        <div className="pt-6 flex justify-end items-center border-t border-gray-100">
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md flex items-center space-x-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
            <span>
              {mode === "SAVE" ? "Créer le module" : "Editer le module"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModuleMetadataForm;
