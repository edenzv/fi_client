import { Component, OnInit, ViewChild } from '@angular/core';
import { downloadFileByType } from '../flows/flows.component';
import { TresService } from '../tres.service';

@Component({
  selector: 'app-ocr-page',
  templateUrl: './ocr-page.component.html',
  styleUrls: ['./ocr-page.component.scss']
})
export class OcrPageComponent implements OnInit {
  @ViewChild('fileOcr') fileOcr;
  uploadingOcr = false;
  uploading = false;
  constructor(private tresService: TresService) { }

  ngOnInit() {
  }

  addOcr() {
    this.fileOcr.nativeElement.click();
  }

  uploadOcr() {
    if (this.fileOcr && this.fileOcr.nativeElement && this.fileOcr.nativeElement.files[0]) {
      this.uploadingOcr = true;
      this.tresService.addOcr(this.fileOcr.nativeElement.files[0]).subscribe(
        (file: any) => {
          this.uploadingOcr = false;
          this.fileOcr.nativeElement.value = '';
          downloadFileByType(file, 'application/msword', 'ocr.doc');
        },
        error => {
          this.uploading = false;
          console.error(error);
          this.fileOcr.nativeElement.value = '';
        });
    }
  }


}
