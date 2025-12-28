import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";

import SortableModuleItem from "./sortableItem";

export default function ModuleSortList({ modules, setModules, onSorted }) {
  return (
    <>
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={(event) => {
          const { active, over } = event;

          if (!over || active.id === over.id) return;

          setModules((items) => {
            const oldIndex = items.findIndex((i) => i.id === active.id);
            const newIndex = items.findIndex((i) => i.id === over.id);

            const reordered = arrayMove(items, oldIndex, newIndex);

            return reordered.map((item, index) => ({
              ...item,
              ordre: index + 1,
            }));
          });
        }}
      >
        <SortableContext items={modules.map((l) => l.id)}>
          <ul className="flex gap-2 flex-wrap">
            {modules.map((m) => (
              <li key={m.id}>
                <SortableModuleItem module={m} />
              </li>
            ))}
          </ul>
        </SortableContext>
      </DndContext>
      <div className="flex justify-end py-2 my-4">
        <button
          onClick={onSorted}
          className="flex items-center gap-1 bg-green-700 cursor-pointer text-white px-4 py-1.5 rounded-md hover:bg-green-900 transition"
        >
          Enregistrer
        </button>
      </div>
    </>
  );
}
