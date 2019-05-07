import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { IUser, UserService } from '../_services';


@Component(
  {
    templateUrl: 'admin-page.component.html',
    styleUrls: ['./admin-page.component.scss']
  })
export class AdminPageComponent implements OnInit {
  displayedColumns: string[] = ['userName', 'firstName', 'lastName', 'role', 'edit', 'delete'];
  users: Array<IUser>;

  constructor(private userService: UserService,
              private router: Router) {}

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

  edit(user: IUser) {
    const navigationExtras: NavigationExtras = {
      queryParams: user
    };
    this.router.navigate(['add'], navigationExtras);
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
