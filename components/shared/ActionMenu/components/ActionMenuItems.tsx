import { Divider } from "@chakra-ui/react";
import React from "react";
import { ActionMenuItem as ActionMenuItemType } from "../types";
import { ActionMenuItem } from "./ActionMenuItem";

type Props = {
  items: ActionMenuItemType[];
  refs(index: number, el: HTMLButtonElement): void,
};

export function ActionMenuItems({ items, refs }: Props) {
  return (
    <>
      {items.map((item, index) =>
        item === null ? (
          <Divider key={index} />
        ) : !item.hidden && (
          <ActionMenuItem
            ref={(el) => refs(index, el)}
            key={item.key || (typeof item.title === 'string' ? item.title : index)}
            onClick={item.onClick}
            command={item.command}
            icon={item.icon}
            iconColor={item.iconColor}
          >
            {item.title}
          </ActionMenuItem>
        )
      )}
    </>
  );
};
