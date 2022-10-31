import { makeAutoObservable } from 'mobx';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { OriginChildData, OriginData, SpaceData } from '../../types';
import { OriginCheckStatusTypes } from './types';

export type SpacesMenuProps = {
  withCheckboxes?: boolean;
  hotkeysEnabled?: boolean;
  callbacks: {
    onSpaceChange?: (space: SpaceData) => void;
    onFocusChange?: (path: string[]) => void;
    onFocus?: () => void;
    onFocusLeave?: (direction: 'left' | 'right') => void;
  };
};

type OriginCheckStateTree = Record<string, OriginCheckState>;

type OriginCheckState = {
  status: OriginCheckStatusTypes;
  expanded: boolean;
  children: OriginCheckStateTree;
};

export class SpacesMenuStore {
  constructor() {
    makeAutoObservable(this);
  }

  callbacks: SpacesMenuProps['callbacks'] = {};

  withCheckboxes = false;
  currentSpaceIndex: number = 0;
  spaces: SpaceData[] = [];
  isExpanded = true;
  focusedPath: string[] = [];
  selectedPath: string[] = [];
  savedState: Record<string, OriginCheckStateTree> = {};
  checkState: OriginCheckStateTree = {};

  keyMap = {
    UP: ['j', 'up'],
    FORCE_UP: ['cmd+j', 'cmd+up'],
    DOWN: ['k', 'down'],
    FORCE_DOWN: ['cmd+k', 'cmd+down'],
    CHECK: 'space',
    COLLAPSE: 'left',
    EXPAND: 'right',
    LEAVE: 'esc',
    SELECT: 'enter',
  };

  hotkeysHandlers = {
    UP: () => {
      this.moveFocus('up');
    },
    FORCE_UP: () => {
      this.selectNextSpace('up');
    },
    DOWN: () => {
      this.moveFocus('down');
    },
    FORCE_DOWN: () => {
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
    },
  };

  get currentSpace() {
    return this.spaces.find(({ id }) => id === this.currentSpaceId);
  }

