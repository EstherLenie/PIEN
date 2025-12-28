import { useLoaderData, useParams } from "react-router-dom";
import Lecons from "../../features/enseignant/components/lessons/lecons";
import Loader from "../../components/loader/loader";
import {
  Tab,
  TabBody,
  TabContent,
  TabItem,
  TabList,
} from "../../components/tab";
import { useEffect, useState } from "react";
import useApi from "../../hooks/api";
import COURS from "../../services/api/cours";
import ModuleMetadataForm from "../../features/enseignant/components/modules/moduleMetadata";
import Pen from "../../assets/icons/pen.svg?react";
import Modal from "../../components/modal/modal";

function ModuleDescription({ data: { titre, description }, onEdit }) {
  return (
    <>
      <div className="flex gap-4 items-center">
        <h3 className="font-bold text-2xl">{titre}</h3>
        <Pen
          className="w-4 h-4 text-white cursor-pointer"
          stroke="white"
          onClick={onEdit}
        />
      </div>
      <p>{description}</p>
    </>
  );
}

export default function EnseignantLecons() {
  const [module, setModule] = useState({});
  const { moduleId, classeId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { execute } = useApi();

  async function load() {
    const r = await execute(COURS.GET_MODULE({ moduleId, classeId }));
    if (r.error) {
      return;
    }
    setModule(r.data);
  }

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onSubmitEdit = async (data) => {
    const r = await execute(COURS.EDIT_MODULE({ classeId, moduleId, data }));
    if (r.error) {
      return;
    }
    setModule(r.data);
    closeModal();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <section className="py-6 px-4 bg-primary text-white">
        <Loader promise={module}>
          <ModuleDescription onEdit={openModal} />
        </Loader>
      </section>

      <aside>
        <Modal isOpen={isModalOpen} onClose={closeModal} title="Editer Module">
          <Loader promise={module}>
            <ModuleMetadataForm
              data={module}
              onSubmit={onSubmitEdit}
              mode="EDITER"
              key={module.id}
            />
          </Loader>
        </Modal>
      </aside>

      <Tab value="lecons">
        <section className="py-3 px-5 pb-0 mt-6 bg-white mb-4 flex rounded-xl text-xs">
          <TabList>
            <TabItem value="lecons" icon="lesson">
              Lecons
            </TabItem>
            <TabItem value="quiz" icon="quiz">
              Quiz
            </TabItem>
            <TabItem value="commentaires" icon="conversation">
              Commentaires
            </TabItem>
          </TabList>
        </section>

        <TabBody>
          <TabContent value="lecons">
            <Lecons />
          </TabContent>
        </TabBody>
      </Tab>
    </div>
  );
}
