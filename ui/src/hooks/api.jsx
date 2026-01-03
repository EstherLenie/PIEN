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

  const download = async (config) => {
    let result;

    try {
      const res = await fetch(config.url);
      const blob = await res.blob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = config.filename;
      a.click();

      URL.revokeObjectURL(url);
    } catch (e) {}
  };

  const uploadFile = async ({ url, formData }) => {
    const res = await fetch(url, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Upload failed");
    }

    return res.json();
  };

  return { execute, download, requestState, uploadFile };
}
