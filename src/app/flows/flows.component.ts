import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser } from '../_services';
import { IFi, INd, INdParent, TresService } from '../tres.service';

export interface IFiModel {
  number: number;
  label: string;
  status: string;
}

@Component({
  selector: 'app-flows',
  templateUrl: './flows.component.html',
  styleUrls: ['./flows.component.scss']
})
export class FlowsComponent implements OnInit {
  @ViewChild('file') file;
  displayedColumns: string[] = ['number', 'label', 'status', 'download', 'export', 'delete'];
  dataSource = [];
  fileTypes: any[] = [
    { value: 'yes_no', viewValue: 'yes_no' },
    { value: 'flowchart', viewValue: 'flowchart' },
    { value: 'table', viewValue: 'table' }
  ];
  canUpload = false;
  uploading = false;
  ndId: string;
  fileType: string;
  public files: Set<File> = new Set();

  constructor(private route: ActivatedRoute,
              private router: Router,
              private tresService: TresService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.file.nativeElement.value = '';
      this.fileType = undefined;
      this.canUpload = false;
      this.ndId = this.route.snapshot.paramMap.get('id');
      this.getFiList();
    });
  }

  private getFiList() {
    if (this.ndId) {
      this.tresService.getNd(this.ndId).subscribe(
        (result) => {
          this.initDataSource(result);
        });
    }
  }

  private initDataSource(result) {
    this.dataSource = result.FI.map((fi, index) => {
      return {
        number: index + 1,
        label: fi.lbl,
        status: 'Success',
        ID: fi.ID
      };
    });
  }

  upload() {
    if (this.file && this.file.nativeElement && this.file.nativeElement.files[0]) {
      this.uploading = true;
      this.tresService.addFi(this.ndId, this.fileType, this.file.nativeElement.files[0]).subscribe(
        (data: { message: string; }) => {
          this.getFiList();
          this.uploading = false;
          this.file.nativeElement.value = '';
        },
        error => {
          this.uploading = false;
          console.error(error);
          this.file.nativeElement.value = '';
        });
    }
  }

  fileTypeSelected($event: any) {
    this.canUpload = true;
    this.fileType = $event.value;
  }

  addFile() {
    this.file.nativeElement.click();
  }

  delete(fi: any) {
    this.tresService.deleteFi(fi.ID).subscribe(
      (data: INd) => {
        this.initDataSource(data);
      },
      error => {
        console.error(error);
      });
  }
}
