"use strict";

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require("path");
const crypto = require("crypto");
const encryptor = require("file-encryptor");

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

const server = app.listen(3000, () => {
    let host = server.address().address;
    let port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});