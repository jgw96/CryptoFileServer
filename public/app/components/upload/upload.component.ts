import { Component } from '@angular/core';

import { FileService } from '../../../app/services/fileService';


@Component({
  selector: 'upload-section',
  templateUrl: '../../../app/components/upload/upload.html',
  providers: [FileService]
})
export class UploadComponent {

  fileToUpload: any;
  uploadedFiles: any[];

  constructor(private fileService: FileService) {
    if (localStorage.getItem("uploadedFiles") === null) {
      this.uploadedFiles = [];
    } else {
      this.uploadedFiles = JSON.parse(localStorage.getItem("uploadedFiles"));
    }
  }

  selectFile(event: any) {
    console.log(event.target.files);
    this.fileToUpload = event.target.files[0];
  }

  upload() {
    console.log(this.fileToUpload);
    this.uploadedFiles.push({fileName: this.fileToUpload.name});
    localStorage.setItem("uploadedFiles", JSON.stringify(this.uploadedFiles));
    this.fileService.uploadFile(this.fileToUpload)
      .subscribe(
      data => console.log(data),
      error => console.log(error));
  }
}