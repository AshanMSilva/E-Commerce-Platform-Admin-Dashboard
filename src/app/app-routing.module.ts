import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { AccountComponent } from './pages/account/account.component';
import { OrderComponent } from './pages/order/order.component';
import { UserComponent } from './pages/user/user.component';
import { ProductComponent } from './pages/product/product.component';
import { CategoryComponent } from './pages/category/category.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { VarientComponent } from './pages/varient/varient.component';
import { UsersComponent } from './pages/users/users.component';


const routes: Routes = [
  {path: 'home', component:HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'account', component: AccountComponent},
  {path: 'categories', component: CategoriesComponent},
  {path: 'category/:id', component: CategoryComponent},
  {path: 'product', component: VarientComponent},
  {path: 'products', component: ProductComponent},
  {path: 'users', component: UsersComponent},
  {path: 'user', component: UserComponent},
  {path: 'orders', component: OrderComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
