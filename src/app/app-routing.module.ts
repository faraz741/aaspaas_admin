import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsersComponent } from './pages/users/users.component';
import { TemplatesComponent } from './pages/templates/templates.component';
import { LoginComponent } from './landing/login/login.component';
import { AdvertisementComponent } from './pages/advertisement/advertisement.component';
import { BannersComponent } from './pages/banners/banners.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'main', component: MainComponent,
    children: [
      {
        path: 'dashboard', component: DashboardComponent
      },
      {
        path: 'users', component: UsersComponent
      },
      {
        path: 'templates', component: TemplatesComponent
      },
      {
        path: 'advertisement', component: AdvertisementComponent
      },
      {
        path: 'banners', component: BannersComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
