import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { baseUrl,apiUrl } from "../../utils/utils";
import { Link } from "react-router-dom";
import AssignationEtudiant from "./assignationEtudiants";

export default function GestionnaireClasseDashboard() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("");
const [classeSelectionnee, setClasseSelectionnee] = useState(null);
const [count, setCount]=useState(0)


  // Récupération des classes
  useEffect(() => {
    fetch(`${baseUrl}${apiUrl}classes/`)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors de la récupération des classes");
        return res.json();
      })
      .then((data) => setClasses(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [count]);
  const handleSuppression= async(classeId,classeNom)=>
  { alert(`La classe ${classeNom} va etre supprimee`)
    await(
    fetch(`${baseUrl}${apiUrl}classes/delete/${classeId}` ,
        {
      method:"DELETE",
    }
    )
  
    )
    setCount(prev=>prev+1);
  }

  // Filtrage
  const filteredClasses = classes.filter(
    (c) =>
      c.code.toLowerCase().includes(filter.toLowerCase()) ||
      (c.programme.toLowerCase().includes(filter.toLowerCase())||c.matiere.toLowerCase().includes(filter.toLowerCase()))
  );

  return (<>
    {!classeSelectionnee? (<div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Gestionnaire de classes</h1>

    {/* Boutons de création et assignation */}
<div className="flex gap-4 mb-4">
  <NavLink
    to="create-classe"
    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-400"
  >
    Créer une classe
  </NavLink>

  {/* <NavLink
    to="assigner-etudiant"
    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
  >
    Assigner un étudiant
  </NavLink> */}
</div>


      {/* Filtre */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filtrer par nom ou programme..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Tableau */}
      {loading ? (
        <p className="text-gray-500">Chargement des classes...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filteredClasses.length === 0 ? (
        <p className="text-gray-500">Aucune classe trouvée.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 divide-y divide-gray-200">
            <thead className="bg-violet-200">
              <tr>
                <th className="px-4 py-2 text-left font-bold text-sm  text-gray-700">Code</th>
                <th className="px-4 py-2 text-left font-bold text-sm  text-gray-700">Nom</th>
                <th className="px-4 py-2 text-left font-bold text-sm text-gray-700">Programme</th>
                <th className="px-4 py-2 text-left font-bold text-sm  text-gray-700">Échelon</th>
                <th className="px-4 py-2 text-left font-bold text-sm  text-gray-700">Matière</th>
                <th className="px-4 py-2 text-left font-bold text-sm  text-gray-700">Enseignant</th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-700"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClasses.map((classe) => (
                <tr key={classe.id}>
                  <td className="px-4 py-2 text-sm text-blue-700 hover: text-blue-800"
                  onClick={()=>setClasseSelectionnee(classe)}>{classe.code}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{classe.nom}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{classe.programme}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{classe.echelon}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{classe.matiere}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{classe.enseignant}</td>
                  <td className="px-4 py-2 text-center flex justify-center gap-2">
                    {/* Boutons visuels pour prototype */}
                    <button
                      onClick={() => alert(`Modifier la classe ${classe.nom}`)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 text-sm disabled:gray"
                    >
                      Modifier
                    </button>
                    <button
                      // onClick={() => alert(`Supprimer la classe ${classe.nom}`)}
                      onClick={()=>handleSuppression(classe.id,classe.nom)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
    </div>):<AssignationEtudiant classe={classeSelectionnee}></AssignationEtudiant>}
 </> );
}
