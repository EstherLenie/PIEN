const host = "http://localhost:8080/api/classes";

const CLASSE = {};

CLASSE.ALL = () => ({
  method: "GET",
  url: host,
});

CLASSE.ENSEIGNANT = (enseignantId) => ({
  method: "GET",
  url: host + "/teacher/" + enseignantId,
  cacheOptions: { cacheFirst: true, cacheResponse: true },
});

CLASSE.BYID = (classeId) => ({
  method: "GET",
  url: host + "/classes/" + classeId,
  cacheOptions: { cacheFirst: true, cacheResponse: true },
});

export default CLASSE;
