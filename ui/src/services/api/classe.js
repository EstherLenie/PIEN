const host = "/api/classes";

const CLASSE = {};

CLASSE.ALL = () => ({
  method: "GET",
  url: host,
});

CLASSE.ENSEIGNANT = (enseignantId) => ({
  method: "GET",
  url: host + "/" + enseignantId,
  cacheOptions: { cacheFirst: true, cacheResponse: true },
});

export default CLASSE;
