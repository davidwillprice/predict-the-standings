"use client";

import { useState, forwardRef, HTMLAttributes, CSSProperties, FC } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { EntrantRow } from "@components/entrant-table/entrant-row";

import {
  AllEntrants,
  Entrant,
  ShortHandCompStr,
} from "@custom-types/game-types";

import styles from "@components/entrant-table/entrant-table.module.scss";

type Props = {
  allEntrants: AllEntrants;
  competition: ShortHandCompStr;
  entrantArr: Entrant[];
  entrantType: string;
  handleEntrantState: (entrantArr: Entrant[]) => void;
};

export function EditablePredictionTable({
  allEntrants,
  competition,
  entrantArr,
  entrantType,
  handleEntrantState,
}: Props) {
  const [activeId, setActiveId] = useState(null);
  const [items, setItems] = useState(
    entrantArr.map((entrant) => entrant.sName)
  );
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    setActiveId(null);
    const { active, over } = event;

    const reorderItems = (items: string[]) => {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      return arrayMove(items, oldIndex, newIndex);
    };

    if (active.id !== over.id) {
      setItems(reorderItems);
      handleEntrantState(
        reorderItems(items).map((item) => allEntrants[entrantType][item])
      );
    }
  };

  return (
    <div
      className={`${styles.editable_prediction_table} ${
        Object.keys(allEntrants).length === 1
          ? styles.single_entrant_type_table
          : ""
      }`}>
      <table className={styles.table}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}>
          <tbody
            style={{
              gridTemplateRows: `repeat(${Math.ceil(items.length / 2)}, auto)`,
            }}>
            <SortableContext items={items} strategy={rectSortingStrategy}>
              {items.map((id, index) => (
                <SortableItem
                  key={id}
                  id={id}
                  index={index}
                  items={items}
                  competition={competition}
                  entrant={allEntrants[entrantType][id]}
                />
              ))}
              <DragOverlay adjustScale style={{ transformOrigin: "0 0 " }}>
                {activeId ? (
                  <Item
                    id={activeId}
                    competition={competition}
                    items={items}
                    index={null}
                    entrant={allEntrants[entrantType][activeId]}
                    isDragging
                  />
                ) : null}
              </DragOverlay>
            </SortableContext>
          </tbody>
        </DndContext>
      </table>
    </div>
  );
}

export type ItemProps = HTMLAttributes<HTMLTableRowElement> & {
  id: string;
  competition: string;
  entrant: Entrant;
  withOpacity?: boolean;
  isDragging?: boolean;
  index: number | null;
  items: string[];
};

const Item = forwardRef<HTMLTableRowElement, ItemProps>(
  (
    {
      id,
      competition,
      entrant,
      withOpacity,
      isDragging,
      style,
      index,
      items,
      ...props
    },
    ref
  ) => {
    const inlineStyles: CSSProperties = {
      opacity: withOpacity ? "0.2" : "1",
      cursor: isDragging ? "grabbing" : "grab",
      transform: isDragging ? "scale(1.02)" : "scale(1)",
      ...style,
    };
    /**@todo Would be nice to better incorporate the <tr> within EntrantRow while keeping the dragging functionality working */
    return (
      <tr
        className={styles.table_row}
        ref={ref}
        style={inlineStyles}
        {...props}>
        <EntrantRow
          draggable={true}
          entrant={entrant}
          index={index}
          shortHandCompStr={competition}
        />
      </tr>
    );
  }
);
Item.displayName = "Item";

const SortableItem: FC<ItemProps> = (props: any) => {
  const {
    isDragging,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
  };

  return (
    <Item
      ref={setNodeRef}
      style={style}
      withOpacity={isDragging}
      {...props}
      {...attributes}
      {...listeners}
    />
  );
};
