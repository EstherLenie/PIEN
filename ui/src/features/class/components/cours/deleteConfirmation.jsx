export default function DeleteConfirmation({
  onChange,
  supressionState,
  onDelete,
}) {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="w-120 px-4 py-4 flex flex-col items-start gap-4"
    >
      <label htmlFor="delete" className="">
        Veuillez confirmer la suppression. Tapez{" "}
        <span className="italic text-gray-500">"confirmer"</span> dans le champs
        de texte ci-dessous.
      </label>
      <input
        id="delete"
        type="text"
        placeholder="confirmer"
        value={supressionState}
        onChange={onChange}
        className="border w-full rounded-sm p-2"
      />
      <button
        disabled={supressionState !== "confirmer"}
        type="submit"
        onClick={onDelete}
        className="bg-red-500 text-white py-2 px-4 rounded-sm disabled:cursor-not-allowed disabled:bg-red-200"
      >
        Supprimer
      </button>
    </form>
  );
}
