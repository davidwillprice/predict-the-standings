"use client";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

import { F1DriverEntrant } from "@custom-types/entrants";

import styles from "@styles/prediction-table.module.scss";

type Props = {
  entrantArr: F1DriverEntrant[];
  handleEntrantState: (entrantArr: F1DriverEntrant[]) => void;
};

export function EditablePredictionTable({
  entrantArr,
  handleEntrantState,
}: Props) {
  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!destination) return;
    const newEntrantArr = Array.from(entrantArr);
    const [reOrdered] = newEntrantArr.splice(source.index, 1);
    newEntrantArr.splice(destination.index, 0, reOrdered);
    handleEntrantState([...newEntrantArr]);
  };

  return (
    <div id="prediction-table" className={styles.prediction_table}>
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
                {entrantArr.map((entrant, index) => (
                  <Draggable
                    key={entrant.id}
                    draggableId={`${entrant.id}`}
                    index={index}>
                    {(provided) => (
                      <tr
                        key={entrant.id}
                        className={styles.prediction_table_row}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}>
                        <td>≡</td>
                        <td>{entrantArr.indexOf(entrant) + 1}</td>
                        <td>
                          <span
                            className={`${styles.tab}`}
                            style={{ backgroundColor: entrant.color }}></span>
                        </td>
                        <td>{entrant.name}</td>
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
