const host = "/api/cours";

const COURS = {};

COURS.GET_MODELS = () => ({
  method: "GET",
  url: host + "/models",
});

COURS.GET_ENVIRONMENTS = () => ({
  method: "GET",
  url: host + "/models/presets",
});

COURS.GET_MODULES = (classeId) => ({
  method: "GET",
  url: host + "/classes/" + classeId + "/modules",
  cacheOptions: { cacheResponse: true, cacheFirst: true },
});

COURS.GET_MODULE = ({ classeId, moduleId }) => ({
  method: "GET",
  url: host + "/classes/" + classeId + "/modules/" + moduleId,
  cacheOptions: { cacheResponse: true, cacheFirst: true },
});

COURS.GET_MODULE_LECONS = ({ classeId, moduleId }) => ({
  method: "GET",
  url: host + "/classes/" + classeId + "/modules/" + moduleId + "/lessons",
});

COURS.CREATE_MODULE = ({ classeId, data }) => ({
  method: "POST",
  url: host + "/classes/" + classeId + "/modules",
  body: data,
});

COURS.CREATE_LESSON = ({ classeId, moduleId, data }) => ({
  method: "POST",
  url: host + "/classes/" + classeId + "/modules/" + moduleId,
  body: data,
});

COURS.SAVE_CONTENT = ({ classeId, moduleId, leconId, data }) => ({
  method: "PUT",
  url:
    host +
    "/classes/" +
    classeId +
    "/modules/" +
    moduleId +
    "/lessons/" +
    leconId,
  body: data,
});

COURS.NEW_CONTENT = ({ classeId, moduleId, leconId, data }) => ({
  method: "POST",
  url:
    host +
    "/classes/" +
    classeId +
    "/modules/" +
    moduleId +
    "/lessons/" +
    leconId,
});

COURS.EDIT_MODULE = ({ classeId, moduleId, data }) => ({
  method: "PUT",
  url: host + "/classes/" + classeId + "/modules/" + moduleId,
  body: data,
});

COURS.UPLOAD_FILE = ({ classeId, leconId, moduleId, versionId, data }) => {
  const formData = new FormData();
  formData.append("file", data);

  return {
    url: `${host}/classes/${classeId}/modules/${moduleId}/lecons/${leconId}/versions/${versionId}/files`,
    formData: formData,
  };
};

COURS.GET_LECON_ACTIVE_VERSION = ({ classeId, moduleId, leconId }) => ({
  method: "GET",
  url:
    host +
    "/classes/" +
    classeId +
    "/modules/" +
    moduleId +
    "/lessons/" +
    leconId +
    "/gerer",
});

COURS.GET_LECON = ({ classeId, moduleId, leconId }) => ({
  method: "GET",
  url:
    host +
    "/classes/" +
    classeId +
    "/modules/" +
    moduleId +
    "/lessons/" +
    leconId,
});

COURS.GET_LECON_VERSION = ({ classeId, moduleId, leconId, versionId }) => ({
  method: "GET",
  url:
    host +
    "/classes/" +
    classeId +
    "/modules/" +
    moduleId +
    "/lessons/" +
    leconId +
    "/contenus/" +
    versionId,
});

COURS.SORT_LECONS = ({ classeId, moduleId, data }) => ({
  method: "PUT",
  url:
    host + "/classes/" + classeId + "/modules/" + moduleId + "/order-lessons",
  body: data,
});

COURS.SORT_MODULES = ({ classeId, data }) => ({
  method: "PUT",
  url: host + "/classes/" + classeId + "/order-modules",
  body: data,
});

COURS.DELETE_MODULE = ({ classeId, moduleId }) => ({
  method: "DELETE",
  url: host + "/classes/" + classeId + "/modules/" + moduleId,
});

COURS.DELETE_LECON = ({ classeId, moduleId, leconId }) => ({
  method: "DELETE",
  url:
    host +
    "/classes/" +
    classeId +
    "/modules/" +
    moduleId +
    "/lessons/" +
    leconId,
});

COURS.DELETE_LECON_CONTENT = ({ classeId, moduleId, leconId, versionId }) => ({
  method: "DELETE",
  url:
    host +
    "/classes/" +
    classeId +
    "/modules/" +
    moduleId +
    "/lessons/" +
    leconId +
    "/versions/" +
    versionId,
});

export default COURS;
