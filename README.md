# ACM Teach LA Backend

This is the (JS) middleware/backend code for the ACM Teach LA [editor](https://editor.uclaacm.com). It's built by the UCLA ACM Teach LA dev team with [Express](https://expressjs.com/) and [Firebase](https://firebase.google.com/).

## Developer Setup

You'll need:

- [Node](https://nodejs.org/en/) (we develop this with Node v12.14.1 LTS)
- [git](https://git-scm.com/)
- either npm (which comes default with Node) or [yarn](https://yarnpkg.com/en/)

Once you have those dependencies, set up is very simple.

Type the following lines into your command line:

```bash
$ git clone https://github.com/uclaacm/TeachLAJSBackend.git
$ cd TeachLAJSBackend
$ npm install
$ npm start
```

You can now test the API on `localhost:8081`.

You might want to test the backend with our frontend (which you can find more information on [here](https://github.com/uclaacm/TeachLAFrontend)).

To do that, open another terminal window:

```bash
$ git clone https://github.com/uclaacm/TeachLAFrontend.git
$ cd TeachLAFrontend
$ npm install
$ npm start
```

The front-end client should now be automatically opened in your browser; however, you can also manually visit it on `localhost:8080`. The backend is still open on `localhost:8081`.
