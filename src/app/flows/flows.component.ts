import { animate, state, style, transition, trigger } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
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
  styleUrls: ['./flows.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class FlowsComponent implements OnInit {
  @ViewChild('file') file;
  displayedColumns: string[] = ['select', 'number', 'label', 'status', 'download', 'delete'];
  selection = new SelectionModel<any>(true, []);
  dataSource: any;
  fileTypes: any[] = [
    { value: 'yes_no', viewValue: 'yes_no' },
    { value: 'flowchart', viewValue: 'flowchart' },
    { value: 'table', viewValue: 'table' }
  ];
  canUpload = false;
  uploading = false;
  ndId: string;
  ndParentId: string;
  treId: string;
  fileType: string;
  public files: Set<File> = new Set();
  expandedElement: any;
  objectKeys = Object.keys;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private tresService: TresService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.file.nativeElement.value = '';
      this.fileType = undefined;
      this.canUpload = false;
      this.ndId = params.ndId;
      this.ndParentId = params.ndParentId;
      this.treId = params.treId;
      this.getFiList();
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    if (!this.dataSource) return false;
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
    this.selection.clear() :
    this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
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
    const mapedResult = result.FI.map((fi, index) => {
      return {
        number: index + 1,
        label: fi.lbl,
        status: 'Success',
        ID: fi.ID,
        PG: fi.PG
      };
    });

    this.dataSource = new MatTableDataSource<any>(mapedResult);
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

  download(fi: any) {
    this.tresService.downloadFi(fi.ID).subscribe(
      (data: any) => {
        this.downloadFile(data, 'xml');
      },
      error => {
        console.error(error);
      });
  }

  exportSelected() {
    const selectedFIIds = this.selection.selected.map(row => {
      return { ID: row.ID};
    });
    const data = {
      ID: this.treId,
      ndParents: [
        {
          ID: this.ndParentId,
          ND: [
            {
              ID: this.ndId,
              FI: selectedFIIds
            }
          ]
        }
      ]
    };
    this.tresService.export(data).subscribe(
      (result: any) => {
        this.downloadFile(result, 'zip');
      },
      error => {
        console.error(error);
      });
  }

  downloadFile(data: any, type: string) {
    const blob = new Blob([data], { type: type.toString() });
    const url = window.URL.createObjectURL(blob);
    const pwa = window.open(url);
    if (!pwa || pwa.closed || pwa.closed === undefined) {
      alert('Please disable your Pop-up blocker and try again.');
    }
  }
}
