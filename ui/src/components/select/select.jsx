import React, { useState, useEffect, useMemo } from "react";

/**
 * Select asynchrone avec filtrage local des options
 * @param {Object} props
 * @param {function} props.fetchOptions - Fonction asynchrone qui retourne les options
 * @param {string} props.value - Valeur actuelle du select
 * @param {function} props.onChange - Callback quand la valeur change
 * @param {string} props.placeholder - Texte par défaut
 * @param {string} props.className - Classes CSS supplémentaires
 * @param {boolean} props.disabled - Désactive le select
 * @param {function} props.getOptionLabel - Fonction pour formater l'affichage des options
 * @param {function} props.getOptionValue - Fonction pour récupérer la valeur des options
 * @param {boolean} props.showSearch - Affiche le champ de recherche
 * @param {string} props.searchPlaceholder - Placeholder du champ de recherche
 * @param {function} props.filterFunction - Fonction personnalisée de filtrage
 * @param {string} props.emptyMessage - Message quand aucune option ne correspond
 * @param {boolean} props.cacheResults - Met en cache les résultats pour éviter de recharger
 */
const AsyncSelect = ({
  fetchOptions,
  value,
  onChange,
  placeholder = "Sélectionner...",
  className = "",
  disabled = false,
  getOptionLabel = (option) => option.label || option.name || String(option),
  getOptionValue = (option) => option.value || option.id || option,
  showSearch = true,
  searchPlaceholder = "Rechercher...",
  filterFunction = null,
  emptyMessage = "Aucun résultat",
  cacheResults = true,
  ...props
}) => {
  const [options, setOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [cachedData, setCachedData] = useState(null);
  const selectRef = React.useRef(null);

  // Chargement initial des options
  useEffect(() => {
    loadOptions();
  }, []);

  // Fermer le dropdown quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtrer les options quand le terme de recherche change
  useEffect(() => {
    filterOptions();
  }, [searchTerm, options]);

  const loadOptions = async () => {
    if (!fetchOptions) return;

    // Utiliser le cache si disponible et activé
    if (cacheResults && cachedData) {
      setOptions(cachedData);
      setFilteredOptions(cachedData);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchOptions();
      const optionsArray = Array.isArray(data) ? data : [];

      setOptions(optionsArray);
      setFilteredOptions(optionsArray);

      if (cacheResults) {
        setCachedData(optionsArray);
      }
    } catch (err) {
      setError(err.message || "Erreur lors du chargement des options");
      console.error("Erreur AsyncSelect:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterOptions = () => {
    if (!searchTerm.trim()) {
      setFilteredOptions(options);
      return;
    }

    const term = searchTerm.toLowerCase().trim();

    if (filterFunction) {
      // Utiliser la fonction de filtrage personnalisée
      const filtered = options.filter((option) => filterFunction(option, term));
      setFilteredOptions(filtered);
    } else {
      // Filtrage par défaut sur le label
      const filtered = options.filter((option) => {
        const label = getOptionLabel(option).toLowerCase();
        return label.includes(term);
      });
      setFilteredOptions(filtered);
    }
  };

  const handleRefresh = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCachedData(null); // Invalider le cache
    loadOptions();
  };

  const handleSelectChange = (optionValue) => {
    onChange?.(optionValue);
    setIsOpen(false);
    setSearchTerm(""); // Réinitialiser la recherche après sélection
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (!isOpen) setIsOpen(true);
  };

  // Trouver l'option sélectionnée pour l'afficher
  const selectedOption = useMemo(() => {
    return options.find((option) => getOptionValue(option) == value);
  }, [options, value, getOptionValue]);

  return (
    <div className="relative" ref={selectRef}>
      {/* Champ de sélection principal */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || isLoading}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm
          text-left flex items-center justify-between
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? "border-red-500" : "border-gray-300"}
          ${className}
        `}
      >
        <span className="truncate">
          {isLoading
            ? "Chargement..."
            : selectedOption
            ? getOptionLabel(selectedOption)
            : placeholder}
        </span>

        <div className="flex items-center space-x-2 ml-2">
          {/* Indicateur de chargement */}
          {isLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          )}

          {/* Flèche dropdown */}
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isOpen ? "transform rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Dropdown avec options */}
      {isOpen && !disabled && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {/* Champ de recherche */}
          {showSearch && (
            <div className="p-2 border-b">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder={searchPlaceholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                autoFocus
              />

              {/* Statistiques de recherche */}
              {searchTerm && (
                <div className="mt-1 text-xs text-gray-500">
                  {filteredOptions.length} résultat
                  {filteredOptions.length !== 1 ? "s" : ""} sur {options.length}
                </div>
              )}
            </div>
          )}

          {/* Liste des options */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-center text-gray-500 text-sm">
                {searchTerm ? emptyMessage : "Aucune option disponible"}
              </div>
            ) : (
              filteredOptions.map((option, index) => {
                const optionValue = getOptionValue(option);
                const optionLabel = getOptionLabel(option);
                const isSelected = optionValue === value;

                return (
                  <button
                    key={optionValue || index}
                    type="button"
                    onClick={() => handleSelectChange(optionValue)}
                    className={`
                      w-full text-left px-3 py-2 hover:bg-blue-50
                      ${
                        isSelected
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-900"
                      }
                      flex items-center justify-between
                    `}
                  >
                    <span className="truncate">{optionLabel}</span>
                    {isSelected && (
                      <svg
                        className="w-5 h-5 text-blue-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Actions en bas du dropdown */}
          <div className="border-t p-2 bg-gray-50 flex justify-between items-center">
            <button
              type="button"
              onClick={handleRefresh}
              className="text-xs text-gray-600 hover:text-gray-900 flex items-center"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Actualiser
            </button>

            <div className="text-xs text-gray-500">
              {options.length} option{options.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="mt-1 text-sm text-red-600 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
          <button
            type="button"
            onClick={loadOptions}
            className="ml-2 text-blue-500 hover:text-blue-700 underline text-xs"
          >
            Réessayer
          </button>
        </div>
      )}
    </div>
  );
};

export default AsyncSelect;

export const AsyncSelectNative = ({
  fetchOptions,
  value,
  onChange,
  placeholder = "Sélectionner...",
  className = "",
  disabled = false,
  getOptionLabel = (option) => option.label || option.name || String(option),
  getOptionValue = (option) => option.value || option.id || option,
  showSearch = true,
  searchPlaceholder = "Filtrer...",
  ...props
}) => {
  const [options, setOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);

  useEffect(() => {
    loadOptions();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredOptions(options);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = options.filter((option) =>
        getOptionLabel(option).toLowerCase().includes(term)
      );
      setFilteredOptions(filtered);
    }
  }, [searchTerm, options]);

  const loadOptions = async () => {
    if (!fetchOptions) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchOptions();
      const optionsArray = Array.isArray(data) ? data : [];
      setOptions(optionsArray);
      setFilteredOptions(optionsArray);
    } catch (err) {
      setError(err.message || "Erreur lors du chargement des options");
      console.error("Erreur AsyncSelectNative:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      {showSearch && (
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setShowSearchInput(!showSearchInput)}
            className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
          >
            🔍 Filtrer
          </button>

          {showSearchInput && (
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={searchPlaceholder}
              className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm"
            />
          )}
        </div>
      )}

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled || isLoading}
          className={`
            w-full px-3 py-2 border rounded-md shadow-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? "border-red-500" : "border-gray-300"}
            ${className}
          `}
          {...props}
        >
          <option value="">{isLoading ? "Chargement..." : placeholder}</option>

          {filteredOptions.map((option, index) => {
            const optionValue = getOptionValue(option);
            const optionLabel = getOptionLabel(option);

            return (
              <option key={optionValue || index} value={optionValue}>
                {optionLabel}
              </option>
            );
          })}
        </select>

        {isLoading && (
          <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}

        {!isLoading && !disabled && (
          <button
            type="button"
            onClick={loadOptions}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            title="Actualiser les options"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        )}
      </div>

      {showSearch && searchTerm && (
        <div className="text-xs text-gray-500">
          {filteredOptions.length} résultat
          {filteredOptions.length !== 1 ? "s" : ""} sur {options.length}
        </div>
      )}

      {error && (
        <div className="text-sm text-red-600">
          {error}
          <button
            type="button"
            onClick={loadOptions}
            className="ml-2 text-blue-500 hover:text-blue-700 underline text-xs"
          >
            Réessayer
          </button>
        </div>
      )}
    </div>
  );
};
