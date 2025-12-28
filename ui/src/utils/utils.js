export function capitalize(s) {
  if (!s) return "";
  return s[0].toUpperCase().concat(s.substring(1));
}

export const storage = {
  getUser: () => JSON.parse(localStorage.getItem("user")),
  setUser: (user) => localStorage.setItem("user", JSON.stringify(user)),
};

export function deepCopyJSON(obj) {
  return JSON.parse(JSON.stringify(obj));
}
export const apiUrl="api/"
export const baseUrl= `http://${window.location.hostname}:8080/`

/**
 *
 * @param {string} base64String
 * @returns {Blob}
 */
export function base64ToBlob(base64String) {
  if (!base64String.startsWith("data:")) {
    throw new Error("Chaîne data: URL attendue.");
  }

  const [meta, rawBase64] = base64String.split(",");
  const mimeMatch = meta.match(/^data:(.+);base64$/);

  if (!mimeMatch) {
    throw new Error("Format d'en-tête invalide.");
  }

  const mimeType = mimeMatch[1];
  const cleanedBase64 = rawBase64.replace(/[\r\n\s]/g, "");

  const binary = atob(cleanedBase64);
  const buffer = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    buffer[i] = binary.charCodeAt(i);
  }

  return new Blob([buffer], { type: mimeType });
}

/**
 *
 * @returns {string}
 */
export function colorRand() {
  function rand() {
    return (Math.random() * 15).toFixed(0);
  }

  const values = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
  ];
  let color = "#";

  for (let i = 0; i <= 5; i++) {
    color = color.concat(values[rand()]);
  }

  return color;
}

export function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function isEmpty(p) {
  if (p === null) return true;

  if (p.trim && p.trim() === "") {
    return true;
  }

  if (Array.isArray(p) && p.length === 0) {
    return true;
  }
}

export function id() {
  return crypto.randomUUID();
}

export function split(a) {
  return a
    .split("\n")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}
