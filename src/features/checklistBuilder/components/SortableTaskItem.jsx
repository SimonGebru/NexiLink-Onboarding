import { useState } from "react";
import { useSortable } from "@dnd-kit/react/sortable";

export function SortableTaskItem({ id, index, children }) {
  const [element, setElement] = useState(null);
  const { isDragging } = useSortable({ id, index, element });

  return (
    <div ref={setElement} className={isDragging ? "opacity-50" : ""}>
      {children}
    </div>
  );
}
