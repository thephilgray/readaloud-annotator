<p align="center">
<img width="150" src="src/logo.svg" alt="Logo">
</p>

<h1 align="center">Readaloud Annotator</h1>

An intuitive user interface for capturing text-audio sync data.

## Demo

https://custom-readaloud-annotator.firebaseapp.com/

## How to use

- The user first selects an audio file and then enter text.
- The text is split by line breaks and spaces and wrapped in clickable spans.
- The user can then play the audio and click the text to set "in" times.
- "Out" times are assumed to be either the end of the text or the next "in". The user can sync text to audio with at least word-level precision (within 500ms of time precision), but may also create other kinds of groupings.
- During annotation, the user can see and interact with the annotated text using [custom-readaloud](https://github.com/thephilgray/custom-readaloud-plugin), a plugin built specially for text-audio highlighting/syncing in ebooks.
- When finished, the user can see and copy the HTML generated for custom-readaloud (helpful if they don't have the resources to work with Firebase) or submit the data to the Firebase database. The resulting data can be used for other solutions besided custom-readloud.

## Development

> Required: You must have Node and npm (Node Package Manager) installed on your system

### To start the development server:

- Install all dependencies with `npm i`
- Run `npm run start`

### Build for Production

- Install all dependencies
- Run `npm run build`
- The production files will be output to `build`

> Note: See [Create React App](https://github.com/facebook/create-react-app) for more info

### Deploying to Firebase

> Note: Steps and sequence need to be confirmed. May need to remove and untrack generated Firebase config files from repo.

- Create a new [Firebase](https://firebase.google.com/) project
- Setup a Realtime Database
- From Firebase project settings, add an app
- Rename `sample.env` to `.env` and replace the variable values with the config values for your Firebase app
- Install `firebase-tools` globally
  ```bash
  npm i -g firebase-tools
  ```
- Sign in to Google with `firebase-tools`
  ```bash
  firebase login
  ```
- Initiate project
  ```bash
  firebase init
  ```
  - Follow the command line prompts:
    - select Hosting
    - select your Firebase project
    - select `build` as the public directory
    - select `yes` to configure as a single-page app
    - select `no` to not overwrite `index.html`
- Build the app for production with `npm run build`
- Deploy to Firebase
  ```bash
  firebase deploy
  ```

### Working with Data from Firebase

- Use fetch or your favorite promise library to get the JSON from `https://your-fire-base-app.firebaseio.com/files.json`
- Use the Firebase JS SDK (see helpful resources)

#### Helpful Resources

- [Firebase Web Docs](https://firebase.google.com/docs/web/setup)
- [React and Firebase are all you need to host your web apps](https://medium.freecodecamp.org/react-and-firebase-are-all-you-need-to-host-your-web-apps-f7ab55919f53)
- [A Firebase in React Tutorial for Beginners [2019]](https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial/#react-firebase-context-api)
- [How to deploy a React application to Firebase](https://www.robinwieruch.de/firebase-deploy-react-js/)
- [How to use Firebase Realtime Database in React](https://www.robinwieruch.de/react-firebase-realtime-database/)

## Built With

- [Create React App](https://github.com/facebook/create-react-app)
- [Material-UI](https://material-ui.com/)
- [Firebase](https://firebase.google.com/)

## TODO

- [ ] Implement authentication, lockdown db
- [ ] Implement proper validation and sanitization
- [ ] Fix the buggy speed control which is sometimes overridden by the custom-readaloud instance when the user clicks on the text in the preview
- [ ] Add smooth transitions on page load and interaction
- [ ] Once more precise timing is implemented for Custom Readaloud (currently limited to within 500ms), use the instance API for timestamps or implement a similar solution
- [ ] The app assumes you want to annotate a paragraph of text. It will convert linebreaks, but that's about it. Look into allowing markdown input (or via a WYSIWYG editor) to allow other kinds of content and formatting
- [ ] The app also assumes that you only want to annotate at a word level. Perhaps you want to get really precise and work at a syllable or even character level. While this could make input more difficult for other users, it would be a nice option to have, or may involve some kind of pre-annotation annotating.
