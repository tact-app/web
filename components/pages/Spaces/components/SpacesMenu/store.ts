import { makeAutoObservable, runInAction } from 'mobx';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { OriginChildData, OriginData, SpaceData } from '../../types';
import { OriginCheckStatusTypes } from './types';
import { RootStore } from '../../../../../stores/RootStore';

export type SpacesMenuProps = {
  withCheckboxes?: boolean;
  isHotkeysEnabled?: boolean;
  selectedPath?: string[];
  selectedSpaceId?: string;
  callbacks: {
    onSpaceChange?: (space: SpaceData) => void;
    onSpaceCreationClick?: () => void;
    onSpaceOriginAddClick?: (space: SpaceData) => void;
    onSpaceSettingsClick?: (space: SpaceData) => void;
    onPathChange?: (path: string[]) => void;
    onFocus?: () => void;
    onFocusLeave?: (direction: 'left' | 'right') => void;
    onExpand?: () => void;
    onCollapse?: () => void;
  };
};

type OriginCheckStateTree = Record<string, OriginCheckState>;

type OriginCheckState = {
  status: OriginCheckStatusTypes;
  expanded: boolean;
  children: OriginCheckStateTree;
};

export class SpacesMenuStore {
  constructor(public root: RootStore) {
    makeAutoObservable(this);
  }

  callbacks: SpacesMenuProps['callbacks'] = {};

  withCheckboxes = false;
  currentSpaceIndex: number | null = null;
  isExpanded = true;
  focusedPath: string[] = [];
  selectedPath: string[] = [];
  checkState: OriginCheckStateTree = {};

  keyMap = {
    UP: ['j', 'up'],
    FORCE_UP: ['meta+j', 'meta+up'],
    DOWN: ['k', 'down'],
    FORCE_DOWN: ['meta+k', 'meta+down'],
    COLLAPSE: 'left',
    EXPAND: 'right',
    LEAVE: ['escape'],
    SELECT: ['space', 'enter'],
  };

  hotkeysHandlers = {
    UP: (e) => {
      e.preventDefault();
      this.moveFocus('up');
    },
    FORCE_UP: (e) => {
      e.preventDefault();
      this.selectNextSpace('up');
    },
    DOWN: (e) => {
      e.preventDefault();
      this.moveFocus('down');
    },
    FORCE_DOWN: (e) => {
      e.preventDefault();
      this.selectNextSpace('down');
    },
    LEAVE: () => {
      this.callbacks.onFocusLeave?.('right');
    },
    COLLAPSE: () => {
      if (this.focusedPath.length) {
        this.toggleFocusedOriginExpand(false);
      } else {
        this.toggleExpanded(false);
      }
    },
    CHECK: () => {
      if (this.withCheckboxes) {
        this.handleOriginCheck(this.currentSpaceId, this.focusedPath);
      }
    },
    EXPAND: () => {
      if (this.isExpanded) {
        this.toggleFocusedOriginExpand(true);
      } else {
        this.toggleExpanded(true);
      }
    },
    SELECT: () => {
      this.selectFocused();

      if (
        !this.focusedPath.length &&
        this.currentSpaceIndex !== null &&
        this.currentSpaceId !== 'all'
      ) {
        this.callbacks.onSpaceSettingsClick?.(this.currentSpace);
      }
    },
  };

  get currentSpace() {
    return this.root.resources.spaces.getById(this.currentSpaceId);
  }

  get currentSpaceId() {
    return this.currentSpaceIndex === null
      ? null
      : this.root.resources.spaces.getByIndex(this.currentSpaceIndex).id;
  }

  checkPathMatch = (spaceId: string, path: string[], checkPath: string[]) => {
    if (spaceId !== this.currentSpaceId) {
      return false;
    }

    if (checkPath.length && checkPath.length === path.length) {
      for (let focusedIndex in path) {
        if (checkPath[focusedIndex] !== path[focusedIndex]) {
          return false;
        }
      }
    } else {
      return false;
    }

    return true;
  };

  checkPathFocus = (spaceId: string, path: string[]) => {
    return this.checkPathMatch(spaceId, path, this.focusedPath);
  };

  checkPathSelect = (spaceId: string, path: string[]) => {
    return this.checkPathMatch(spaceId, path, this.selectedPath);
  };

