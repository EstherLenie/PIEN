import { Await, useLoaderData, useNavigate } from "react-router-dom";
import { Suspense, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import Classes from "../../features/enseignant/components/classes/classes";
import Title from "../../components/title/title";
import Loader from "../../components/loader/loader";
import useApi from "../../hooks/api";
import CLASSE from "../../services/api/classe";
import { isEmpty } from "../../utils/utils";

export default function EnseignantClasses() {
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const { execute } = useApi();
  const {
    user: { id },
  } = useContext(AuthContext);

  async function loadClasses() {
    const response = await execute(CLASSE.ENSEIGNANT(id));
    if (!response.data) {
      return;
    }
    setClasses(response.data);
    setFilteredClasses(response.data);
  }

  /**
   *
   * @param {HTMLInputElement} e
   */
  const onSearchClass = (e) => {
    const inputValue = e.value.trim().toLowerCase();
    setFilteredClasses(() =>
      classes.filter((classe) => {
        const lowerCaseName = classe.nom.toLowerCase();
        return (
          lowerCaseName.startsWith(inputValue) ||
          lowerCaseName.split(" ").some((part) => part.startsWith(inputValue))
        );
      })
    );
  };

  useEffect(() => {
    loadClasses();
  }, []);
  return (
    <>
      <section className="py-6 px-4 bg-primary text-white">
        <h2 className="text-2xl font-bold">Mes Classes</h2>
      </section>
      <section className="px-4 mt-5">
        <form className=" max-w-4xl flex flex-col gap-2 mb-8  bg-white shadow-xl rounded-xl p-6">
          <fieldset className="w- border-1 p-1 border-gray-400 rounded-sm flex">
            <input
              onChange={(e) => {
                onSearchClass(e.target);
              }}
              name="search"
              className="h-8 border-none flex-1 outline-0"
            />
            <button className="bg-primary rounded-sm w-8">🔎</button>
          </fieldset>

          <fieldset className="flex justify-start gap-2 text-sm">
            <label className="p-2 flex flex-col w-60 gap-1">
              <span>Matiere</span>
              <select
                name="matiere"
                className=" focus:outline-none focus:ring-0 w-full border-1 border-gray-400 rounded-sm h-7"
              ></select>
            </label>

            <label className="p-2 flex flex-col w-60 gap-1">
              <span>Niveau</span>
              <select
                name="niveau"
                className=" focus:outline-none focus:ring-0 w-full h-7 border-1 border-gray-400 rounded-sm"
              ></select>
            </label>
          </fieldset>
          <fieldset className="flex w-full justify-end text-xs text-primary">
            <button className="cursor-pointer" type="reset">
              Effacer les filtres
            </button>
          </fieldset>
        </form>
      </section>

      <section className="py-6 px-4">
        <Loader promise={filteredClasses}>
          <Classes />
        </Loader>
      </section>
    </>
  );
}
