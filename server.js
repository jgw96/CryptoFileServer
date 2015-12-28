"use strict";

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require("path");
const crypto = require("crypto");
const encryptor = require("file-encryptor");
const fs = require("fs");
const https = require("https");

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
    
    console.log(req.file); 
    
    //encrypt the file using the above key
    encryptor.encryptFile(req.file.path, req.file.originalname, key, options, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("encrypted");
        }

    });

});
