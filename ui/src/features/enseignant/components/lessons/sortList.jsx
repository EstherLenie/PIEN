import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";

import SortableLeconItem from "./sortableItem";

export default function LeconSortList({ lecons, setLecons, onSort }) {
  return (
    <>
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={(event) => {
          const { active, over } = event;

          if (!over || active.id === over.id) return;

          setLecons((items) => {
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
        <SortableContext items={lecons.map((l) => l.id)}>
          <ul className="flex gap-2 flex-wrap">
            {lecons.map((lecon) => (
              <li key={lecon.id}>
                <SortableLeconItem lecon={lecon} />
              </li>
            ))}
          </ul>
        </SortableContext>
      </DndContext>
      <div className="flex justify-end py-2 my-4">
        <button
          onClick={onSort}
          className="flex items-center gap-1 bg-green-700 cursor-pointer text-white px-4 py-1.5 rounded-md hover:bg-green-900 transition"
        >
          Enregistrer
        </button>
      </div>
    </>
  );
}
