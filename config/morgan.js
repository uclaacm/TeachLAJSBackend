const morgan = require("morgan");

function morganSetup(app) {
  if (
    process &&
    process.env &&
    (process.env.NODE_ENV == "dev" || process.env.NODE_ENV == "debug")
  ) {
    app.use(
      morgan(
        function(tokens, req, res) {
          return [
            "==========",
            tokens.method(req, res),
            tokens.url(req, res),
            "==========",
            "\nDate: ",
            tokens.date(req, res),
          ].join(" ");
        },
        {
          immediate: true,
        },
      ),
    );
    app.use(
      morgan(function(tokens, req, res) {
        return [
          "Status:",
          tokens.status(req, res),
          // "\nContent-Length:", tokens.res(req, res, 'content-length'), '-',
          "\nResponse-time:",
          tokens["response-time"](req, res),
          "ms",
          "\n>>>>>>>>>>",
          tokens.method(req, res),
          tokens.url(req, res),
          "<<<<<<<<<<",
        ].join(" ");
      }),
    );
  } else {
    app.use(morgan("common"));
  }
}

module.exports = morganSetup;
