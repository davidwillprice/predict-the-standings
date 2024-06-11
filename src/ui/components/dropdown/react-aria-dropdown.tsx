"use client";

import {
  Button,
  Key,
  Label,
  ListBox,
  Popover,
  Select,
  SelectValue,
} from "react-aria-components";

import dropDownStyles from "@components/dropdown/react-aria-dropdown.module.scss";
import Icon from "@ui/svgs/icons/sq-icon";
import { ReactNode, useEffect, useState } from "react";

type Props = {
  children: ReactNode;
  classNames?: string;
  defaultKey: string;
  items: Iterable<{}>;
  labelText: string;
  onSelectionChangeFn: Function;
  showLabelElement: boolean;
};

export const ReactAriaDropdown = ({
  children,
  classNames,
  items,
  labelText,
  onSelectionChangeFn,
  defaultKey,
  showLabelElement,
}: Props) => {
  let [selected, setSelected] = useState<string>(defaultKey);

  /**If the defaultKey prop changes, ensure that becomes the selected key */
  useEffect(() => {
    if (defaultKey !== selected) {
      setSelected(defaultKey);
    }
  }, [defaultKey]);

  const handleSelectionChange = (selected: Key) => {
    const selectedStr = selected.toLocaleString();
    setSelected(selectedStr);
    onSelectionChangeFn(selected);
  };
  return (
    <Select
      key={defaultKey}
      aria-label={labelText}
      onSelectionChange={(selected) => handleSelectionChange(selected)}
      className={`${dropDownStyles.select} ${classNames}`}
      selectedKey={selected}>
      {showLabelElement ? (
        <Label className={dropDownStyles.label}>{labelText}</Label>
      ) : (
        ""
      )}
      <Button>
        <SelectValue />
        <Icon strokeWidth={2} type={"chevronDown"} aria-hidden="true" />
      </Button>
      <Popover
        className={dropDownStyles.popover}
        offset={0}
        // Workaround for https://github.com/adobe/react-spectrum/issues/1513
        ref={(ref) =>
          ref?.addEventListener("touchend", (e) => e.preventDefault())
        }>
        <ListBox items={items} className={dropDownStyles.listBox}>
          {children}
        </ListBox>
      </Popover>
    </Select>
  );
};
