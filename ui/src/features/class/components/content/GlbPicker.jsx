import { useState, useRef } from "react";
import Icon from "../../../../components/icon/icon";
import Modal from "../../../../components/modal/modal";
import Bibliotheque from "../3d/bibliotheque/bibliotheque";
import { base64ToBlob } from "../../../../utils/utils";
import {
  TabPane,
  TabPaneButton,
  TabPaneContent,
  TabPaneNav,
} from "../../../../components/tabpane";
import ModelViewer from "../3d/ModelViewer";
import AnnotationEditor from "../3d/AnnotationEditor";

export default function GlbPicker({ save, data }) {
  const [file, setFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewOpen, setOpenPreview] = useState(false);
  const inputRef = useRef();
  const [previewUrl, setPreviewUrl] = useState(null);

  /**
   *
   * @param {File} file
   */
  const handleFile = (file) => {
    if (!file || !file.name.match(/\.glb$/i)) return;

    const fileMetadata = {
      name: file.name,
      size: file.size,
      lastModified: file.lastModified,
      type: file.type,
    };

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      const result = reader.result;
      save({ file: fileMetadata, content: result });
    };
  };

  const handleSelect = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handlePreview = () => {
    if (data.content) {
      const blob = base64ToBlob(data.content);
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    } else if (data.path) {
      setPreviewUrl(data.path);
    }

    setOpenPreview(true);
  };

  const handlePreviewStop = () => {
    setOpenPreview(false);
    URL.revokeObjectURL(previewUrl);
  };

  const onChoose = ({ name, path }) => {
    save({ file: { name }, path });
    closeBibliothequeModal();
  };

  const handleRemove = () => {
    save(null);
    inputRef.current.value = null;
  };

  const openBibliothequeModal = () => {
    setIsModalOpen(true);
  };

  const closeBibliothequeModal = () => {
    setIsModalOpen(false);
  };

  const onSaveAnnotations = (annotations) => {
    save({ annotations });
  };

  return (
    <>
      {!data && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="flex flex-col items-center gap-2 w-full p-4 border"
        >
          <Icon name="3d" className="w-10" />
          <p>Glissez un fichier .glb ici</p>
          <form>
            <label className="cursor-pointer px-4 py-2 bg-indigo-700 text-white rounded hover:bg-indigo-900 text-xs transition-all duration-300 ease-in-out">
              Sélectionner un modèle depuis votre ordinateur
              <input
                type="file"
                accept=".glb,.gltf"
                className="hidden"
                ref={inputRef}
                onChange={handleSelect}
              />
            </label>
            <p
              role="button"
              onClick={openBibliothequeModal}
              className="cursor-pointer mt-2 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-900 text-xs transition-all duration-300 ease-in-out"
            >
              Sélectionner un modèle depuis la bibliotheque
            </p>
          </form>
          <Modal
            title="Bibliotheque de modele"
            isOpen={isModalOpen}
            onClose={closeBibliothequeModal}
          >
            <Bibliotheque onChoose={onChoose} />
          </Modal>
        </div>
      )}
      {data && (
        <>
          <div className="w-full flex flex-col items-center gap-2">
            <p className="text-sm text-gray-700 font-medium text-center truncate w-full">
              🧊 {data.file.name}
            </p>
            <div className="flex justify-center space-x-4 bg-blue-400 rounded-sm mb-3 w-20 h-5 m-auto">
              <Icon
                role="button"
                name="trash"
                onClick={handleRemove}
                className="text-red-600 text-sm hover:underline w-3"
              />

              <Icon
                role="button"
                name="preview"
                onClick={handlePreview}
                className="cursor-pointer  w-3"
              />
            </div>
          </div>
          {previewUrl && (
            <Modal isOpen={previewOpen} onClose={handlePreviewStop}>
              <div className="h-full">
                <TabPane defaultValue="viewer">
                  <TabPaneContent value="viewer">
                    <div className="flex flex-col h-full">
                      <ModelViewer
                        modelPath={previewUrl}
                        className="flex-1 flex gap-3"
                        renderingConfig={{
                          annotations: data.annotations,
                        }}
                      />
                      <TabPaneNav>
                        <TabPaneButton value="annotation" className="h-20">
                          Modifier ce modele
                        </TabPaneButton>
                      </TabPaneNav>
                    </div>
                  </TabPaneContent>
                  <TabPaneContent value="annotation">
                    <div className="flex flex-col h-full">
                      <AnnotationEditor
                        modelPath={previewUrl}
                        onSaveAnnotations={onSaveAnnotations}
                        className="flex-1 max-h-full"
                        initialAnnotations={data.annotations}
                      />
                      <TabPaneNav>
                        <TabPaneButton value="viewer">Terminer</TabPaneButton>
                      </TabPaneNav>
                    </div>
                  </TabPaneContent>
                </TabPane>
              </div>
            </Modal>
          )}
        </>
      )}
    </>
  );
}
