import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models';
import { apiUrl } from './authentication.service';

export interface IUser {
  userName: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
    private authApi = `${apiUrl}/api/user`;
    constructor(private http: HttpClient) { }

   getAllUsers() {
        return this.http.get<IUser[]>(`${this.authApi}/getAll`);
    }

   create(user: IUser) {
      return this.http.post(this.authApi + '/register', user);
    }

  delete(user: IUser) {
    return this.http.delete( `${this.authApi}/delete/${user.userName}/`);
  }
}
