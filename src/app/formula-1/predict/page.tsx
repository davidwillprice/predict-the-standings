"use client";

import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  DragEndEvent,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { SortableItem } from "./sortable-item";

import { entrants } from "../../data/formula-1/2023";

const {
  ham,
  bot,
  lec,
  sai,
  ver,
  per,
  alo,
  oco,
  hul,
  mag,
  nor,
  pia,
  ric,
  str,
  zho,
  alb,
  tsu,
  gas,
  sar,
  rus,
} = entrants.drivers;

export default function Page() {
  const [entrants, setEntrants] = useState([
    ham,
    bot,
    lec,
    sai,
    ver,
    per,
    alo,
    oco,
    hul,
    mag,
    nor,
    pia,
    ric,
    str,
    zho,
    alb,
    tsu,
    gas,
    sar,
    rus,
  ]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  console.log(entrants);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}>
      <table>
        <SortableContext
          items={entrants.map((entrant) => entrant.number)}
          strategy={verticalListSortingStrategy}>
          {entrants.map((entrant, index) => (
            <SortableItem
              id={entrant.number}
              standing={index + 1}
              key={entrant.number}
              entrant={entrant}
            />
          ))}
        </SortableContext>
      </table>
    </DndContext>
  );

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over) return;
    if (active.id !== over.id) {
      setEntrants((entrants) => {
        const oldIndex = entrants.findIndex(
          (entrant) => entrant.number === active.id
        );
        const newIndex = entrants.findIndex(
          (entrant) => entrant.number === over.id
        );

        return arrayMove(entrants, oldIndex, newIndex);
      });
    }
  }
}
