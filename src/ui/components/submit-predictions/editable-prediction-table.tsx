"use client";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

import { FlagCell } from "@components/prediction-table/eurovision-flag-cell";

import { Competition, Entrant } from "@custom-types/game-types";

import predictionTableStyles from "@components/prediction-table/prediction-table.module.scss";
import styles from "@components/submit-predictions/editable-prediction-table.module.scss";

type Props = {
  competition: Competition;
  entrantArr: Entrant[];
  entrantType: string;
  handleEntrantState: (entrantArr: Entrant[]) => void;
};

export function EditablePredictionTable({
  competition,
  entrantArr,
  entrantType,
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

  /**@todo Fix wierd glitching when entrants are put into place */
  return (
    <div
      id="prediction-table"
      className={`${predictionTableStyles.prediction_table} ${styles.editable_prediction_table}`}>
      <table>
        <thead>
          <tr>
            <th colSpan={2}>
              <span>Order</span>
            </th>
            <th></th>
            <th>{entrantType}</th>
          </tr>
        </thead>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <tbody {...provided.droppableProps} ref={provided.innerRef}>
                {entrantArr.map((entrant, index) => (
                  <Draggable
                    key={entrant.sName}
                    draggableId={`${entrant.sName}`}
                    index={index}>
                    {(provided) => (
                      <tr
                        key={entrant.sName}
                        className={predictionTableStyles.table_row}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}>
                        <td className={predictionTableStyles.drag_cell}>≡</td>
                        <td className={predictionTableStyles.position_cell}>
                          {entrantArr.indexOf(entrant) + 1}
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
                          <span className={predictionTableStyles.name}>
                            {entrant.name}
                          </span>
                          <span className={predictionTableStyles.sName}>
                            {entrant.sName}
                          </span>
                        </td>
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
