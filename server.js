"use strict";

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require("path");
const crypto = require("crypto");
const encryptor = require("file-encryptor");
const fs = require("fs");
const https = require("https");
const Dropbox = require("dropbox");

const client = new Dropbox.Client({
    key: "yw3hqixwbqu9azm",
    secret: "va2vzkxy6k0p2re"
});

client.authDriver(new Dropbox.AuthDriver.NodeServer(8191));

client.authenticate(function(error, client) {
  if (error) {
    console.log(error);
  }
  else {
      console.log("authenticated");
  }
});

//remove an unempty directory 
const rmdirAsync = (path, callback) => {
    fs.readdir(path, (err, files) => {
        if (err) {
            // Pass the error on to callback
            callback(err, []);
            return;
        }
        let wait = files.length,
            count = 0,
            folderDone = function (err) {
                count++;
                // If we cleaned out all the files, continue
                if (count >= wait || err) {
                    fs.rmdir(path, callback);
                }
            };
        // Empty directory to bail early
        if (!wait) {
            folderDone();
            return;
        }
		
        // Remove one or more trailing slash to keep from doubling up
        path = path.replace(/\/+$/, "");
        files.forEach((file) => {
            let curPath = path + "/" + file;
            fs.lstat(curPath, (err, stats) => {
                if (err) {
                    callback(err, []);
                    return;
                }
                if (stats.isDirectory()) {
                    rmdirAsync(curPath, folderDone);
                } else {
                    fs.unlink(curPath, folderDone);
                }
            });
        });
    });
};

//key used for encryption
const key = "e8QI,Mr$*Z]D//|Z?^36xh9MwZTh9k";

//setting algo to AES 256
const options = { algorithm: 'aes256' };

//storage engine to handle writing files to disk
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            if (err) return cb(err)

            cb(null, raw.toString('hex') + path.extname(file.originalname))
        })
    }
})

//setting my storage engine
const upload = multer({ storage: storage })

const app = express();

https.createServer({
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
}, app).listen(55555);

//serve the frontend
app.use(express.static('public'));

//this route handles getting files uploaded, encrypting them and writing them to disk
app.post('/', upload.single('upl'), (req, res) => {
    
    //encrypt the file using the above key
    encryptor.encryptFile(req.file.path, req.file.originalname, key, options, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            client.writeFile(req.file.originalname, req.file.originalname, (error, stat) => {
                if(error) {
                    console.log(error);
                }
                else {
                    console.log("file saved to dropbox");
                }
            })
            console.log("encrypted");
        }

    });

});
