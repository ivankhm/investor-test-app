import * as React from 'react';
import { Typography, Link, Container } from '@material-ui/core';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary">
      {'Copyright © '}
      <Link color="inherit" href="https://github.com/ivankhm">
        ivankhm
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export interface IFooterProps {
  classes: string
}

export default function Footer(props: IFooterProps) {
  
  return (
    <footer className={props.classes}>
      <Container maxWidth="md">
        <Typography variant="body1">Это Ванька сделал</Typography>
        <Copyright />
      </Container>
    </footer>
  );
}