  moveFocus = (direction: 'up' | 'down') => {
    if (this.isExpanded) {
      if (this.currentSpaceId === 'all' || this.currentSpaceIndex === null) {
        this.selectNextSpace(direction);
        return;
      }

      if (!this.focusedPath.length && direction === 'down') {
        if (this.currentSpace && this.currentSpace.children.length) {
          this.focus([this.currentSpace.children[0].id]);
        } else {
          this.focus([null]);
        }

        return;
      }

      if (this.focusedPath[0] === null) {
        if (direction === 'up') {
          if (this.currentSpace?.children.length) {
            const lastChild =
              this.currentSpace?.children[
              this.currentSpace.children.length - 1
              ];

            this.focus(
              this.getCornerChildPath({
                source: lastChild,
                state:
                  this.checkState[this.currentSpaceId].children[lastChild.id],
              })
            );
          } else {
            this.focus();
          }
        } else {
          this.selectNextSpace(direction);
        }
        return;
      }

      const newPath = this.findNeighbor(
        this.currentSpaceId,
        this.focusedPath,
        direction
      );

      if (!newPath.length) {
        if (direction === 'down') {
          this.focus([null]);
          return;
        } else {
          this.selectNextSpace(direction);
        }
      }

      if (
        this.currentSpaceIndex === this.root.resources.spaces.count - 1 &&
        !newPath.length &&
        direction === 'down'
      ) {
        return;
      }

      this.focus(newPath);
    } else {
      this.selectNextSpace(direction);
    }
  };

  findNeighbor = (
    spaceId: string,
    path: string[],
    direction: 'up' | 'down',
    ignoreExpanded = false
  ): string[] => {
    if (path.length) {
      const chain = this.getChainByPath(spaceId, path);

      const current = chain.pop();

      if (
        !ignoreExpanded &&
        direction === 'down' &&
        current.source.children?.length &&
        current.state.expanded
      ) {
        return [...path, current.source.children[0].id];
      } else {
        const parent = chain.pop() || {
          source: this.currentSpace,
          state: this.checkState[spaceId],
        };

        if (parent) {
          const currentIndex = parent.source.children.findIndex(
            ({ id }) => id === current.source.id
          );

          if (direction === 'up') {
            if (currentIndex > 0) {
              const upperChild = parent.source.children[currentIndex - 1];

              return [
                ...path.slice(0, -1),
                ...this.getCornerChildPath({
                  source: upperChild,
                  state: parent.state.children[upperChild.id],
                }),
              ];
            } else {
              return path.slice(0, -1);
            }
          } else if (direction === 'down') {
            if (currentIndex < parent.source.children.length - 1) {
              if (!ignoreExpanded && current.state.expanded) {
                return [...path, current.source.children[0].id];
              } else {
                return [
                  ...path.slice(0, -1),
                  parent.source.children[currentIndex + 1].id,
                ];
              }
            } else {
              return this.findNeighbor(
                spaceId,
                path.slice(0, -1),
                'down',
                true
              );
            }
          }
        }
      }
    }

    return [];
  };

  getCornerChildPath = (
    item: {
      source: OriginChildData | OriginData;
      state: OriginCheckState;
    },
    path: string[] = []
  ) => {
    const { state, source } = item;

    path.push(source.id);

    if (source.children && source.children.length > 0 && state.expanded) {
      const bottomChild = source.children[source.children.length - 1];

      return this.getCornerChildPath(
        {
          source: bottomChild,
          state: state.children[bottomChild.id],
        },
        path
      );
    } else {
      return path;
    }
  };

  focus = (data?: string[]) => {
    this.focusedPath = data ? data : [];
  };

  select(path?: string[]) {
    if ((!path || !path.length) && this.currentSpaceIndex === null) {
      this.callbacks.onSpaceCreationClick?.();
    }

    if (this.focusedPath[0] === null) {
      this.callbacks.onSpaceOriginAddClick?.(this.currentSpace);
    } else {
      this.selectedPath = path ? path : [];
    }

    this.callbacks.onPathChange?.(this.selectedPath);
  }

  selectFocused = () => {
    this.select(this.focusedPath);
  };

  handleOriginClick = (spaceId: string, path: string[]) => {
    if (this.currentSpaceId === spaceId) {
      this.focus(path);
      this.select(path);
    }
  };

