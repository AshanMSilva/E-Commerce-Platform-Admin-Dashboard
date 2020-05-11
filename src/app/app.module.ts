import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { HeaderComponent } from './pages/header/header.component';
import { FooterComponent } from './pages/footer/footer.component';
import { LoginComponent } from './pages/login/login.component';
import { AccountComponent } from './pages/account/account.component';
import { CategoryComponent } from './pages/category/category.component';
import { ProductComponent } from './pages/product/product.component';
import { VarientComponent } from './pages/varient/varient.component';
import { OrderComponent } from './pages/order/order.component';
import { UserComponent } from './pages/user/user.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CategoriesComponent } from './pages/categories/categories.component';
import { UsersComponent } from './pages/users/users.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UploadService } from './services/uploadService/upload.service';
import { HttpClientModule } from '@angular/common/http';
import { CategoryService } from './services/categoryService/category.service';
import { baseURL } from './shared/baseurl';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    AccountComponent,
    CategoryComponent,
    ProductComponent,
    VarientComponent,
    OrderComponent,
    UserComponent,
    CategoriesComponent,
    UsersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    UploadService,
    CategoryService,
    {provide: 'BaseURL', useValue:baseURL}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
