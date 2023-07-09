import { makeAutoObservable } from 'mobx';
import { RootStore } from '../../../../../stores/RootStore';
import { getProvider } from '../../../../../helpers/StoreProvider';
import { SpaceData } from '../../types';

export type SpaceConnectAppsModalProps = {
    callbacks: {
        onClose?: () => void;
        onConnect?: (app: string) => void;
    };
    space?: SpaceData;
};

export class SpaceConnectAppsModalStore {
    constructor(public root: RootStore) {
        makeAutoObservable(this);
    }

    callbacks: SpaceConnectAppsModalProps['callbacks'] = {};

    isOpen: boolean = true;

    existedSpace: SpaceData | null = null;

    handleClose = () => {
        this.isOpen = false;
    };

    handleCloseComplete = () => {
        this.callbacks.onClose?.();
    };

    handleConnect = (app: string) => () => {
        this.callbacks.onConnect(app);
    };

    update = async (props: SpaceConnectAppsModalProps) => {
        this.callbacks = props.callbacks;
        this.existedSpace = props.space;
    };
}

export const {
    StoreProvider: SpaceConnectAppsModalStoreProvider,
    useStore: useSpaceConnectAppsModalStore,
} = getProvider(SpaceConnectAppsModalStore);
