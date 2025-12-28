import cacheInstance from "../../utils/cacheService";

/**
 *
 * @param {} config
 * @returns
 */
export const sendRequest = async ({
  method = "GET",
  body,
  url,
  cacheOptions = { cacheFirst: false, cacheResponse: false },
}) => {
  if (cacheOptions.cacheFirst) {
    const result = cacheInstance.get(url);
    if (result != null) {
      return { ok: true, body: result };
    }
  }
  const response = await fetch(url, {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const responseData = await response.json();

  if (!response.ok) {
    return { ok: false, errorData: responseData, code: response.status };
  }

  if (cacheOptions.cacheResponse) {
    cacheInstance.set(url, responseData.data);
  }
  return { ok: true, body: responseData.data };
};
