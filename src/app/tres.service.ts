import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from './_services';

interface ITre {
  lnkCol0: string;
  prnt: string;
  lnkCol0tl: string;
  lnkCol2: string;
  lnkCol1: string;
  fiRigid: string;
  srch: string;
  ful: string;
  lnkCol2w: string;
  nLnkCols: string;
  lnkCol1w: string;
  lnkCol0w: string;
  mxPgs: string;
  v: string;
  lnkCol1tl: string;
  lnkCol2tl: string;
  des: any;
  lbl: any;
  ndParents: Array<any>;
  ID: string;
  userName: string;
}

@Injectable({
  providedIn: 'root'
})
export class TresService {
  private frontendApi = `${apiUrl}/api/fronted`;
  constructor(private http: HttpClient) { }

  getTres() {
    return this.http.get<ITre[]>(`${this.frontendApi}/tre`);
  }

  getTre(id: string) {
    return this.http.get<ITre>(`${this.frontendApi}/tre/${id}`);
  }

  getNdParent(id: string) {
    return this.http.get<any>(`${this.frontendApi}/ndparent/${id}`);
  }

  getNd(id: string) {
    return this.http.get<any>(`${this.frontendApi}/nd/${id}`);
  }

  getFi(id: string) {
    return this.http.get<any>(`${this.frontendApi}/fi/${id}`);
  }
}
