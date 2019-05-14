import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import CustomReadAloud from 'custom-readaloud-plugin/dist/custom-read-aloud-0.1.5';
import { withFirebase } from './components/Firebase';
import './App.css';

function Chunk({ chunk, playhead, setPlayhead, clearPlayhead, first, last }) {
  return (
    <span
      style={{
        position: 'relative',
        paddingTop: '1em',
        lineHeight: 2
      }}
    >
      <span style={{ fontSize: '.25em', top: '0', position: 'absolute' }}>
        {playhead}
      </span>
      <span
        style={{
          userSelect: 'none',
          cursor: 'pointer'
        }}
        onClick={setPlayhead}
        onDoubleClick={clearPlayhead}
      >
        {chunk.val === '\n' ? <br /> : chunk.val + ' '}
      </span>
    </span>
  );
}

function App(props) {
  const textareaInput = useRef(null);
  const audioEl = useRef(null);
  const preview = useRef(null);
  const audioFilePicker = useRef(null);

  const [audioFile, setAudioFile] = useState(null);
  const [fileId, setFileId] = useState(null);

  const createTextMap = text =>
    text
      .split('\n')
      .map(line => line.split(' '))
      .reduce((acc, curr) => {
        if (typeof curr === 'object') {
          return [...acc, ...curr, '\n'];
        }
        return [...acc, curr];
      }, [])
      .map(val => ({ val }));

  const [textMap, setTextmap] = useState(createTextMap(''));

  useEffect(() => {
    if (audioFile && preview) {
      var customReader = new CustomReadAloud('.readAloud', '#audioPlayer');
      var audioSpeed = document.querySelector('#audioSpeed');
      audioSpeed.addEventListener('change', function(e) {
        customReader.changePlaybackRate(e.target.value);
      });
    }
  }, [audioFile, textMap]);

  const roundHalf = n => Number((Math.round(Number(n) * 2) / 2).toFixed(1));

  const toHtml = data => {
    let firstPlayhead = true;
    return data.reduce((acc, curr, i) => {
      /* if the first item doesn't have a data-playhead, set it to 0 */
      if (i === 0 && curr.playhead === undefined) {
        return `<span data-playhead="0">${acc}${curr.val} `;
      } else if (curr.playhead !== undefined && firstPlayhead) {
        firstPlayhead = false;
        return `${acc}<span data-playhead="${curr.playhead}">${curr.val} `;
      } else if (curr.playhead !== undefined) {
        return `${acc}</span><span data-playhead="${curr.playhead}">${
          curr.val
        } `;
      }
      // if last item give it a wrapping span tag
      else if (data.length - 1 === i) {
        return `${acc}${curr.val}</span>`;
      } else if (curr.val === '\n') {
        return `${acc}<br/>`;
      }
      return `${acc}${curr.val} `;
    }, '');
  };

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
    // //reset duplicates
    // const playHeads = uniqBy(newTextMap, 'playhead');

    setTextmap(newTextMap);
  };

  const clearPlayhead = i => () => {
    if (i === 0) return;
    const newTextMap = [...textMap];
    newTextMap[i] = { val: newTextMap[i].val };
    setTextmap(newTextMap);
  };

  const chooseFile = e => {
    const file = e.target.files[0];
    setFileId(file.name);
    if (!file) return;
    setAudioFile(URL.createObjectURL(file));
  };

  const inputText = e => {
    const text = e.target.value;
    setTextmap(createTextMap(text));
  };
  const submitHandler = () => {
    const data = {
      textMap,
      fileId
    };
    axios
      .post(
        'https://custom-readaloud-annotator.firebaseio.com/files.json',
        JSON.stringify(data)
      )
      .then(() => {
        console.log('done');
        resetHandler();
      })
      .catch(error => console.log(error));
  };

  const resetHandler = () => {
    audioFilePicker.current.value = '';
    textareaInput.current.value = '';
    setFileId(null);
    setTextmap(createTextMap(''));
    setAudioFile(null);
  };

  return (
    <div style={{ padding: '1em', maxWidth: '50%', margin: '0 auto' }}>
      <h1>Readaloud Annotator Demo</h1>
      <div>
        <h2>Input</h2>
        <label htmlFor="audioFilePicker">
          Select an audio file
          <input
            id="audioFilePicker"
            type="file"
            accept="audio/*"
            ref={audioFilePicker}
            onChange={chooseFile}
          />
        </label>
        <textarea
          rows="10"
          style={{ width: '100%' }}
          onChange={inputText}
          ref={textareaInput}
          placeholder="Enter readaloud text"
        />
      </div>
      {audioFile && textMap && (
        <>
          <div>
            <h2>Audio</h2>
            <div
              style={{
                display: 'flex',
                maxWidth: '30em',
                alignItems: 'center'
              }}
            >
              <audio id="audioPlayer" controls ref={audioEl} src={audioFile} />
              <label htmlFor="audioSpeed">Speed</label>
              <input
                id="audioSpeed"
                type="range"
                step=".25"
                max="2"
                // value={speed}
                // onChange={audioSpeedChangeHandler}
              />
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            <div>
              <h2>Annotator</h2>
              <div
                className="annotator"
                style={{
                  position: 'relative',
                  padding: '1em',
                  lineHeight: 2,
                  maxWidth: '30em'
                }}
              >
                {textMap.map((chunk, i) => (
                  <Chunk
                    key={i}
                    setPlayhead={setPlayhead(i)}
                    clearPlayhead={clearPlayhead(i)}
                    chunk={chunk}
                    first={i === 0}
                    last={i === textMap.length - 1}
                    playhead={chunk.playhead}
                  />
                ))}
              </div>
            </div>
            <div>
              <h2>Readaloud Preview</h2>
              <div
                className="readAloud"
                ref={preview}
                dangerouslySetInnerHTML={{ __html: toHtml(textMap) }}
                style={{
                  position: 'relative',
                  padding: '1em',
                  lineHeight: 2,
                  maxWidth: '30em',
                  cursor: 'pointer'
                }}
              />
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '100%' }}>
              <h2>Data</h2>
              <textarea
                className="result"
                rows="20"
                value={JSON.stringify(textMap)}
                onChange={() => {}}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ width: '100%' }}>
              <h2>HTML</h2>
              <textarea
                className="result"
                rows="20"
                value={toHtml(textMap)}
                onChange={() => {}}
                style={{ width: '100%' }}
              />
            </div>
          </div>
          <div />
          <div style={{ width: '100%' }}>
            <button onClick={submitHandler}>Submit to Server</button>
            <button onClick={resetHandler}>Reset</button>
          </div>
        </>
      )}
    </div>
  );
}

export default withFirebase(App);
