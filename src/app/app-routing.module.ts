import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsersComponent } from './pages/users/users.component';
import { TemplatesComponent } from './pages/templates/templates.component';
import { LoginComponent } from './landing/login/login.component';
import { AdvertisementComponent } from './pages/advertisement/advertisement.component';
import { BannersComponent } from './pages/banners/banners.component';
import { ItemsComponent } from './pages/items/items.component';
import { AllItemsComponent } from './pages/all-items/all-items.component';
import { ShopsComponent } from './pages/shops/shops.component';
import { ShopsImagesComponent } from './pages/shops/shops-images/shops-images.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'main'
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'main', component: MainComponent,
    children: [
      {
        path: '', component: DashboardComponent
      },
      {
        path: 'users', component: UsersComponent
      },
      {
        path: 'category', component: TemplatesComponent
      },
      {
        path: 'items', component: AllItemsComponent
      },
      {
        path: 'shops', component: ShopsComponent
      },
      {
        path: 'shopImages', component: ShopsImagesComponent
      },
      {
        path: 'advertisement', component: AdvertisementComponent
      },
      {
        path: 'banners', component: BannersComponent
      },
      {
        path: 'items/:id/:name', component: ItemsComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
