import Icon from "../../../../components/icon/icon";
import LeconItem from "./leconItem";
import Modal from "../../../../components/modal/modal";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import LeconMetadataForm from "./leconMetadata";
import EmptyState from "../../../../components/empty/empty";
import COURS from "../../../../services/api/cours";
import useApi from "../../../../hooks/api";
import { split } from "../../../../utils/utils";
import {
  Tab,
  TabBody,
  TabContent,
  TabItem,
  TabList,
} from "../../../../components/tab";
import LeconSortList from "./sortList";

export default function Lecons() {
  const [isMetadataModalOpen, setIsMetadataModalOpen] = useState(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [sortedLessons, setSortedLessons] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef();
  const { classeId, moduleId } = useParams();
  const { execute } = useApi();

  const published = filteredLessons.filter((l) => l.versionActiveId !== null);
  const notPublished = filteredLessons.filter(
    (l) => l.versionActiveId === null
  );

  const loadLessons = async () => {
    const r = await execute(COURS.GET_MODULE_LECONS({ classeId, moduleId }));
    if (r.error) {
      return;
    }
    setLessons(r.data || []);
    setFilteredLessons(r.data || []);
    setSortedLessons(r.data || []);
  };

  const openMetadataModal = () => {
    setIsMetadataModalOpen(true);
  };

  const closeMetadataModal = () => {
    setIsMetadataModalOpen(false);
  };

  const openSortModal = () => {
    setIsSortModalOpen(true);
  };

  const closeSortModal = () => {
    setIsSortModalOpen(false);
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsMenuOpen((s) => !s);
  };

  const onSort = useCallback(async () => {
    const r = await execute(
      COURS.SORT_LECONS({
        classeId,
        moduleId,
        data: {
          content: sortedLessons.map((l) => ({
            lessonId: l.id,
            order: l.ordre,
          })),
        },
      })
    );
    if (r.error) {
      return;
    }
    setLessons(r.data);
    setFilteredLessons(r.data);
  }, [sortedLessons, COURS]);

  const onSubmitLesson = async (data) => {
    const newLesson = { ...data };
    newLesson.objectifs = split(newLesson.objectifs);
    newLesson.prerequis = split(newLesson.prerequis);
    newLesson.competencesCiblees = split(newLesson.competencesCiblees);

    const r = await execute(
      COURS.CREATE_LESSON({ classeId, moduleId, data: newLesson })
    );

    setLessons((s) => [...s, { ...r.data }]);
  };

  /**
   *
   * @param {HTMLInputElement} e
   */
  const onSearch = (e) => {
    const inputValue = e.value.trim().toLowerCase();
    setFilteredLessons(() =>
      lessons.filter((l) => {
        const lowerCaseName = l.titre.toLowerCase();
        return (
          lowerCaseName.startsWith(inputValue) ||
          lowerCaseName.split(" ").some((part) => part.startsWith(inputValue))
        );
      })
    );
  };

  useEffect(() => {
    loadLessons();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6 text-sm mb-3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">Module Lessons</h2>
          <div className="flex justify-end gap-2">
            <button
              onClick={openMetadataModal}
              className="flex items-center gap-1 bg-primary text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition"
            >
              <Icon name="plus" className="w-4 h-4" />
              Ajouter une lecon
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
                      openSortModal();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-red-50"
                  >
                    <Icon name="trash" className="w-4 h-4 mr-2" /> Organiser
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
          </div>
        </div>

        <fieldset className="w-full border-1 p-1 border-gray-400 rounded-sm flex mb-2">
          <input
            onChange={(e) => {
              onSearch(e.target);
            }}
            name="search"
            className="h-8 border-none outline-0 flex-1 "
          />
          <button className="bg-primary rounded-sm w-8">🔎</button>
        </fieldset>
      </div>
      <Tab value="public">
        <div
          role="nav"
          className="py-3 px-5 pb-0 mt-6 bg-white mb-4 flex rounded-xl text-xs"
        >
          <TabList>
            <TabItem value="public">Publié</TabItem>
            <TabItem value="prive">Non Publié</TabItem>
          </TabList>
        </div>
        <TabBody>
          <TabContent value="public">
            {published.length > 0 ? (
              <ul className="flex gap-2 flex-wrap">
                {published.map((lecon) => (
                  <LeconItem lecon={lecon} key={lecon.id} />
                ))}
              </ul>
            ) : (
              <div className="w-full flex justify-center items-center">
                <EmptyState />
              </div>
            )}
          </TabContent>
          <TabContent value="prive">
            {notPublished.length > 0 ? (
              <ul className="flex gap-2 flex-wrap">
                {notPublished.map((lecon) => (
                  <LeconItem lecon={lecon} key={lecon.id} />
                ))}
              </ul>
            ) : (
              <div className="w-full flex justify-center items-center">
                <EmptyState />
              </div>
            )}
          </TabContent>
        </TabBody>
      </Tab>

      <Modal
        isOpen={isMetadataModalOpen}
        title="Nouveau Lecon"
        onClose={closeMetadataModal}
      >
        <LeconMetadataForm onSubmit={onSubmitLesson} />
      </Modal>

      <Modal
        isOpen={isSortModalOpen}
        title={"Organiser les lecons"}
        onClose={closeSortModal}
      >
        <LeconSortList
          lecons={sortedLessons}
          setLecons={setSortedLessons}
          onSort={onSort}
        />
      </Modal>
    </>
  );
}
