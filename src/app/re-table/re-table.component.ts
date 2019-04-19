import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-re-table',
  templateUrl: './re-table.component.html',
  styleUrls: ['./re-table.component.scss']
})
export class ReTableComponent implements OnInit {
  @Input() tableData: Array<any> | any;
  objectKeys = Object.keys;

  constructor() { }

  ngOnInit() {
    const a = 1;
  }

  isArray(obj) {
    return '[object Array]' === Object.prototype.toString.call(obj);
  }

  isObject(obj) {
    return typeof obj === 'object';
  }

  isTable(obj) {
    return (obj !== undefined && obj !== null) && (this.isArray(obj) || this.isObject(obj));
  }
}

