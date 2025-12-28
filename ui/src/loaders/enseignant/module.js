import { defer } from "react-router-dom";
import { sendRequest } from "../../services/utils/request";
import COURS from "../../services/api/cours";

export default async function ({ params }) {
  const { classeId, moduleId } = params;

  return defer({
    module: sendRequest(COURS.GET_MODULE_LECONS({ classeId, moduleId })).then(
      (r) => (r.ok ? r.body : {})
    ),
  });
}