  toggleFocusedOriginExpand = (expand?: boolean) => {
    if (!this.focusedPath) return;

    if (this.currentSpaceIndex !== null && this.focusedPath[0] !== null) {
      const state = this.focusedPath.reduce((prev, current) => {
        return prev.children[current];
      }, this.checkState[this.currentSpaceId]);

      if (state.expanded === false && expand === false) {
        this.focus(this.focusedPath.slice(0, -1));
      } else if (state.expanded === true && expand === true) {
        const source = this.getOrigin(this.currentSpaceId, this.focusedPath);

        if (source.children && source.children.length) {
          this.focus([...this.focusedPath, source.children[0].id]);
        }
      } else if (state.children && Object.keys(state.children).length) {
        state.expanded = expand === undefined ? !state.expanded : expand;
      } else {
        this.callbacks.onFocusLeave('right');
      }
    }
  };

  toggleExpanded = (state?: boolean) => {
    this.isExpanded = state === undefined ? !this.isExpanded : state;

    if (this.isExpanded) {
      this.callbacks.onExpand?.();
    } else {
      this.callbacks.onCollapse?.();
    }
  };

  handleExpanderClick = () => {
    this.toggleExpanded();
  };

  changeOriginCheckState = (state: OriginCheckState) => {
    switch (state.status) {
      case OriginCheckStatusTypes.CHECKED:
        state.status = OriginCheckStatusTypes.UNCHECKED;
        break;
      case OriginCheckStatusTypes.UNCHECKED:
        state.status = OriginCheckStatusTypes.CHECKED;
        break;
      case OriginCheckStatusTypes.INDETERMINATE:
        state.status = OriginCheckStatusTypes.CHECKED;
        break;
    }

    this.checkAllChildren(state.children, state.status);
  };

  checkAllChildren = (
    stateChildren: OriginCheckStateTree,
    status: OriginCheckStatusTypes
  ) => {
    Object.values(stateChildren).forEach((child) => {
      child.status = status;
      this.checkAllChildren(child.children, status);
    });
  };

  changeAllChildrenExpanded = (
    stateChildren: OriginCheckStateTree,
    isExpanded: boolean
  ) => {
    Object.values(stateChildren).forEach((child) => {
      child.expanded = isExpanded;
      this.changeAllChildrenExpanded(child.children, isExpanded);
    });
  };

  handleOriginExpand = (spaceId: string, path: string[]) => {
    const origin = this.getOriginState(spaceId, path);

    origin.expanded = !origin.expanded;

    if (!origin.expanded) {
      this.changeAllChildrenExpanded(origin.children, false);
    }
  };

  getOriginStatus = (spaceId: string, path: string[]) => {
    let pointer = this.checkState[spaceId];

    if (pointer) {
      for (let key of path) {
        if (!pointer.children || !pointer.children[key]) {
          break;
        } else if (pointer.status === OriginCheckStatusTypes.INDETERMINATE) {
          pointer = pointer.children[key];
        } else {
          break;
        }
      }

      return pointer.status;
    }

    return OriginCheckStatusTypes.UNCHECKED;
  };

  getOriginState = (spaceId: string, path: string[]) => {
    if (this.checkState[spaceId]) {
      return path.reduce(
        (acc, key) => acc.children[key],
        this.checkState[spaceId]
      );
    } else {
      return {
        status: OriginCheckStatusTypes.UNCHECKED,
        expanded: false,
        children: {},
      } as OriginCheckState;
    }
  };

  getOrigin = (
    spaceId: string,
    path: string[]
  ): OriginData | OriginChildData | null => {
    return path.reduce(
      (acc, key): OriginChildData | OriginData =>
        acc.children.find(({ id }) => id === key),
      this.root.resources.spaces.getById(spaceId)
    );
  };

  getChainByPath = (spaceId: string, path: string[]) => {
    const originId = path[0];

    if (originId && this.currentSpace) {
      const originCheck = this.checkState[spaceId].children[originId];
      const originSource = this.currentSpace.children.find(
        ({ id }) => id === originId
      );
      const items: { state: OriginCheckState; source: OriginChildData }[] = [
        { state: originCheck, source: originSource },
      ];

      path.slice(1).reduce(({ state, source }, key) => {
        const childState = state.children ? state.children[key] : null;
        const childSource = source.children.find(({ id }) => id === key);
        const childItem = {
          state: childState,
          source: childSource,
        };
        items.push(childItem);

        return childItem;
      }, items[0]);

      return items;
    } else {
      return [];
    }
  };