  get currentSpaceId() {
    return this.spaces[this.currentSpaceIndex].id;
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
      if (!this.focusedPath.length) {
        if (this.currentSpace.children.length && direction === 'down') {
          this.focus([this.currentSpace.children[0].id]);
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

      if (
        !newPath.length &&
        (direction === 'down' || !this.focusedPath.length)
      ) {
        this.selectNextSpace(direction);
      }

      if (
        this.currentSpaceIndex === this.spaces.length - 1 &&
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
    this.callbacks.onFocusChange?.(this.focusedPath);
  };

  select(path?: string[]) {
    this.selectedPath = path ? path : [];
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
    }
  };

  toggleExpanded = (state?: boolean) => {
    this.isExpanded = state === undefined ? !this.isExpanded : state;
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
  };

  getOriginState = (spaceId: string, path: string[]) => {
    return path.reduce(
      (acc, key) => acc.children[key],
      this.checkState[spaceId]
    );
  };

  getOrigin = (spaceId: string, path: string[]) => {
    return path.reduce(
      (acc, key) => acc.children.find(({ id }) => id === key),
      this.spaces.find(({ id }) => id === spaceId)
    );
  };

  getChainByPath = (spaceId: string, path: string[]) => {
    const originId = path[0];

    if (originId) {
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

  createOriginCheckState = (source: OriginData | OriginChildData) => {
    return {
      status: OriginCheckStatusTypes.CHECKED,
      expanded: false,
      children: source.children
        ? this.createChildrenState(source.children)
        : {},
    };
  };

  createChildrenState = (
    originChildren: OriginChildData[]
  ): OriginCheckStateTree => {
    return originChildren.reduce((acc, child) => {
      acc[child.id] = this.createOriginCheckState(child);
      return acc;
    }, {});
  };

  handleSpaceChange = (index: number) => {
    this.currentSpaceIndex = index;
    this.callbacks.onSpaceChange?.(this.currentSpace);
    this.focus();
    this.select();
  };

  handleSpaceClick = (index: number) => {
    if (index === this.currentSpaceIndex) {
      this.focus();
      this.select();
    }
  };

  selectNextSpace = (direction: 'up' | 'down') => {
    if (this.currentSpaceIndex > 0 && direction === 'up') {
      this.handleSpaceChange(this.currentSpaceIndex - 1);
      return true;
    }

    if (
      this.currentSpaceIndex < this.spaces.length - 1 &&
      direction === 'down'
    ) {
      this.handleSpaceChange(this.currentSpaceIndex + 1);
      return true;
    }

    return false;
  };

  loadSpaces = async () => {
    this.spaces = [
      {
        id: 'all',
        color: 'gray.500',
        name: 'All spaces',
        shortName: 'A',
        children: [],
      },
      {
        id: '123123',
        color: 'orange.200',
        name: 'Work',
        shortName: 'W',
        children: [
          {
            id: 'github',
            name: 'Github',
            children: [
              {
                name: 'main project',
                id: 'github/main-project',
                children: [
                  {
                    id: 'github/main-project/repository-1',
                    name: 'repository 1',
                  },
                  {
                    id: 'github/main-project/repository-2',
                    name: 'repository 2',
                  },
                ],
              },
              {
                name: 'second project',
                id: 'github/second-project',
                children: [
                  {
                    id: 'github/second-project/repository-1',
                    name: 'repository 1',
                  },
                ],
              },
              {
                name: 'main project 1',
                id: 'github/main-project-1',
                children: [
                  {
                    id: 'github/main-project-1/repository-1',
                    name: 'repository 1',
                  },
                  {
                    id: 'github/main-project-1/repository-2',
                    name: 'repository 2',
                  },
                ],
              },
            ],
          },
          {
            id: 'jira',
            name: 'Jira',
            children: [
              {
                id: 'jira/project-1',
                name: 'main project',
              },
              {
                id: 'jira/project-2',
                name: 'other project',
              },
              {
                id: 'jira/project-3',
                name: 'main project 1',
              },
              {
                id: 'jira/project-4',
                name: 'other project 2',
              },
              {
                id: 'jira/project-5',
                name: 'main project 3',
              },
              {
                id: 'jira/project-6',
                name: 'other project 4',
              },
            ],
          },
        ],
      },
      {
        id: '4444',
        color: 'purple.200',
        name: 'Meetings',
        shortName: 'M',
        children: [],
      },
      {
        id: '222',
        color: 'blue.200',
        name: 'Life',
        shortName: 'L',
        children: [
          {
            id: 'github',
            name: 'Github',
            children: [
              {
                name: 'main project',
                id: 'github/main-project',
                children: [
                  {
                    id: 'github/main-project/repository-1',
                    name: 'repository 1',
                  },
                  {
                    id: 'github/main-project/repository-2',
                    name: 'repository 2',
                  },
                ],
              },
              {
                name: 'second project',
                id: 'github/second-project',
                children: [
                  {
                    id: 'github/second-project/repository-1',
                    name: 'repository 1',
                  },
                ],
              },
              {
                name: 'main project 1',
                id: 'github/main-project-1',
                children: [
                  {
                    id: 'github/main-project-1/repository-1',
                    name: 'repository 1',
                  },
                  {
                    id: 'github/main-project-1/repository-2',
                    name: 'repository 2',
                  },
                ],
              },
            ],
          },
          {
            id: 'jira',
            name: 'Jira',
            children: [
              {
                id: 'jira/project-1',
                name: 'main project',
              },
              {
                id: 'jira/project-2',
                name: 'other project',
              },
              {
                id: 'jira/project-3',
                name: 'main project 1',
              },
              {
                id: 'jira/project-4',
                name: 'other project 2',
              },
              {
                id: 'jira/project-5',
                name: 'main project 3',
              },
              {
                id: 'jira/project-6',
                name: 'other project 4',
              },
            ],
          },
        ],
      },
    ];

    this.checkState = this.createChildrenState(this.spaces);

    this.handleSpaceChange(0);
  };

  update = (props: SpacesMenuProps) => {
    this.withCheckboxes = props.withCheckboxes;
    this.callbacks = props.callbacks || {};
  };

  init = (props: SpacesMenuProps) => {
    this.loadSpaces();
  };
}

export const {
  StoreProvider: SpacesMenuStoreProvider,
  useStore: useSpacesMenuStore,
} = getProvider(SpacesMenuStore);
