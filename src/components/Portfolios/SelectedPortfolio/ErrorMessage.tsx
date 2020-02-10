import { AlertTitle, Alert } from '@material-ui/lab'
import { IconButton, Collapse } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React, { useEffect, useState } from 'react';

interface IErrorMessageProps {
    errorMessage: string | false,
    className?: string
}

const ErrorMessage: React.FC<IErrorMessageProps> = (props) => {

    const [openError, setOpenError] = useState(false);

    useEffect(() => {
        console.log('apiError: ', props.errorMessage);

        if (props.errorMessage === false) {
            setOpenError(false);
        } else {
            setOpenError(true);
        }
    }, [props.errorMessage])

    return (
        <Collapse collapsedHeight={0} in={openError}>

            <Alert
                className={props.className}
                severity="error"
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => setOpenError(false)}
                    >
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                }
            >
                <AlertTitle>Произошла ошибка!</AlertTitle>
                <p>Что-то пошло не так при работе с API, подробности:</p>
                <p>
                    <strong>{props.errorMessage as string}</strong>
                </p>
            </Alert>
        </Collapse>
    );
};

export default ErrorMessage;
