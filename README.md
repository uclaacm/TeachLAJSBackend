## ACM Teach LA Backend

This is the backend code for the ACM Teach LA helper site, which functions as an online IDE and code-saver. It's built by the UCLA ACM Teach LA dev team with [Express](https://expressjs.com/) and [Firebase](https://firebase.google.com/).

## Developer Setup

You'll need:

- [Node](https://nodejs.org/en/) (we develop this with Node v10)
- [git](https://git-scm.com/)
- either npm (which comes default with Node) or [yarn](https://yarnpkg.com/en/)

This project won't make much sense without our Frontend - you can find more information on that [here](https://github.com/uclaacm/TeachLAFrontend).

Once you have those dependencies, set up is very simple. Type the following lines into your command line:

```bash
$ git clone https://github.com/uclaacm/TeachLAFrontend.git
$ git clone https://github.com/uclaacm/TeachLAJSBackend.git
$ cd TeachLAJSBackend
$ npm install
$ npm start
# in a separate terminal window
$ cd ../teachla-frontend
$ npm install
$ npm start
```

Contact @malsf21 for the correct /firebase-config.js required to connect to the Firebase project

The front-end client should now be automatically opened in your browser; however, you can also manually visit it on `localhost:8080`. The backend is open on `localhost:8081`.

## Developer Notes

- We use lint-staged and husky to prettify commited files on push
