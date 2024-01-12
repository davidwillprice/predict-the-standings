import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Entrant } from "../../data/formula-1/2023";

interface Props {
  id: number;
  entrant: Entrant;
  standing: number;
}

export function SortableItem({ id, entrant, standing }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    backgroundColor: "white",
    border: "2px solid black",
    transition,
  };

  return (
    <tr ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <td>{standing}</td>
      <td>{entrant.fName}</td>
    </tr>
  );
}
