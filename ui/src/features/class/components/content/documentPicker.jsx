import { useState, useRef, useEffect } from "react";
import Icon from "../../../../components/icon/icon";
import { base64ToBlob } from "../../../../utils/utils";
import MULTIMEDIA from "../../../../services/api/multimedia";
import useApi from "../../../../hooks/api";

const types = [
  ".pdf",
  ".docx",
  ".txt",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
  ".md",
];

export default function DocumentPicker({
  data,
  save = () => {},
  allowedTypes = types,
}) {
  const inputRef = useRef();
  const { execute } = useApi();
  const iconName = data
    ? data.filename.split(".").pop().toLowerCase().substring(0, 3)
    : "";

  let objectUrl = useRef();

  /**
   *
   * @param {File} file
   * @returns
   */
  const handleFile = (file) => {
    const extension = file.name.split(".").pop().toLowerCase();
    if (!allowedTypes.includes("." + extension)) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      save({ filename: file.name, mimeType: file.type, content: result });
    };
    reader.readAsDataURL(file);
  };

  const handleSelect = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    save(null);
  };

  const handlePreview = () => {
    if (!objectUrl.current) return;
    window.open(objectUrl.current, "_blank");
  };

  const loadFile = async () => {
    if (!data) {
      return;
    }
    debugger;
    let blob;
    if (data.content) {
      blob = base64ToBlob(data.content);
    } else if (data.filePath) {
      blob = await execute({ url: MULTIMEDIA.GET_FILE(data.filePath) });
    }

    if (!blob?.data) {
      return;
    }

    objectUrl.current = URL.createObjectURL(blob.data);

    return () => {
      URL.revokeObjectURL(objectUrl.current);
    };
  };

  useEffect(() => {
    loadFile();
  }, [data]);

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="flex flex-col items-center gap-2 w-full p-4 border"
    >
      {!data && (
        <>
          <Icon name="document" className="w-10" />
          <p>Glissez un document ici</p>
          <p>ou</p>
          <label className="cursor-pointer px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-800 text-xs transition-all duration-300 ease-in-out">
            Sélectionner un document depuis votre ordinateur
            <input
              type="file"
              accept={allowedTypes.join(",")}
              className="hidden"
              ref={inputRef}
              onChange={handleSelect}
            />
          </label>
        </>
      )}

      {data && (
        <div className="w-full flex flex-col items-center gap-2">
          <Icon name={iconName} className="w-10" />
          <p className="text-sm text-gray-700 font-medium text-center truncate w-full">
            {data.filename}
          </p>
          <div className="flex justify-center space-x-4 bg-blue-400 rounded-sm mb-3 w-20 h-5 m-auto">
            <Icon
              role="button"
              name="trash"
              onClick={handleRemove}
              className="text-red-600 cursor-pointer w-3"
            />

            <Icon
              role="button"
              name="preview"
              onClick={handlePreview}
              className="cursor-pointer  w-3"
            />
          </div>
        </div>
      )}
    </div>
  );
}
