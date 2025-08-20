import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guard/auth.guard';
import { LoginGuard } from 'src/app/core/guard/login.guard';
import { AuthLayoutComponent } from 'src/app/layout/app-layout/auth-layout/auth-layout.component';
import { AdminMainLayoutComponent } from './admin-panel/components/admin-main-layout/admin-main-layout.component';
import { InternalUserMainLayoutComponent } from './internal-user-panel/components/internal-user-main-layout/internal-user-main-layout.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminMainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./admin-panel/admin-panel.module').then((m) => m.AdminPanelModule),
      }
    ],
  },
  {
    path: 'internal-user',
    component: InternalUserMainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./internal-user-panel/internal-user-panel.module').then((m) => m.InternalUserPanelModule),
      }
    ],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    canActivate: [LoginGuard],
    loadChildren: () =>
      import('./auth/auth.module').then(
        (m) => m.AuthModule
      ),
  },
  { path: '', redirectTo: 'admin', pathMatch: 'full' },
  { path: '**', redirectTo: '' },

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacilitatorRoutingModule { }
