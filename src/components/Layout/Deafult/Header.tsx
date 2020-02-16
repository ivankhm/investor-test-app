import * as React from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';

export interface IHeaderProps {
  title: string
}

export default function Header (props: IHeaderProps) {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography data-testid="header-title" variant="h6" >
            {props.title}
          </Typography>
        </Toolbar>
      </AppBar>
    </>
  );
}
