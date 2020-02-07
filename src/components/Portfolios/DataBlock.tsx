import * as React from 'react';
import { Typography } from '@material-ui/core'

interface IDataBlockProps {
    color?: 'initial' | 'inherit' | 'primary' | 'secondary' | 'textPrimary' | 'textSecondary' | 'error',
    title: string,
    children: React.ReactNode
}

const DataBlock: React.FunctionComponent<IDataBlockProps> = (props) => {
    return (<>
        <Typography color={props.color} variant="overline" display="block" gutterBottom>
            {props.title}
        </Typography>
        <Typography variant='h5'> {props.children} </Typography>
    </>);
};

export default DataBlock;
