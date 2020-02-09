import * as React from 'react';
import { Typography } from '@material-ui/core'

interface IDataBlockProps {
    title: string,
    children: React.ReactNode,
    color?: 'initial' | 'inherit' | 'primary' | 'secondary' | 'textPrimary' | 'textSecondary' | 'error',
    className?: string,
    component?: any
}

const DataBlock: React.FunctionComponent<IDataBlockProps> = (props) => {
    

    return (
        <div className={props.className}>
            <Typography color={props.color} variant="overline" display="block" gutterBottom>
                {props.title}
            </Typography>
            <Typography variant='h5'> {props.children} </Typography>
        </div>
    );
};

export default DataBlock;
