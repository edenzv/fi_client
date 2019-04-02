import { Component, OnInit } from '@angular/core';
import { IUser, UserService } from '../_services';


@Component(
  {
    templateUrl: 'admin-page.component.html',
    styleUrls: ['./admin-page.component.scss']
  })
export class AdminPageComponent implements OnInit {
  displayedColumns: string[] = ['userName', 'password', 'firstName', 'lastName', 'role', 'delete'];
  users: Array<IUser>;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.initUsersTable();
  }

  initUsersTable() {
    this.userService.getAllUsers().subscribe(users => {
        this.users = users;
      },
      (error) => {
        console.error(error);
      });
  }

  deleteUser(user: IUser) {
    this.userService.delete(user).subscribe(users => {
        this.initUsersTable();
      },
      (error) => {
        console.error(error);
      });
  }
}
