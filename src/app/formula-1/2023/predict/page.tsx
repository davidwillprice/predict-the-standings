"use client";

import React, { useState } from "react";
import { useListData } from "react-stately";
import {
  Cell,
  Column,
  Row,
  Table,
  TableBody,
  TableHeader,
  useDragAndDrop,
  Button,
} from "react-aria-components";

import { entrants } from "@data/formula-1/2023";
import { sortF1DriverEntrantsAlphabetically } from "@lib/misc";

import styles from "@styles/prediction-table.module.scss";
import teamStyles from "@styles/formula-1/2023.module.scss";

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
  const entrants = [
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
  ];

  let list = useListData({
    initialItems: sortF1DriverEntrantsAlphabetically(entrants),
  });

  let { dragAndDropHooks } = useDragAndDrop({
    getItems: (keys) =>
      [...keys].map((key) => ({
        "text/plain": list.getItem(key).name,
      })),
    onReorder(e) {
      if (e.target.dropPosition === "before") {
        list.moveBefore(e.target.key, e.keys);
      } else if (e.target.dropPosition === "after") {
        list.moveAfter(e.target.key, e.keys);
      }
      setKey(key + 1);
    },
    renderDragPreview(items) {
      return (
        <div className={styles.drag_preview}>{items[0]["text/plain"]}</div>
      );
    },
  });

  //Forces rerender of all rows when the entrant order is changed to ensure the new ranking order shows
  const [key, setKey] = useState(0);

  return (
    <div className={styles.prediction_table}>
      <Table
        aria-label="Files"
        selectionMode="multiple"
        dragAndDropHooks={dragAndDropHooks}>
        <TableHeader>
          <Column></Column>
          <Column isRowHeader>Order</Column>
          <Column></Column>
          <Column isRowHeader>Entrant</Column>
        </TableHeader>
        <TableBody items={list.items} key={key}>
          {(item) => {
            return (
              <Row key={item.id} className={styles.prediction_table_row}>
                <Cell>
                  <Button slot="drag">≡</Button>
                </Cell>
                <Cell>{list.items.indexOf(item) + 1}</Cell>
                <Cell>
                  <span
                    className={`${styles.tab} ${teamStyles[item.team]}`}></span>
                </Cell>
                <Cell>{item.name}</Cell>
              </Row>
            );
          }}
        </TableBody>
      </Table>
    </div>
  );
}
