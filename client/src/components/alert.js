import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
      padding: "100px",
    },
  },
}));

export default function SimpleAlerts(props) {
  const classes = useStyles();  
  console.log(props);
  return (
    <div >

      {props.status ? <Alert severity={props.status}>{props.msg}</Alert> : ''}

    </div>
  );
}
