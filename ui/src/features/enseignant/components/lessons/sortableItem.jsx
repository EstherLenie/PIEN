import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import LeconItem from "./leconItem";

export default function SortableLeconItem({ lecon }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: lecon.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <LeconItem lecon={lecon} />
    </div>
  );
}
