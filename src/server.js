'use strict';
const http = require(`http`);
const path = require(`path`);
const fs = require(`fs`);
const url = require(`url`);

module.exports = {
  name: `server`,
  description: `Run server`,
  execute(port = 3000) {
    const mimeType = {
      'css': `text/css`,
      'html': `text/html; charset=UTF-8`,
      'jpg': `image/jpeg`,
      'ico': `image/x-icon`
    };
    http.createServer(function (req, res) {
      console.log(`${req.method} ${req.url}`);
      // parse URL
      const parsedUrl = url.parse(req.url);
      // extract URL path
      // Avoid https://en.wikipedia.org/wiki/Directory_traversal_attack
      // e.g curl --path-as-is http://localhost:9000/../fileInDanger.txt
      // by limiting the path to current directory only
      const sanitizePath = path.normalize(parsedUrl.pathname).replace(/^(\.\.[\/\\])+/, ``);
      let pathname = path.join(__dirname, sanitizePath);
      fs.exists(pathname, function (exist) {
        if(!exist) {
          // if the file is not found, return 404
          res.statusCode = 404;
          res.end(`File ${pathname} not found!`);
          return;
        }
        // if is a directory, then look for index.html
        if (fs.statSync(pathname).isDirectory()) {
          pathname += `../static/index.html`;
        }
        // read file from file system
        fs.readFile(pathname, function (err, data) {
          if (err) {
            res.statusCode = 500;
            res.end(`Error getting the file: ${err}.`);
          } else {
            // based on the URL path, extract the file extention. e.g. .js, .doc, ...
            const ext = path.parse(pathname).ext;
            // if the file is found, set Content-type and send data
            res.setHeader(`Content-type`, mimeType[ext] || `text/plain` );
            res.end(data);
          }
        });
      });
    }).listen(port);
  }
};
