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
  PG: any;
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
    return this.http.post<INdParent>(`${this.frontendApi}/ndparent/new/${treId}/`, { lbl, des });
  }

  addNd(ndParentId: string, lbl: string, des?: string) {
    return this.http.post<INd>(`${this.frontendApi}/nd/new/${ndParentId}/`, { lbl, des });
  }

  addFi(ndId: string, fiType: string, file: any) {
    const body = new FormData();
    body.append('fiDoc', file, file.name);
    return this.http.post<{ message: string; }>(`${this.frontendApi}/fi/new/${ndId}/${fiType}/`, body);
  }

  updateTre(treId: string, data: any) {
    return this.http.put<ITre>(`${this.frontendApi}/tre/${treId}/`, data);
  }

  updateNdParent(ndParentId: string, data: any) {
    return this.http.put<INdParent>(`${this.frontendApi}/ndparent/${ndParentId}/`, data);
  }

  updateNd(ndId: string, data: any) {
    return this.http.put<INd>(`${this.frontendApi}/nd/${ndId}/`, data);
  }

  updateFi(fiId: string, fiType: string, file: any) {
    const body = new FormData();
    body.append('fiDoc', file, file.name);
    return this.http.put<{ message: string; }>(`${this.frontendApi}/fi/${fiId}`, body);
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

  downloadFi(id: string) {
    return this.http.get(`${this.frontendApi}/fi/${id}/fidoc/`, { responseType: 'blob' });
  }

  export(data: any) {
    // return this.http.post<any>(`${this.frontendApi}/export`, data, { responseType: 'arraybuffer' });
    return this.http.post<any>(`${this.frontendApi}/export`, data);
  }

  addOcr(file: any) {
    const body = new FormData();
    body.append('fiImage', file, file.name);
    return this.http.post(`${this.frontendApi}/ocr/`, body, { responseType: 'blob' });
  }
}
