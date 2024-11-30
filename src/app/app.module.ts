import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HeaderComponent } from './layout/header/header.component';
import { MainComponent } from './pages/main/main.component';
import { UsersComponent } from './pages/users/users.component';
import { TemplatesComponent } from './pages/templates/templates.component';
import { LoginComponent } from './landing/login/login.component';
import { AdvertisementComponent } from './pages/advertisement/advertisement.component';
import { BannersComponent } from './pages/banners/banners.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HeadersInterceptor } from './services/interceptor/headers.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule} from '@angular/fire/compat';
import { AngularFireStorageModule} from '@angular/fire/compat/storage';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { AnimateModule } from 'primeng/animate';
import { ItemsComponent } from './pages/items/items.component';
import { AllItemsComponent } from './pages/all-items/all-items.component';
import { ShopsComponent } from './pages/shops/shops.component';
import { CacheInterceptor } from './cache.interceptor';

import {ToastModule} from 'primeng/toast';
import {CalendarModule} from 'primeng/calendar';
import {SliderModule} from 'primeng/slider';

import {ContextMenuModule} from 'primeng/contextmenu';
import {DialogModule} from 'primeng/dialog';
import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {ProgressBarModule} from 'primeng/progressbar';
import {InputTextModule} from 'primeng/inputtext';
import { environment } from 'src/environments/environment.development';
import { ShopsImagesComponent } from './pages/shops/shops-images/shops-images.component';
import {FileUploadModule} from 'primeng/fileupload';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { MessageService } from 'primeng/api';
import { KarigarComponent } from './pages/karigar/karigar.component'; // PrimeNG MessageService
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SidebarComponent,
    HeaderComponent,
    MainComponent,
    UsersComponent,
    TemplatesComponent,
    LoginComponent,
    AdvertisementComponent,
    BannersComponent,
    ItemsComponent,
    AllItemsComponent,
    ShopsComponent,
    ShopsImagesComponent,
    KarigarComponent

  ],
  imports: [
    BrowserModule,
    TableModule,
    AppRoutingModule,  
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    ContextMenuModule,
    ToastrModule.forRoot(), 
    BrowserAnimationsModule,
    MultiSelectModule,
    ToastModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    FileUploadModule,
    AgGridAngular
  ],
  providers:[MessageService,
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
