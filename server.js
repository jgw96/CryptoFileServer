const express = require('express');
const multer = require('multer');
const fs = require("fs");
const path = require("path");

const app = express();

const encryptor = require('file-encryptor');
const key = 'My Super Secret Key';
const options = { algorithm: 'aes256' };

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

app.use(express.static('public'));

app.post('/', upload.single('upload'), (req, res) => {
    console.log("called");
    encryptor.encryptFile("uploads/" + req.file.filename, req.file.originalname, key, options, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("encrypted");
            res.status(204).end();
            fs.unlink("uploads/" + req.file.filename);
        }
    });
});

app.post('/download', (req, res) => {
    encryptor.decryptFile(req.body.filename, req.body.filename, key, (err) => {
        if (err) {
            console.log(err);
        } else {
            res.download(req.body.filename, req.body.filename, (err) => {
                if (err) {
                    // Handle error, but keep in mind the response may be partially-sent
                    // so check res.headersSent
                    console.log(err);
                } else {
                    // decrement a download credit, etc.
                    console.log("file sent");
                };
            });
        };
    });
});

app.listen(8080);

