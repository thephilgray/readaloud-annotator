import React, { useEffect } from 'react';
import CustomReadAloud from 'custom-readaloud-plugin/dist/custom-read-aloud-0.1.5';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: '1em',
    marginBottom: '1em'
  },
  title: {
    fontSize: 14
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary
  }
});

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

const Annotator = props => {
  const { classes } = props;
  useEffect(() => {
    if (props.audioFile && props.preview) {
      var customReader = new CustomReadAloud('.readAloud', '#audioPlayer');
      var audioSpeed = document.querySelector('#audioSpeed');
      audioSpeed.addEventListener('change', function(e) {
        customReader.changePlaybackRate(e.target.value);
      });
    }
  }, [props.audioFile, props.preview, props.textMap]);
  return (
    <div className={classes.root}>
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%'
            }}
          >
            <label htmlFor="audioSpeed">Speed</label>
            <input id="audioSpeed" type="range" step=".25" max="2" />
          </div>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <Typography gutterBottom variant="h5" component="h2">
              Annotator
            </Typography>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
            >
              Click the text below as the audio is playing.
            </Typography>
            <div
              className="annotator"
              style={{
                position: 'relative',
                padding: '1em',
                lineHeight: 2,
                maxWidth: '30em'
              }}
            >
              {props.textMap.map((chunk, i) => (
                <Chunk
                  key={i}
                  setPlayhead={props.setPlayhead(i)}
                  clearPlayhead={props.clearPlayhead(i)}
                  chunk={chunk}
                  first={i === 0}
                  last={i === props.textMap.length - 1}
                  playhead={chunk.playhead}
                />
              ))}
            </div>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <Typography gutterBottom variant="h5" component="h2">
              Readaloud Preview
            </Typography>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
            >
              Click the text below to preview readaloud.
            </Typography>
            <div
              className="readAloud"
              ref={props.preview}
              dangerouslySetInnerHTML={{
                __html: props.toHtml(props.textMap)
              }}
              style={{
                position: 'relative',
                padding: '1em',
                lineHeight: 2,
                maxWidth: '30em',
                cursor: 'pointer'
              }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <div>
            <audio
              id="audioPlayer"
              controls
              ref={props.audioEl}
              src={props.audioFile}
            />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default withStyles(styles)(Annotator);
