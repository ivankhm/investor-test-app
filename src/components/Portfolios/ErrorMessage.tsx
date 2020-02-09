import * as React from 'react';
import { AlertTitle, Alert } from '@material-ui/lab'
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';


interface IErrorMessageProps {
    message: string,
    onClose?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const ErrorMessage: React.FC<IErrorMessageProps> = (props) => {
    return (
        <>
            <Alert
                severity="error"
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={props.onClose}
                    >
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                }
            >
                <AlertTitle>Произошла ошибка!</AlertTitle>
                <p>Что-то пошло не так при работе с API, подробности:</p>
                <p>
                    <strong>{props.message}</strong>
                </p>
            </Alert>

        </>
    );
};

export default ErrorMessage;
