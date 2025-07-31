import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { GuestGuard } from './core/guards/guest.guard';
import { GuestLayoutComponent } from './shared/layout/guest-layout.component/guest-layout.component';
import { AuthenticatedLayoutComponent } from './shared/layout/authenticated-layout.component/authenticated-layout.component';

// Pages
import { LoginPageComponent } from './domain/auth/pages/login-page.component/login-page.component'
import { RegisterPageComponent } from './domain/auth/pages/register-page.component/register-page.component';
import { DashboardPageComponent } from './domain/dashboard/pages/dashboard-page.component/dashboard-page.component';
import { ProfilePageComponent } from './domain/profile/pages/profile-page.component/profile-page.component';
import { RecoverPasswordPageComponent } from './domain/auth/pages/recover-password-page.component/recover-password-page.component';
import { ResetPasswordPageComponent } from './domain/auth/pages/reset-password-page.component/reset-password-page.component';

export const routes: Routes = [
  {
    path: '',
    component: GuestLayoutComponent,
    canActivate: [GuestGuard],
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginPageComponent },
      { path: 'register', component: RegisterPageComponent },
      { path: 'recover-password', component: RecoverPasswordPageComponent },
      { path: 'reset-password', component: ResetPasswordPageComponent },
    ]
  },
  {
    path: '',
    component: AuthenticatedLayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardPageComponent },
      { path: 'profile', component: ProfilePageComponent}
    ]
  },
  { path: '**', redirectTo: 'login' }
];