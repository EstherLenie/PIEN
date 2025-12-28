import { useLoaderData, useParams } from "react-router-dom";
import Modules from "../../features/enseignant/components/modules/modules";
import { Suspense, useEffect, useState } from "react";
import Loader from "../../components/loader/loader";
import Modal from "../../components/modal/modal";
import ModuleMetadataForm from "../../features/enseignant/components/modules/moduleMetadata";
import useApi from "../../hooks/api";
import COURS from "../../services/api/cours";
import ModuleSortList from "../../features/enseignant/components/modules/sortList";

export default function Module() {
  const { classe } = useLoaderData();
  const [modules, setModules] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [sortedModules, setsortedModules] = useState([]);

  const [isMetadataModalOpen, setIsMetadataModalOpen] = useState(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const { execute } = useApi();
  const { classeId } = useParams();

  const load = async () => {
    const r = await execute(COURS.GET_MODULES(classeId));
    if (r.error) {
      return;
    }
    setModules(r.data);
    setFilteredModules(r.data);
    setsortedModules(r.data);
  };

  /**
   *
   * @param {HTMLInputElement} e
   */
  const onSearchModule = (e) => {
    const inputValue = e.value.trim().toLowerCase();
    setFilteredModules(() =>
      modules.filter((module) => {
        const lowerCaseName = module.titre.toLowerCase();
        return (
          lowerCaseName.startsWith(inputValue) ||
          lowerCaseName.split(" ").some((part) => part.startsWith(inputValue))
        );
      })
    );
  };

  const onSortedModules = async () => {
    const r = await execute(
      COURS.SORT_MODULES({ classeId, data: { content: sortedModules } })
    );
    if (r.error) {
      return;
    }
    setModules(r.data);
    setFilteredModules(r.data);
  };

  useEffect(() => {
    load();
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

  const createModule = async (data) => {
    const r = await execute(COURS.CREATE_MODULE({ classeId, data: data }));
    setModules((s) => [...s, { ...r }]);
    closeMedatadaModal();
  };

  return (
    <>
      <Loader promise={filteredModules}>
        <Modules
          onNew={openMetadataModal}
          onSearch={onSearchModule}
          onSort={openSortModal}
        />
      </Loader>

      <Modal
        title="Ajouter un module"
        isOpen={isMetadataModalOpen}
        onClose={closeMedatadaModal}
      >
        <Loader promise={classe}>
          <ModuleMetadataForm onSubmit={createModule} />
        </Loader>
      </Modal>

      <Modal
        onClose={closeSortModal}
        isOpen={isSortModalOpen}
        title="Organiser les modules"
      >
        <ModuleSortList
          modules={sortedModules}
          setModules={setsortedModules}
          onSorted={onSortedModules}
        />
      </Modal>
    </>
  );
}
