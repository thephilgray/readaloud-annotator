import React, { useState, useRef } from 'react';

import { withFirebase } from './components/Firebase';
import { withStyles } from '@material-ui/core/styles';
import withRoot from './withRoot';
import AppStepper from './components/AppStepper';
import { createTextMap, roundHalf, toHtml } from './lib';
import logo from './logo.svg';
import './App.css';
import { Typography } from '@material-ui/core';
const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 20
  }
});

function App({ firebase, classes }) {
  const textareaInput = useRef(null);
  const audioEl = useRef(null);
  const preview = useRef(null);
  const audioFilePicker = useRef(null);
  const [audioFile, setAudioFile] = useState(null);
  const [fileId, setFileId] = useState(null);
  const [textMap, setTextmap] = useState(createTextMap(''));
  const [readaloudText, setReadaloudText] = useState('');

  // const readAloudTextChangeHandler = e => setText(e.target.value);
  const setPlayhead = i => () => {
    const newTime = roundHalf(audioEl.current.currentTime);
    const newTextMap = [...textMap].map((obj, i) => {
      if (obj.playhead === newTime) {
        return { val: obj.val };
      }
      return obj;
    });
    newTextMap[i].playhead = newTime;

    setTextmap(newTextMap);
  };

  const clearPlayhead = i => () => {
    if (i === 0) return;
    const newTextMap = [...textMap];
    newTextMap[i] = { val: newTextMap[i].val };
    setTextmap(newTextMap);
  };

  /* for material-ui-dropzone */

  const chooseFile = files => {
    if (files.length > 0) {
      const file = files[0];
      file.name && setFileId(file.name);
      if (!file) return;
      setAudioFile(URL.createObjectURL(file));
    }
  };

  const resetFile = file => {
    setFileId(null);
    setAudioFile(null);
  };

  const inputText = e => {
    const text = e.target.value;
    setReadaloudText(text);
    setTextmap(createTextMap(text));
  };

  const submitHandler = () => {
    firebase
      .file(fileId.split('.')[0])
      .set({
        ...textMap
      })
      .then(() => {
        console.log('done');
      })
      .catch(error => console.log(error));
  };

  const resetHandler = () => {
    resetFile();
    setReadaloudText('');
    setFileId(null);
    setTextmap(createTextMap(''));
  };

  return (
    <div
      className={classes.root}
      style={{ padding: '1em', maxWidth: '70em', margin: '0 auto' }}
    >
      <div
        style={{
          padding: '1em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}
      >
        <img src={logo} alt="logo" className="App-logo" />
        <Typography variant="h4" component="h1">
          Custom Readaloud Annotator
        </Typography>
      </div>
      <AppStepper
        fileId={fileId}
        audioFilePicker={audioFilePicker}
        chooseFile={chooseFile}
        resetFile={resetFile}
        inputText={inputText}
        textareaInput={textareaInput}
        audioEl={audioEl}
        audioFile={audioFile}
        setPlayhead={setPlayhead}
        clearPlayhead={clearPlayhead}
        textMap={textMap}
        preview={preview}
        toHtml={toHtml}
        submitHandler={submitHandler}
        resetHandler={resetHandler}
        readaloudText={readaloudText}
      />
    </div>
  );
}
export default withRoot(withStyles(styles)(withFirebase(App)));
