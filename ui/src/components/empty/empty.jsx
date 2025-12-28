import Empty from "../../assets/icons/empty.svg?react";

const EmptyState = ({
  title = "Aucun élément trouvé",
  message = "Il n'y a pas d'éléments à afficher pour le moment.",
  icon = <Empty className="w-12 h-12 text-gray-400" />,
  actionButton = null,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="mb-6">{icon}</div>

      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>

      <p className="text-gray-500 max-w-md mb-8">{message}</p>

      {actionButton && <div className="mt-4">{actionButton}</div>}
    </div>
  );
};

export default EmptyState;
