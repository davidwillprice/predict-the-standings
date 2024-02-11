"use client";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

import { Entrant } from "@custom-types/game-types";

import predictiontableStyles from "@styles/prediction-table.module.scss";
import styles from "@components/submit-predictions/editable-prediction-table.module.scss";

type Props = {
  entrantArr: Entrant[];
  handleEntrantState: (entrantArr: Entrant[]) => void;
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
    <div
      id="prediction-table"
      className={`${predictiontableStyles.prediction_table} ${styles.editable_prediction_table}`}>
      <table>
        <thead>
          <tr>
            <th colSpan={2}>Order</th>
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
                        className={predictiontableStyles.table_row}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}>
                        <td>≡</td>
                        <td>{entrantArr.indexOf(entrant) + 1}</td>
                        <td>
                          <span
                            className={`${predictiontableStyles.flair}`}
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
