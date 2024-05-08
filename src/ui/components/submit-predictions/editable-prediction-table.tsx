"use client";

import { useState, forwardRef, HTMLAttributes, CSSProperties, FC } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
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

import { FlagCell } from "@components/prediction-table/eurovision-flag-cell";

import { AllEntrants, Competition, Entrant } from "@custom-types/game-types";

import predictionTableStyles from "@components/prediction-table/prediction-table.module.scss";
import styles from "@components/submit-predictions/editable-prediction-table.module.scss";

type Props = {
  allEntrants: AllEntrants;
  competition?: Competition;
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
    // useSensor(PointerSensor),
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
      className={`${predictionTableStyles.prediction_table} ${styles.editable_prediction_table}`}>
      <table>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}>
          <tbody
            style={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: `repeat(2, 1fr)`,
              gridTemplateRows: `repeat(${Math.ceil(items.length / 2)}, auto)`,
              gridAutoFlow: "column",
              gap: "5px",
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
              {/* <DragOverlay adjustScale={true}>
                {activeId ? (
                  <SortableItem
                    key={activeId}
                    id={activeId}
                    index={"1"}
                    value={activeId}
                    competition={competition}
                    entrant={allEntrants[entrantType][activeId]}
                  />
                ) : null}
              </DragOverlay> */}
            </SortableContext>
          </tbody>
        </DndContext>
      </table>
    </div>
  );
}

export type ItemProps = HTMLAttributes<HTMLTableRowElement> & {
  id: string;
  competition: string | undefined;
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
      opacity: withOpacity ? "0.5" : "1",
      transformOrigin: "50% 50%",
      touchAction: "none",
      borderRadius: "10px",
      cursor: isDragging ? "grabbing" : "grab",
      // display: "flex",
      // justifyContent: "center",
      // alignItems: "center",
      userSelect: "none",
      // boxShadow: isDragging
      //   ? "rgb(63 63 68 / 5%) 0px 2px 0px 2px, rgb(34 33 81 / 15%) 0px 2px 3px 2px"
      //   : "rgb(63 63 68 / 5%) 0px 0px 0px 1px, rgb(34 33 81 / 15%) 0px 1px 3px 0px",
      transform: isDragging ? "scale(1.05)" : "scale(1)",
      ...style,
    };

    return (
      <tr
        className={predictionTableStyles.table_row}
        ref={ref}
        style={inlineStyles}
        {...props}>
        {/* {index !== null ? index + 1 : items.indexOf(id) + 1}-{" "}
        {competition === "eurovision" ? (
          <FlagCell country={entrant} />
        ) : (
          <td className={predictionTableStyles.flair_cell}>
            <span
              className={`${predictionTableStyles.flair}`}
              style={{ backgroundColor: entrant.color }}></span>
          </td>
        )}{" "}
        - {id} */}
        <td className={predictionTableStyles.drag_cell}>≡</td>
        <td className={predictionTableStyles.position_cell}>
          {index !== null ? index + 1 : "x"}
        </td>
        {competition === "eurovision" ? (
          <FlagCell country={entrant} />
        ) : (
          <td className={predictionTableStyles.flair_cell}>
            <span
              className={`${predictionTableStyles.flair}`}
              style={{ backgroundColor: entrant.color }}></span>
          </td>
        )}
        <td className={predictionTableStyles.name_cell}>
          <span className={predictionTableStyles.name}>{entrant.name}</span>
          <span className={predictionTableStyles.sName}>{entrant.sName}</span>
        </td>
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
