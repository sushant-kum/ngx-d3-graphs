/**
 * @author Sushant Kumar
 * @email sushant.kum96@gmail.com
 * @create date 2020-01-05 17:29:14
 * @modify date 2020-01-05 17:29:14
 * @desc Mock server using `json-server`
 */

const jsonServer = require('json-server');
const pause = require('connect-pause');

const config = require('./configs/config');
const db = require('./configs/db.config');
const custRoutes = require('./configs/routes.config');
const custHttpMethods = require('./configs/optional/http-method.config');
const custHttpStatusCodes = require('./configs/optional/http-status.config');
const custHttpStatusMessages = require('./configs/optional/http-status-message.config');

const port = process.env.PORT || config.port;
const delay = config.delay;

const server = jsonServer.create();
const router = jsonServer.router(db);
const middlewares = jsonServer.defaults();

/********** Operations **********/
/* Convert non-GET requests to GET here */
for (const path of Object.keys(custHttpMethods)) {
  server[custHttpMethods[path]](path, (req, res, next) => {
    req.method = 'GET';
    console.log(`[JSRV] "${path}" METHOD "${custHttpMethods[path].toUpperCase()}" -> "GET"`);
    next();
  });
}

/* Convert response STATUS CODE:200 to STATUS CODE:non-200 and STATUS MESSAGE:default to STATUS MESSAGE:custom here */
router.render = (
  req: { originalUrl: string | number },
  res: {
    statusMessage: any;
    status: (arg0: any) => { (): any; new (): any; jsonp: { (arg0: any): void; new (): any } };
    locals: { data: any };
    jsonp: (arg0: any) => void;
  }
) => {
  if (custHttpStatusCodes[req.originalUrl] || custHttpStatusMessages[req.originalUrl]) {
    if (custHttpStatusCodes[req.originalUrl]) {
      console.log(`[JSRV] \"${req.originalUrl}\" STATUS 200 -> ${custHttpStatusCodes[req.originalUrl]}`);
    }
    if (custHttpStatusMessages[req.originalUrl]) {
      console.log(
        `[JSRV] \"${req.originalUrl}\" STATUS MESSAGE "${res.statusMessage}" -> "${
          custHttpStatusMessages[req.originalUrl]
        }"`
      );
    }
    if (custHttpStatusCodes[req.originalUrl] && custHttpStatusMessages[req.originalUrl]) {
      res.statusMessage = custHttpStatusMessages[req.originalUrl];
      res.status(custHttpStatusCodes[req.originalUrl]).jsonp(res.locals.data);
    } else if (custHttpStatusCodes[req.originalUrl] && !custHttpStatusMessages[req.originalUrl]) {
      res.status(custHttpStatusCodes[req.originalUrl]).jsonp(res.locals.data);
    } else if (!custHttpStatusCodes[req.originalUrl] && custHttpStatusMessages[req.originalUrl]) {
      res.statusMessage = custHttpStatusMessages[req.originalUrl];
      res.jsonp(res.locals.data);
    }
  } else {
    res.jsonp(res.locals.data);
  }
};

/* Avoid CORS issue when serving static files */
server.use((req: any, res: { header: (arg0: string, arg1: string) => void }, next: () => void) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

server.use(pause(delay));
server.use(middlewares);
server.use(jsonServer.rewriter(custRoutes));
server.use(router);
server.listen(port, () => {
  console.log(`[JSRV] Mock server running on port ${port}`);
});