  handleOriginCheck = (spaceId: string, path: string[]) => {
    const items = this.getChainByPath(spaceId, path);
    const lastChild = items.pop();

    this.changeOriginCheckState(lastChild.state);

    items.reverse().forEach((parent) => {
      if (parent.source.children.length === 1) {
        parent.state.status =
          parent.state.children[parent.source.children[0].id].status;
      } else if (this.checkStateDifferences(parent.state)) {
        parent.state.status = OriginCheckStatusTypes.INDETERMINATE;
      } else {
        parent.state.status = Object.values(parent.state.children).every(
          ({ status }) => status === OriginCheckStatusTypes.CHECKED
        )
          ? OriginCheckStatusTypes.CHECKED
          : OriginCheckStatusTypes.UNCHECKED;
      }
    });
  };

  checkStateDifferences = (checkState: OriginCheckState) => {
    if (checkState.children) {
      let prevState = undefined;
      for (let childKey in checkState.children) {
        if (
          prevState !== undefined &&
          checkState.children[childKey].status !== prevState
        ) {
          return true;
        }

        prevState = checkState.children[childKey].status;
      }
    }

    return false;
  };

  createChildCheckState = (
    source: OriginData | OriginChildData | SpaceData
  ): OriginCheckState => {
    return {
      status: OriginCheckStatusTypes.CHECKED,
      expanded: false,
      children: source.children
        ? this.createChildrenState(source.children)
        : {},
    };
  };

  createChildrenState = (
    children: OriginChildData[] | SpaceData[] | OriginData[]
  ): OriginCheckStateTree => {
    const acc: OriginCheckStateTree = {};

    children.forEach((child) => {
      acc[child.id] = this.createChildCheckState(child);
    });

    return acc;
  };

  handleSpaceChange = (index: number, select: boolean = true) => {
    this.currentSpaceIndex = index;
    this.callbacks.onSpaceChange?.(this.currentSpace);
    this.focus();

    if (select) {
      this.select();
    }
  };

  handleSpaceClick = (index: number) => {
    if (index === this.currentSpaceIndex) {
      this.focus();
      this.select();
    }
  };

  selectNextSpace = (direction: 'up' | 'down') => {
    const spacesCount = this.root.resources.spaces.count;

    if (this.currentSpaceIndex === null) {
      if (spacesCount) {
        if (direction === 'up') {
          this.handleSpaceChange(spacesCount - 1);
        } else {
          this.handleSpaceChange(0);
        }
      }
    } else if (this.currentSpaceIndex > 0 && direction === 'up') {
      this.handleSpaceChange(this.currentSpaceIndex - 1);
    } else if (
      this.currentSpaceIndex < spacesCount - 1 &&
      direction === 'down'
    ) {
      this.handleSpaceChange(this.currentSpaceIndex + 1);
    } else {
      this.focus();
      this.currentSpaceIndex = null;
    }
  };

  handleSpaceUpdate = (space: SpaceData) => {
    this.checkState[space.id] = this.createChildCheckState(space);
  };

  handleSpaceDelete = (spaceId: string) => {
    delete this.checkState[spaceId];

    const newIndex = this.root.resources.spaces.count > 1 ? 0 : null;
    this.handleSpaceChange(newIndex, newIndex !== null);
  };

  loadSpaces = async () => {
    this.checkState = this.createChildrenState(this.root.resources.spaces.list);
  };

  update = (props: SpacesMenuProps) => {
    this.withCheckboxes = props.withCheckboxes;
    this.callbacks = props.callbacks || {};
    this.selectedPath = props.selectedPath;
    this.focusedPath = props.selectedPath;
  };

  init = async (props: SpacesMenuProps) => {
    await this.loadSpaces();

    if (!props.selectedSpaceId) {
      if (this.root.resources.spaces.count) {
        this.handleSpaceChange(0);
      }
    } else {
      runInAction(() => {
        props.selectedPath.slice(0, -1).reduce((acc, key) => {
          if (acc) {
            acc.children[key].expanded = true;
            return acc.children[key];
          }
        }, this.checkState[props.selectedSpaceId]);

        const spaceIndex = this.root.resources.spaces.getIndex(
          props.selectedSpaceId
        );

        if (spaceIndex > -1) {
          this.currentSpaceIndex = spaceIndex;
          this.callbacks.onSpaceChange?.(this.currentSpace);
        }
      });
    }
  };
}

export const {
  StoreProvider: SpacesMenuStoreProvider,
  useStore: useSpacesMenuStore,
} = getProvider(SpacesMenuStore);
