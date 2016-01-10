var express = require('express');
var multer = require('multer');
var fs = require("fs");

var app = express();

var encryptor = require('file-encryptor');
var key = 'My Super Secret Key';
var options = { algorithm: 'aes256' };

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

var upload = multer({ storage: storage });

app.use(express.static('public'));

app.post('/', upload.single('upload'), function (req, res) {
    encryptor.encryptFile("uploads/" + req.file.filename, req.file.originalname, key, options, function (err) {
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

app.listen(8081);

