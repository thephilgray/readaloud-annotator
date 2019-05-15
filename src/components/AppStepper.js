import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AudioFilePicker from './AudioFilePicker';
import SourceTextInput from './SourceTextInput';
import Annotator from './Annotator';
import HTMLDialog from './HTMLDialog';

const useStyles = makeStyles(theme => ({
  root: {},

  instructions: {
    marginTop: '1em',
    marginBottom: '1em'
  },
  button: {
    marginTop: '1em'
  }
}));

function getSteps() {
  return ['Select audio file', 'Enter readaloud text', 'Annotate'];
}

function getStepContent(step, props) {
  switch (step) {
    case 0:
      return (
        <AudioFilePicker
          fileId={props.fileId}
          audioFilePicker={props.audioFilePicker}
          chooseFile={props.chooseFile}
          resetFile={props.resetFile}
        />
      );
    case 1:
      return (
        <SourceTextInput
          inputText={props.inputText}
          textareaInput={props.textareaInput}
          readaloudText={props.readaloudText}
        />
      );
    case 2:
      return props.audioFile && props.textMap ? (
        <Annotator
          audioEl={props.audioEl}
          audioFile={props.audioFile}
          setPlayhead={props.setPlayhead}
          clearPlayhead={props.clearPlayhead}
          textMap={props.textMap}
          preview={props.preview}
          toHtml={props.toHtml}
          submitHandler={props.submitHandler}
          resetHandler={props.resetHandler}
        />
      ) : (
        <Typography variant="body2">
          You must first choose an audio file.
        </Typography>
      );
    default:
      return 'Unknown step';
  }
}

function HorizontalLinearStepper(props) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const steps = getSteps();

  function isStepOptional(step) {
    // return step === 1;
    return false; // no optional steps for now
  }

  function isStepSkipped(step) {
    return skipped.has(step);
  }

  function isLastStep() {
    return activeStep === steps.length - 1;
  }

  function handleNext() {
    if (activeStep === 0 && !props.audioFile) return;
    if (isLastStep()) {
      props.submitHandler();
    }
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1);
    setSkipped(newSkipped);
  }

  function handleBack() {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  }

  function handleSkip() {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1);
    setSkipped(prevSkipped => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  }

  function handleReset() {
    props.resetHandler();
    setActiveStep(0);
  }

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed - you&apos;re finished
            </Typography>
            <Button onClick={handleReset} className={classes.button}>
              Reset
            </Button>
          </div>
        ) : (
          <div>
            <div>{getStepContent(activeStep, props)}</div>
            <div>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.button}
              >
                Back
              </Button>
              {isStepOptional(activeStep) && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSkip}
                  className={classes.button}
                >
                  Skip
                </Button>
              )}
              {isLastStep() && (
                <>
                  <Button onClick={handleReset} className={classes.button}>
                    Reset
                  </Button>
                  <HTMLDialog toHtml={props.toHtml} textMap={props.textMap} />
                </>
              )}
              <Button
                disabled={activeStep === 0 && !props.audioFile}
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}
              >
                {isLastStep() ? 'Send data to server' : 'Next'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HorizontalLinearStepper;
