"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var fileService_1 = require('../../../app/services/fileService');
var UploadComponent = (function () {
    function UploadComponent(fileService) {
        this.fileService = fileService;
        if (localStorage.getItem("uploadedFiles") === null) {
            this.uploadedFiles = [];
        }
        else {
            this.uploadedFiles = JSON.parse(localStorage.getItem("uploadedFiles"));
        }
    }
    UploadComponent.prototype.selectFile = function (event) {
        console.log(event.target.files);
        this.fileToUpload = event.target.files[0];
    };
    UploadComponent.prototype.upload = function () {
        console.log(this.fileToUpload);
        this.uploadedFiles.push({ fileName: this.fileToUpload.name });
        localStorage.setItem("uploadedFiles", JSON.stringify(this.uploadedFiles));
        this.fileService.uploadFile(this.fileToUpload)
            .subscribe(function (data) { return console.log(data); }, function (error) { return console.log(error); });
    };
    UploadComponent = __decorate([
        core_1.Component({
            selector: 'upload-section',
            templateUrl: '../../../app/components/upload/upload.html',
            providers: [fileService_1.FileService]
        }), 
        __metadata('design:paramtypes', [fileService_1.FileService])
    ], UploadComponent);
    return UploadComponent;
}());
exports.UploadComponent = UploadComponent;
//# sourceMappingURL=upload.component.js.map