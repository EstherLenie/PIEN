import { useState } from "react";
import EmptyState from "../../../../components/empty/empty";
import Modal from "../../../../components/modal/modal";
import VersionItem from "./versionItem";

export default function Versions({ data: { versions = [], versionActiveId } }) {
  const [supressionState, setSupressionState] = useState("");
  const [isSupressionModalOpen, setIsSupressionModalOpen] = useState(false);
  const onDelete = async (e) => {
    e.preventDefault();
    if (supressionState !== "confirmer") {
      return;
    }
    await execute(COURS.DELETE_MODULE({ classeId, moduleId }));
  };

  const openSupressionModal = () => {
    setIsSupressionModalOpen(true);
  };

  const closeSupressionModal = () => {
    setIsSupressionModalOpen(false);
  };
  return (
    <>
      {versions.length > 0 ? (
        <ul className="flex gap-2 flex-wrap">
          {versions.map((version) => (
            <VersionItem
              version={version}
              key={version.id}
              isActive={version.id === versionActiveId}
            />
          ))}
        </ul>
      ) : (
        <div className="w-full flex justify-center items-center">
          <EmptyState />
        </div>
      )}
      <Modal
        title="Supprimer ce module?"
        isOpen={isSupressionModalOpen}
        onClose={closeSupressionModal}
        fullScreen={false}
      >
        <form
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
        </form>
      </Modal>
    </>
  );
}
