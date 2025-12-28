import { useState } from "react";

const getGoogleMapsEmbedCode = (url) => {
  // Regex pour les URL d'intégration de Google Maps
  const googleMapsRegex =
    /(?:https?:\/\/(?:www\.)?google\.com\/maps\/embed\?pb=.*)/;
  const googleMapsMatch = url.match(googleMapsRegex);
  // Vérifie si l'URL est un lien d'intégration valide
  if (googleMapsMatch) {
    // Si l'URL contient des guillemets (cas où l'utilisateur a copié le code complet), on extrait l'URL
    return url.includes('"') ? url.split('"')[1] : url;
  }

  return null;
};

export default function GoogleMapsEmbed({ data, save }) {
  const [inputValue, setInputValue] = useState("");
  const embedUrl = data?.embedUrl;
  const [error, setError] = useState(null);

  const handleEmbed = () => {
    setError(null);
    const url = getGoogleMapsEmbedCode(inputValue);
    if (url) {
      save({ embedUrl: url });
      setInputValue("");
    } else {
      setError(
        "URL d'intégration Google Maps non valide. Assurez-vous de copier le code d'intégration complet."
      );
    }
  };

  const deleteEmbed = () => {
    save({ embedUrl: null });
  };

  return (
    <div className="p-4 bg-white rounded-md shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Carte Google Maps
      </h3>
      {embedUrl ? (
        <div className="flex flex-col gap-4">
          <iframe
            className="w-full rounded-md h-100"
            src={`${embedUrl}`}
            allowfullscreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <button
            onClick={deleteEmbed}
            className="px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors duration-200 self-start"
          >
            Supprimer
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label
              htmlFor="embed-maps-url"
              className="text-sm font-medium text-gray-700"
            >
              Coller le code d'intégration (iframe) de Google Maps :
            </label>
            <input
              id="embed-maps-url"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder='Ex: <iframe src="https://www.google.com/maps/embed?pb=..."'
            />
          </div>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          <button
            onClick={handleEmbed}
            className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors duration-200 self-start"
          >
            Intégrer
          </button>
        </div>
      )}
    </div>
  );
}
