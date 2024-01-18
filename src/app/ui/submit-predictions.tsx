import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

import { Entrant } from "@app/custom-types/entrants";

import styles from "@styles/prediction-table.module.scss";

type Props = {
  initialEntrants: Entrant[];
};

export default function SubmitPredictions({ initialEntrants }: Props) {
  const [items, updateInputField] = useState(initialEntrants);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!destination) return;
    const newItems = Array.from(items);
    const [reOrdered] = newItems.splice(source.index, 1);
    newItems.splice(destination.index, 0, reOrdered);
    updateInputField([...newItems]);
  };
  return (
    <div className={styles.prediction_table}>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Order</th>
            <th></th>
            <th>Entrant</th>
          </tr>
        </thead>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <tbody {...provided.droppableProps} ref={provided.innerRef}>
                {items.map((item, index) => (
                  <Draggable
                    key={item.id}
                    draggableId={`${item.id}`}
                    index={index}>
                    {(provided) => (
                      <tr
                        key={item.id}
                        className={styles.prediction_table_row}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}>
                        <td>≡</td>
                        <td>{items.indexOf(item) + 1}</td>
                        <td>
                          <span
                            className={`${styles.tab}`}
                            style={{ backgroundColor: item.color }}></span>
                        </td>
                        <td>{item.name}</td>
                      </tr>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </tbody>
            )}
          </Droppable>
        </DragDropContext>
      </table>
    </div>
  );
}
