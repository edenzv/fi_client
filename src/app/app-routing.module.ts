import { Routes, RouterModule } from '@angular/router';
import { AddUserComponent } from './add-user';

import { AdminPageComponent } from './admin-page';
import { FlowsComponent } from './flows/flows.component';
import { LoginComponent } from './login';
import { AuthGuard } from './_guards';
import { UserPageComponent } from './user-page/user-page.component';

// const appRoutes: Routes = [
//   { path: '',
//     component: AdminPageComponent,
//     canActivate: [AuthGuard],
//     children: [
//       { path: '', redirectTo: 'users', pathMatch: 'full',
//         children: [
//           { path: 'add',
//             redirectTo: 'add',
//             component: AddUserComponent,
//           }
//         ]
//       },
//       { path: 'users', component: AdminPageComponent },
//       // { path: 'training', component: TrainingComponent },
//       // { path: 'about', component: AboutComponent },
//       // { path: 'details/:id', component: FeedDetailsComponent },
//     ]
//   },
//   { path: 'login', component: LoginComponent },
//
//   // otherwise redirect to home
//   { path: '**', redirectTo: '' }
// ];

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

// const appRoutes: Routes = [
//   { path: '', component: AdminPageComponent, data: { roles: ['admin'] }, canActivate: [AuthGuard] },
//   { path: 'add', component: AddUserComponent, data: { roles: ['admin'] }, canActivate: [AuthGuard] },
//   { path: '', component: UserPageComponent, data: { roles: ['user'] }, canActivate: [AuthGuard] },
//   { path: 'login', component: LoginComponent },
//
//   // otherwise redirect to home
//   { path: '**', redirectTo: '' }
// ];

// const appRoutes: Routes = [
//   {
//     path: 'user',
//     canActivateChild: [AuthGuard],        // <-- This guard will run before the router directs you to the route
//     data: { roles : ['user'] },      // <-- Current Login in user must have role user.   You can access this array inside your guard.
//     children: [
//       // <-- The rest of your user routes
//     ]
//   },
//   {
//     path: 'admin',
//     canActivateChild: [AuthGuard],         // <-- This guard will run before the router directs you to the route
//     data: { roles : ['admin'] },      // <-- Current Login in user must have role admin
//     children: [
//       {
//         path: '',
//         redirectTo: '/admin/users',   // <-- Redirects to dashboard route below
//         pathMatch: 'full'
//       },
//       {
//         path: 'users',
//         component: AdminPageComponent,
//         pathMatch: 'full'
//       }
//       // <-- The rest of your admin routes
//     ]
//   },
//   { path: 'login', component: LoginComponent },
//   // otherwise redirect to home
//   { path: '**', redirectTo: '' }
// ];

// export const ROUTES: Routes = [
//   { path: '',
//     component: ArounseeNavComponent,
//     canActivate: [AuthGuard],
//     children: [
//       { path: '', redirectTo: 'home', pathMatch: 'full' },
//       { path: 'home', component: FeedListComponent },
//       { path: 'training', component: TrainingComponent },
//       { path: 'about', component: AboutComponent },
//       { path: 'details/:id', component: FeedDetailsComponent },
//     ]},
//   { path: 'login', component: LoginComponent },
//   { path: 'register', component: RegisterComponent },
//   { path: '**',    redirectTo: '' },
// ];

export const routing = RouterModule.forRoot(appRoutes);
