import React from 'react';
import { DropzoneArea } from 'material-ui-dropzone';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({});

const FileAndTextInput = ({
  audioFilePicker,
  chooseFile,
  resetFile,
  fileId,
  classes
}) => {
  return (
    <div>
      <DropzoneArea
        dropzoneText={
          fileId ? fileId : `Drag and drop an audio file here or click.`
        }
        acceptedFiles={['audio/*']}
        id="audioFilePicker"
        type="file"
        accept="audio/*"
        ref={audioFilePicker}
        onChange={chooseFile}
        onDelete={resetFile}
        filesLimit={1}
      />
    </div>
  );
};

export default withStyles(styles)(FileAndTextInput);
