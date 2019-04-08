import { Routes, RouterModule } from '@angular/router';
import { AddUserComponent } from './add-user';

import { AdminPageComponent } from './admin-page';
import { FlowsComponent } from './flows/flows.component';
import { LoginComponent } from './login';
import { AuthGuard } from './_guards';
import { UserPageComponent } from './user-page/user-page.component';

const appRoutes: Routes = [
  { path: 'admin', component: AdminPageComponent, data: { roles: ['admin'] }, canActivate: [AuthGuard]},
  { path: 'add', component: AddUserComponent, data: { roles: ['admin'] }, canActivate: [AuthGuard] },
  { path: '', component: UserPageComponent, data: { roles: ['user'] }, canActivate: [AuthGuard],
    children: [
      { path: 'flows/:id', component: FlowsComponent }
    ]},
  { path: 'login', component: LoginComponent },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
