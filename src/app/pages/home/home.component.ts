import { Component, OnInit } from '@angular/core';
import * as CanvasJS from '../../../assets/canvasjs.min'
import { AuthService } from 'src/app/services/authService/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { CategoryService } from 'src/app/services/categoryService/category.service';
import { ProductService } from 'src/app/services/productService/product.service';
import { CustomerService } from 'src/app/services/customerService/customer.service';
import { Category } from 'src/app/shared/category';
import { Product } from 'src/app/shared/product';
import { RegisteredCustomer } from 'src/app/shared/registeredCustomer';
import { baseURL } from 'src/app/shared/baseurl';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  alert: String = null;
  hasAlert:Boolean = false;
  topCategory:Category;
  categoryErr:String;
  categoryHighestSales:Number=0;
  productHighestSales:Number=0;
  highestOrders:Number=0;
  topProduct: Product;
  productErr:String;
  topUser: RegisteredCustomer;
  userErr:String;
  categoryImageUrl:String = baseURL+'images/categories/';
  productImageUrl:String = baseURL+'images/products/';
  userImageUrl:String = baseURL+'images/profilePictures/';
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private productService: ProductService,
    private customerService: CustomerService
  ) { }

  ngOnInit(): void {
    this.authService.loadUserCredentials();
    if(this.authService.isLoggedIn() === false){
      alert('You should log first.!');
      this.router.navigate(['login']);
    }
    this.alert =this.route.snapshot.paramMap.get('alert');
      if(this.alert!= null){
        alert(this.alert);
      }

    this.categoryService.getCategories().subscribe(categories =>{
      if(categories){
        this.categoryHighestSales=0;
        categories.forEach(category => {
          category.sales = this.getSalesCount(category)
          if(this.categoryHighestSales <= category.sales){
            this.topCategory=category;
            this.categoryHighestSales= category.sales;
          }
        });
      }
    }, err =>this.categoryErr=err);
    this.productService.getProducts().subscribe(products =>{
      if(products){
        this.productHighestSales=0
        products.forEach(product => {
          if(this.productHighestSales<= product.sales){
            this.topProduct = product;
            this.productHighestSales=product.sales;
          }
        });
      }
    }, err =>this.productErr=err);

    this.customerService.getUsers().subscribe(users =>{
      if(users){
        this.highestOrders =0;
        users.forEach(user => {
          if(this.highestOrders<=user.orders.length){
            this.topUser=user;
            this.highestOrders=user.orders.length;
          }
        });
      }
    }, err=> this.userErr=err);

    
    
    let salesChart = new CanvasJS.Chart("sales", {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: "Sales Value"
      },
      data: [{
        type: "spline",
        dataPoints: [
          { y: 71, label: "Jan" },
          { y: 55, label: "Feb" },
          { y: 50, label: "Mar" },
          { y: 65, label: "Apr" },
          { y: 95, label: "May" },
          { y: 68, label: "Jun" },
          { y: 28, label: "Jul" },
          { y: 34, label: "Aug" },
          { y: 14, label: "Sep" },
          { y: 30, label: "Oct" },
          { y: 22, label: "Nov" },
          { y: 17, label: "Dec" },
        ]
      }]
    });
    let ordersChart = new CanvasJS.Chart("orders", {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: "Orders"
      },
      data: [{
        type: "column",
        dataPoints: [
          { y: 71, label: "Mon" },
          { y: 55, label: "Tue" },
          { y: 50, label: "Wed" },
          { y: 65, label: "Thu" },
          { y: 95, label: "Fri" },
          { y: 68, label: "Sat" },
          { y: 28, label: "Sun" }
        ]
      }]
    });
    let usersChart = new CanvasJS.Chart("users", {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: "Users"
      },
      data: [{
        type: "spline",
        dataPoints: [
          { y: 71, label: "Jan" },
          { y: 55, label: "Feb" },
          { y: 50, label: "Mar" },
          { y: 65, label: "Apr" },
          { y: 95, label: "May" },
          { y: 68, label: "Jun" },
          { y: 28, label: "Jul" },
          { y: 34, label: "Aug" },
          { y: 14, label: "Sep" },
          { y: 30, label: "Oct" },
          { y: 22, label: "Nov" },
          { y: 17, label: "Dec" }
        ]
      }]
    });

      
    salesChart.render();
    ordersChart.render();
    usersChart.render();
  }
  closeAlert(){
    this.alert = null;
    this.hasAlert = false;
  }
  getSalesCount(category:Category){
    let sales = 0;
    category.products.forEach(product => {
      sales+= product.sales;
    });
    return sales
  }

}
