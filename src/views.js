var express = require('express');
var fs = require('fs');
const path = require('path');

import asyncMiddleware from './utils';

var app = express();

const SRC_PATH = path.join(process.cwd(), 'src');
const ASSETS_PATH = path.join(process.cwd(), 'assets');

const get_mime_type = function(filename) {
  if (filename.includes('.ogv')) {
    return 'video/ogg';
  } else if (filename.includes('.webm')) {
    return 'video/webm';
  } else {
    return 'video/mp4';
  }
};


// for views
app.set('views', SRC_PATH + '/views');
app.set('view engine', 'pug');

app.get('/', function (req, res) {
  res.render('index', { title: 'Hey'});
});

app.get('/academy/media/:filename', asyncMiddleware(async (req, res) => {
  const file_path = `${ASSETS_PATH}/${req.params.filename}`;
  const stat = fs.statSync(file_path);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize-1;
    const chunksize = (end-start)+1;
    const file = await fs.createReadStream(file_path, {start, end});
    const head = {
      'Content-Range': `bytes ${start} - ${end} / ${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': get_mime_type(req.params.filename),
      'Access-Control-Allow-Origin': '*'
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4'
    };
    res.writeHead(200, head);
    fs.createReadStream(file_path).pipe(res)
  }
}));

export default app;