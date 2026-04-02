import { useState } from "react";
import COURS from "../../../../services/api/cours";
import MULTIMEDIA from "../../../../services/api/multimedia";
import useApi from "../../../../hooks/api";

export default function AddRessourceForm({
  classeId,
  closeMedatadaModal,
  onAddSuccess,
}) {
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const { execute, uploadFile } = useApi();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUrl(""); // on efface l'URL si un fichier est choisi
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
    setFile(null); // on efface le fichier si une URL est saisie
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      titre,
      description,
      url,
    };
    if (file != null) {
      const res = await uploadFile(
        MULTIMEDIA.UPLOAD_FILE({ file, filename: file.name })
      );

      data.url = res.data.url;
      data.type = res.data.type;
      data.filename = file.name;
      console.log({ res, data });
    }
    data.type = "URL";
    try {
      const res = await execute(COURS.SAVE_RESSOURCE({ classeId, data }));
      console.log(res);
      if (res.error) {
        alert("Sauvegarde echoue");
        return;
      }
      alert("Classe créée avec succès");
      onAddSuccess(res.data);
      setFile(null);
      setTitre("");
      setDescription("");
      setUrl("");

      closeMedatadaModal();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl rounded-2xl shadow p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Titre */}
          <div>
            <label className="block text-medium font-bold mb-1">Titre</label>
            <input
              type="text"
              className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-medium font-bold mb-1">
              Description
            </label>
            <textarea
              className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <div className="relative">
              <input
                type="file"
                accept=".docx,.doc,.xls,.xlsx,.pdf,audio/*,image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="w-full border-1 border-dashed rounded-2xl cursor-pointer p-6 text-center">
                <p className="mt-2 text-sm text-green-600">
                  {file ? file.name : " Cliquer pour téléverser un fichier"}
                </p>
              </div>
            </div>
          </div>

          {/* Champ URL */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Ou entrer une URL
            </label>
            <input
              type="url"
              className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="https://exemple.com/ressource"
              value={url}
              onChange={handleUrlChange}
            />
          </div>

          {/* Bouton envoyer */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-xl py-2 font-medium hover:bg-blue-700 transition"
          >
            Enregistrer la ressource
          </button>
        </form>
      </div>
    </div>
  );
}
