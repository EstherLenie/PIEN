import { defer } from "react-router-dom";
import { sendRequest } from "../../services/utils/request";
import COURS from "../../services/api/cours";

export default async function newLeconLoader({ params }) {
  const { classeId, moduleId, leconId } = params;
  return defer({
    lecon: sendRequest(
      COURS.GET_LECON_ACTIVE_VERSION({ classeId, moduleId, leconId })
    ).then((r) => {
      return { ...r.body, versionActive: r.body.versions?.[0] };
    }),
  });
}
