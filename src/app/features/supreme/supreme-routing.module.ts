import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guard/auth.guard';
import { LoginGuard } from 'src/app/core/guard/login.guard';
import { AuthLayoutComponent } from 'src/app/layout/app-layout/auth-layout/auth-layout.component';
import { SupremeMainLayoutComponent } from './components/supreme-main-layout/supreme-main-layout.component';
import { SupremeAuthGuardGuard } from 'src/app/core/guard/suprem-auth-guard.guard';

const routes: Routes = [
  {
    path: '',
    component: SupremeMainLayoutComponent,
    canActivate: [SupremeAuthGuardGuard],
    children: [
      { path: '', redirectTo: 'admin', pathMatch: 'full' },
      {
        path: 'admin',
        canActivate: [SupremeAuthGuardGuard],
        loadChildren: () =>
          import('./components/admin-panel/admin-panel.module').then((m) => m.AdminPanelModule),
      },
    ],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    canActivate: [LoginGuard],
    loadChildren: () =>
      import('./components/auth/auth.module').then(
        (m) => m.AuthModule
      ),
  },
  { path: '**', redirectTo: '' },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupremeRoutingModule { }
