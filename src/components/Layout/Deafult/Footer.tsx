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

const createLink = (title: string, link: string) => {
  return {
    title,
    link
  }
}

export default function Footer(props: IFooterProps) {

  const links = [
    createLink('react', 'github.com/facebook/react'),
    createLink('redux', 'github.com/reduxjs/redux'),
    createLink('react-redux', 'github.com/reduxjs/react-redux'),
    createLink('redux-persist', 'github.com/rt2zz/redux-persist'),
    createLink('redux-thunk', 'github.com/reduxjs/redux-thunk'),
    createLink('material-ui', 'github.com/mui-org/material-ui'),
  ];

  return (
    <footer className={props.classes}>
      <Container maxWidth="md">
        <Typography variant="body1">
          Это сделал Иван Хмелевский с помощью:
            {
            links.map(
              (l, i: number) => {
                return (<React.Fragment key={i}>
                  <a href={l.link}>{l.title}</a>
                  {(i !== links.length - 1) ? (', ') : (' ')}
                </React.Fragment>)
              }
            )
          }
          и других dependencies.
          </Typography>
        <Copyright />
      </Container>
    </footer>
  );
}
