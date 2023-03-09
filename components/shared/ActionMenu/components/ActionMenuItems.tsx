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
        ) : (
          <ActionMenuItem
            ref={(el) => refs(index, el)}
            key={item.title}
            onClick={item.onClick}
            command={item.command}
            icon={item.icon}
          >
            {item.title}
          </ActionMenuItem>
        )
      )}
    </>
  );
};
