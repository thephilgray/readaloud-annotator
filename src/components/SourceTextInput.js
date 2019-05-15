import React from 'react';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  dense: {
    marginTop: 16
  },
  menu: {
    width: 200
  }
});

const SourceTextInput = ({
  inputText,
  textareaInput,
  classes,
  readaloudText
}) => {
  return (
    <div>
      <TextField
        label="Readaloud Text"
        rows="10"
        style={{ width: '100%' }}
        onChange={inputText}
        value={readaloudText}
        ref={textareaInput}
        placeholder="Enter readaloud text"
        fullWidth
        variant="outlined"
        multiline
        InputLabelProps={{
          shrink: true
        }}
      />
    </div>
  );
};

export default withStyles(styles)(SourceTextInput);
