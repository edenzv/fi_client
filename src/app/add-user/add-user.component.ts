import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { IUser, UserService } from '../_services';

@Component(
  {
    templateUrl: 'add-user.component.html',
    styleUrls: ['./add-user.component.scss']
  })
export class AddUserComponent implements OnInit {
  registerForm: FormGroup;
  public model: IUser;
  public loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  public register() {
    this.loading = true;
    this.model = {
      userName: this.f.userName.value,
      password: this.f.password.value,
      firstName: this.f.firstName.value,
      lastName: this.f.lastName.value,
      role: 'user'
    };
    this.userService.create(this.model)
      .subscribe(
        (data) => {
          // this.alertService.success('Registration successful', true);
          this.router.navigate(['/users']);
        },
        (error) => {
          console.error(error);
          this.loading = false;
        });
  }
}
