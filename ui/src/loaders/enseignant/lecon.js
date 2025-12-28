import { defer } from "react-router-dom";
import { sendRequest } from "../../services/utils/request";
import COURS from "../../services/api/cours";

export default async function leconLoader({ params }) {
  const { classeId, moduleId, leconId, versionId } = params;
  return defer({
    lecon: sendRequest(
      COURS.GET_LECON_VERSION({ classeId, moduleId, leconId, versionId })
    ).then((r) => {
      return { ...r.body, versionActive: r.body.versions?.[0] };
    }),
  });
}
