import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule, MatCardModule, MatCheckboxModule,
  MatIconModule,
  MatInputModule, MatProgressSpinnerModule, MatSelectModule,
  MatSidenavModule,
  MatTableModule,
  MatToolbarModule, MatTooltipModule,
  MatTreeModule
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BasicAuthInterceptor, ErrorInterceptor, fakeBackendProvider } from './_helpers';
import { UserService } from './_services';
import { AddUserComponent } from './add-user';

import { routing } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminPageComponent } from './admin-page';
import { LoginComponent } from './login';
import { UserPageComponent } from './user-page/user-page.component';
import { FlowsComponent } from './flows/flows.component';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    routing,
    BrowserAnimationsModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    FormsModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatTreeModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSelectModule
  ],
  declarations: [
    AppComponent,
    AdminPageComponent,
    LoginComponent,
    AddUserComponent,
    UserPageComponent,
    FlowsComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    UserService,
    // provider used to create fake backend
    fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
