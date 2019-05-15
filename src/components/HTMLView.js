import React from 'react';
import TextField from '@material-ui/core/TextField';
const HTMLView = ({ toHtml, textMap, textRef }) => {
  return (
    <>
      <TextField
        label="HTML"
        className="result"
        rows="20"
        value={toHtml(textMap)}
        onChange={() => {}}
        fullWidth
        variant="outlined"
        multiline
        inputRef={textRef}
      />
    </>
  );
};

export default HTMLView;
