import React, { FC } from 'react'
import { Grid, GridItem } from '@chakra-ui/react'
import { OriginTypes } from '../../../types'
import { ConnectItem } from './ConnectItem'

export type AppProps = {
    iconType: OriginTypes;
    name: string;
    description: string;
    isNew: boolean;
    isConnected?: boolean;
}

interface ConnectionAppsProps {
    apps: AppProps[];
    onConnect: (app: string) => () => void;
}

export const ConnectionApps: FC<ConnectionAppsProps> = ({ apps, onConnect }) => (
    <Grid templateColumns='repeat(3, 180px)' gap={10}>
        {apps.map((app) => (
            <GridItem key={app.name}>
                <ConnectItem {...app} onConnect={onConnect(app.name)} />
            </GridItem>
        ))}
    </Grid>
);
