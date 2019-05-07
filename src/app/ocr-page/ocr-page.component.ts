import { Component, OnInit, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';
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
  fileType: string;
  uploading = false;
  canUpload = false;
  fileTypes: any[] = [];

  constructor(private tresService: TresService) { }

  ngOnInit() {
    this.tresService.getOcrTypes()
      .subscribe((result: Array<string>) => {
        this.fileTypes = result.map(p => ({value: p, viewValue: p }));
    });
  }

  addOcr() {
    this.fileOcr.nativeElement.click();
  }

  fileTypeSelected($event: any) {
    this.canUpload = true;
    this.fileType = $event.value;
  }

  uploadOcr() {
    if (this.fileOcr && this.fileOcr.nativeElement && this.fileOcr.nativeElement.files[0]) {
      this.uploadingOcr = true;
      this.tresService.addOcr(this.fileOcr.nativeElement.files[0], this.fileType).subscribe(
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
