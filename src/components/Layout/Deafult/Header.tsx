import * as React from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';

export interface IHeaderProps {
  title: String
}

export default function Header (props: IHeaderProps) {
  return (
    <React.Fragment>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" >
            {props.title}
          </Typography>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}
