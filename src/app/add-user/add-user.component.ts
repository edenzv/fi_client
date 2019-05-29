import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

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
  editMode = false;
  roles: any[] = [
    { value: 'user', viewValue: 'User' },
    { value: 'generator', viewValue: 'Generator' }
  ];
  selectedRole: string;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (!params || !params.userName) {
        this.registerForm = this.formBuilder.group({
          userName: ['', Validators.required],
          password: ['', Validators.required],
          role: ['', Validators.required],
          firstName: ['', Validators.required],
          lastName: ['', Validators.required]
        });
      } else {
        this.editMode = true;
        this.registerForm = this.formBuilder.group({
          userName: [{
            value: params.userName,
            disabled: true
          }],
          password: [params.password, Validators.required],
          role: [params.role, Validators.required],
          firstName: [params.firstName, Validators.required],
          lastName: [params.lastName, Validators.required]
        });
      }
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
      role: this.f.role.value,
    };
    if (this.editMode) {
      this.userService.update(this.model)
        .subscribe(
          (data) => {
            // this.alertService.success('Registration successful', true);
            this.router.navigate(['/admin']);
          },
          (error) => {
            console.error(error);
            this.loading = false;
          });
    } else {
      this.userService.create(this.model)
        .subscribe(
          (data) => {
            // this.alertService.success('Registration successful', true);
            this.router.navigate(['/admin']);
          },
          (error) => {
            console.error(error);
            this.loading = false;
          });
    }
  }

  public get submitButtonName() {
    return this.editMode ? 'Update' : 'Add User';
  }
}
