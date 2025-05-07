import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ProtectedComponent } from './protected/protected.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomeComponentModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginComponentModule)
  },
  {
    path: 're-login',
    loadChildren: () => import('./pages/re-auth/re-auth-routing.module').then(m => m.ReAuthComponentRoutingModule) 
  },
  {
    path: 'setup',
    loadChildren: () => import('./pages/setup/setup.module').then( m => m.SetupComponentModule),
  },
  {
    path: 'create-account',
    loadChildren: () => import('./pages/create-account/create-account.module').then(m => m.CreateAccountComponentModule)
  },
  {
    path: 'otp',
    loadChildren: () => import('./pages/otp/otp.module').then(m => m.OtpComponentModule)
  },
  {
    path: 'allow-notifications',
    loadComponent: () => import('./pages/allow-notifications/allow-notifications.component').then(m => m.AllowNotificationsComponent)
  },
  {
    path: 'allow-location',
    loadComponent: () => import('./pages/allow-location/allow-location.component').then(m => m.AllowLocationComponent)
  },
  {
    path: 'allow-tracking',
    loadComponent: () => import('./pages/allow-tracking/allow-tracking.component').then(m => m.AllowTrackingComponent)
  },
  { path: 'protected', component: ProtectedComponent },
  {
    path: 'chat/:uid',
    loadChildren: () => import('./pages/chat/chat.module').then( m => m.ChatComponentModule),
  },

  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
