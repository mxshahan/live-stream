const { NodeMediaServer } = require('node-media-server');
const download = require('download-file');
const express = require('express');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 8001;

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 60,
    ping_timeout: 30
  },
  http: {
    port: 8000,
    webroot: './public',
    mediaroot: './media',
    allow_origin: '*'
  },
  https: {
    port: 8443,
    key: './privatekey.pem',
    cert: './certificate.pem',
  },
  auth: {
    api: true,
    api_user: 'admin',
    api_pass: 'admin',
    play: false,
    publish: false,
    secret: 'nodemedia2017privatekey'
  },
  trans: {
    ffmpeg: 'node_modules/ffmpeg',
    tasks: [
      {
        app: 'vod',
        ac: 'aac',
        mp4: true,
        mp4Flags: '[movflags=faststart]',
      },
      {
        app: 'mv',
        mode: 'static',
        edge: '/media/abcd.mp4',
        name: 'dq'
      }
    ]
  }
};


var nms = new NodeMediaServer(config)
nms.run();

nms.on('preConnect', (id, args) => {
  console.log('[NodeEvent on preConnect]', `id=${id} args=${JSON.stringify(args)}`);
  let session = nms.getSession(id);
  // session.reject();
});

nms.on('postConnect', (id, args) => {
  console.log('[NodeEvent on postConnect]', `id=${id} args=${JSON.stringify(args)}\n`);
});

nms.on('doneConnect', (id, args) => {
  console.log('[NodeEvent on doneConnect]', `id=${id} args=${JSON.stringify(args)}\n`);
});

nms.on('prePublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}\n`);

  var url = 'http://localhost:8000'+StreamPath+'.flv';
  var options = {
    directory: './public/media/',
    filename: Date.now()+'.flv'
  }
  download(url, options, function(err) {
    if(err) throw err;
    console.log('Meow')
  })
});

nms.on('postPublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on postPublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}\n`);
  
});

nms.on('donePublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on donePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}\n`);

  shell.exec('ffmpeg -re -i rtmp://192.168.1.6/live/sh.flv -c:v copy -c:a copy -f flv rtmp://192.168.1.6/live/sh');
// shell.exec('webpack');

});

nms.on('prePlay', (id, StreamPath, args) => {
  console.log('[NodeEvent on prePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}\n`);
  // let session = nms.getSession(id);
  // session.reject();
});

nms.on('postPlay', (id, StreamPath, args) => {
  console.log('[NodeEvent on postPlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}\n`);
});

nms.on('donePlay', (id, StreamPath, args) => {
  console.log('[NodeEvent on donePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}\n`);
});

app.get('/media', (req, res) => {
  fs.readdir(__dirname + '/public/media', (err, data) => {
    if (err) throw err;
    
    res.status(200).json({
      files: data,
      url: req.protocol + '://' + req.get('host') + req.originalUrl
    })
  });
})

app.use(express.static(__dirname+'/public'))

app.listen(port, (err) =>{
  console.log('Listening Port : '+port)
})