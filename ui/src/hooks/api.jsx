import { useState } from "react";
import { sendRequest } from "../services/utils/request";

export default function useApi() {
  const [requestState, setRequestState] = useState({
    loading: false,
    error: false,
    result: null,
  });

  const execute = async (config, cb, force = false) => {
    setRequestState((state) => ({
      ...state,
      loading: true,
      error: null,
    }));

    let result;

    try {
      result = await sendRequest(config);

      if (result.ok) {
        const response = { data: result.body };

        if (cb) return cb(response);
        return response;
      }
      if (result.errorData.code === 401) {
        return;
      }
      if (!result.ok && result.code === 404) {
        return { error: result.errorData };
      }
    } catch (err) {
      const message =
        err instanceof TypeError
          ? "Network error: please check your internet connection."
          : err.message || "Erreur inconnue";
      setRequestState((state) => ({
        ...state,
        loading: false,
        error: message,
      }));
    } finally {
      setRequestState((state) => ({
        ...state,
        loading: false,
      }));
    }
  };

  return { execute, requestState };
}
