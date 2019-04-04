import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { apiUrl } from './_services';

export interface ITre {
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
  ndParents: Array<INdParent>;
  ID: string;
  userName: string;
}

export interface IFi {
  des: any;
  lbl: any;
  ID: string;
}

export interface INd {
  des: any;
  lbl: any;
  ID: string;
  FI: Array<IFi>;
}

export interface INdParent {
  des: any;
  lbl: any;
  ID: string;
  ND: Array<INd>;
}

@Injectable({
  providedIn: 'root'
})
export class TresService {
  private frontendApi = `${apiUrl}/api/fronted`;
  constructor(private http: HttpClient) { }

  addTre(lbl: string, des?: string) {
    return this.http.post<ITre>(`${this.frontendApi}/tre/new/`, { lbl, des });
  }

  addNdParent(treId: string, lbl: string, des?: string) {
    return this.http.post<ITre>(`${this.frontendApi}/ndparent/new/${treId}/`, { lbl, des });
  }

  addNd(ndParentId: string, lbl: string, des?: string) {
    return this.http.post<INdParent>(`${this.frontendApi}/nd/new/${ndParentId}/`, { lbl, des });
  }

  addFi(ndId: string, fiType: string, lbl: string, des?: string) {
    return this.http.post<IFi>(`${this.frontendApi}/fi/new/${ndId}/${fiType}/`, { });
  }

  getTres() {
    return this.http.get<ITre[]>(`${this.frontendApi}/tre/`);
  }

  getTre(id: string) {
    return this.http.get<ITre>(`${this.frontendApi}/tre/${id}`);
  }

  getNdParent(id: string) {
    return this.http.get<any>(`${this.frontendApi}/ndparent/${id}`);
  }

  getNd(id: string) {
    return this.http.get<INd>(`${this.frontendApi}/nd/${id}`);
  }

  getFi(id: string) {
    return this.http.get<any>(`${this.frontendApi}/fi/${id}`);
  }

  deleteTre(id: string) {
    return this.http.delete<Array<ITre>>(`${this.frontendApi}/tre/${id}`);
  }

  deleteNdParent(id: string) {
    return this.http.delete<ITre>(`${this.frontendApi}/ndparent/${id}`);
  }

  deleteNd(id: string) {
    return this.http.delete<INdParent>(`${this.frontendApi}/nd/${id}`);
  }

  deleteFi(id: string) {
    return this.http.delete<INd>(`${this.frontendApi}/fi/${id}`);
  }
}
