import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { PaymentStatusComponent } from './pages/payment-status/payment-status.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'payment/status',
    component: PaymentStatusComponent
  },
  {
    path: 'cart/status',
    redirectTo: 'payment/status'
  },
  {
    path: 'admin',
    redirectTo: 'admin/crud',
    pathMatch: 'full'
  },
  {
    path: 'admin/crud',
    component: HomeComponent,
    canActivate: [authGuard],
    data: { tab: 'photos' }
  },
  {
    path: 'admin/photos',
    component: HomeComponent,
    canActivate: [authGuard],
    data: { tab: 'photos' }
  },
  {
    path: 'admin/albums',
    component: HomeComponent,
    canActivate: [authGuard],
    data: { tab: 'albums' }
  },
  {
    path: 'admin/services',
    component: HomeComponent,
    canActivate: [authGuard],
    data: { tab: 'services' }
  },
  {
    path: 'admin/profile',
    component: HomeComponent,
    canActivate: [authGuard],
    data: { tab: 'profile' }
  },
  {
    path: '**',
    redirectTo: ''
  }
];
