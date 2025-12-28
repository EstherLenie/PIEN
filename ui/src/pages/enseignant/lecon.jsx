import { useEffect, useState } from "react";
import Loader from "../../components/loader/loader";
import Modal from "../../components/modal/modal";
import useApi from "../../hooks/api";
import LeconMetadataForm from "../../features/enseignant/components/lessons/leconMetadata";
import {
  Tab,
  TabBody,
  TabContent,
  TabItem,
  TabList,
} from "../../components/tab";
import COURS from "../../services/api/cours";
import { useParams } from "react-router-dom";
import Versions from "../../features/enseignant/components/lessons/leconVersions";
import Pen from "../../assets/icons/pen.svg?react";

function LeconDescription({ description, titre, onEdit }) {
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

export default function Lecon() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { execute } = useApi();
  const { leconId, moduleId, classeId } = useParams();
  const [lecon, setLecon] = useState({});

  async function load() {
    const r = await execute(COURS.GET_LECON({ classeId, leconId, moduleId }));
    if (r.error) {
      return;
    }
    setLecon(r.data);
  }

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onSubmitEdit = async (data) => {
    const r = await execute(
      COURS.CREATE_LESSON({ classeId, moduleId, data: newLesson })
    );

    setLessons((s) => [...s, { ...r.data }]);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <section className="py-6 px-4 bg-primary text-white">
        <Loader>
          <LeconDescription
            titre={lecon.titre}
            description={lecon.description}
            onEdit={openModal}
          />
        </Loader>
      </section>
      <aside>
        <Modal isOpen={isModalOpen} onClose={closeModal} title="Editer Lecon">
          <Loader promise={lecon}>
            <LeconMetadataForm
              onSubmit={onSubmitEdit}
              mode="EDITER"
              key={lecon.id}
            />
          </Loader>
        </Modal>
      </aside>

      <Tab value="contenu">
        <section className="py-3 px-5 pb-0 mt-6 bg-white mb-4 flex rounded-xl text-xs">
          <TabList>
            <TabItem value="contenu" icon="lesson">
              Contenu
            </TabItem>
            <TabItem value="commentaires" icon="quiz">
              Commentaires
            </TabItem>
            <TabItem value="statistiques" icon="conversation">
              Statistiques
            </TabItem>
          </TabList>
        </section>

        <TabBody>
          <TabContent value="contenu">
            <Loader promise={lecon}>
              <Versions />
            </Loader>
          </TabContent>
          <TabContent value="commentaires"></TabContent>
          <TabContent value="statistiques"></TabContent>
        </TabBody>
      </Tab>
    </div>
  );
}
