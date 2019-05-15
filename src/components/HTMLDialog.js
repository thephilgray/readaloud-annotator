import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/styles';
import HTMLView from './HTMLView';

const useStyles = makeStyles(theme => ({
  button: {
    marginTop: '1em'
  }
}));

function SimpleDialog(props) {
  const [copySuccess, setCopySuccess] = useState('');
  const textAreaRef = useRef(null);

  function copyToClipboard(e) {
    textAreaRef.current.select();
    document.execCommand('copy');
    // This is just personal preference.
    // I prefer to not show the the whole text area selected.
    e.target.focus();
    setCopySuccess('Copied!');
  }

  const { onClose, toHtml, textMap, ...other } = props;

  function handleClose() {
    onClose();
  }

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="show-html"
      {...other}
      fullWidth
    >
      <DialogTitle id="show-html">Result</DialogTitle>
      <DialogContent style={{ paddingTop: '.25em' }}>
        <HTMLView toHtml={toHtml} textMap={textMap} textRef={textAreaRef} />
      </DialogContent>
      <DialogActions>
        <Button onClick={copyToClipboard} color="secondary" variant="contained">
          {copySuccess ? 'Copied' : 'Copy'}
        </Button>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func,
  selectedValue: PropTypes.string
};

function HTMLDialog(props) {
  const [open, setOpen] = React.useState(false);

  function handleClickOpen() {
    setOpen(true);
  }

  const handleClose = value => {
    setOpen(false);
  };
  const classes = useStyles();

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleClickOpen}
        className={classes.button}
      >
        Show HTML
      </Button>
      <SimpleDialog {...props} open={open} onClose={handleClose} />
    </>
  );
}

export default HTMLDialog;
