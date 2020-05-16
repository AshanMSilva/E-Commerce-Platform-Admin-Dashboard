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
import { Order } from 'src/app/shared/order';
import { OrderService } from 'src/app/services/orderService/order.service';
import { Time } from '@angular/common';
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
  orders:Order[];
  orderErr:String;
  days=['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  months=['Jan','Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  ordersCountByDay =[];
  salesByMonth =[];
  usersByMonth=[];
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private productService: ProductService,
    private customerService: CustomerService,
    private orderService: OrderService
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

        let monthOne =new Date(Date.now());
        let monthOneUsers= 0;
        let monthTwo = this.getPreviousMonth(monthOne);
        let monthTwoUsers= 0;
        let monthThree =this.getPreviousMonth(monthTwo);
        let monthThreeUsers= 0;
        let monthFour =this.getPreviousMonth(monthThree);
        let monthFourUsers= 0;
        let monthFive =this.getPreviousMonth(monthFour);
        let monthFiveUsers= 0;
        let monthSix =this.getPreviousMonth(monthFive);
        let monthSixUsers= 0;
        let monthSeven =this.getPreviousMonth(monthSix);
        let monthSevenUsers= 0;
        let monthEight =this.getPreviousMonth(monthSeven);
        let monthEightUsers= 0;
        let monthNine =this.getPreviousMonth(monthEight);
        let monthNineUsers= 0;
        let monthTen =this.getPreviousMonth(monthNine);
        let monthTenUsers= 0;
        let monthEleven =this.getPreviousMonth(monthTen);
        let monthElevenUsers= 0;
        let monthTwelve =this.getPreviousMonth(monthEleven);
        let monthTwelveUsers= 0;
        let reverseUsers = users.reverse();
        for (let k = 0; k < reverseUsers.length; k++) {
          let user = reverseUsers[k];
          let registeredDate = new Date(user.createdAt);
          if(registeredDate.getMonth()<monthTwelve.getMonth() && registeredDate.getFullYear()<=monthTwelve.getFullYear()){
            break;
          }
          if(registeredDate.getMonth()===monthOne.getMonth() && registeredDate.getFullYear()=== monthOne.getFullYear()){
            monthOneUsers+=1;
          }
          if(registeredDate.getMonth()===monthTwo.getMonth() && registeredDate.getFullYear()=== monthTwo.getFullYear()){
            monthTwoUsers+=1;
          }
          if(registeredDate.getMonth()===monthThree.getMonth() && registeredDate.getFullYear()=== monthThree.getFullYear()){
            monthThreeUsers+=1;
          }
          if(registeredDate.getMonth()===monthFour.getMonth() && registeredDate.getFullYear()=== monthFour.getFullYear()){
            monthFourUsers+=1;
          }
          if(registeredDate.getMonth()===monthFive.getMonth() && registeredDate.getFullYear()=== monthFive.getFullYear()){
            monthFiveUsers+=1;
          }
          if(registeredDate.getMonth()===monthSix.getMonth() && registeredDate.getFullYear()=== monthSix.getFullYear()){
            monthSixUsers+=1;
          }
          if(registeredDate.getMonth()===monthSeven.getMonth() && registeredDate.getFullYear()=== monthSeven.getFullYear()){
            monthSevenUsers+=1;
          }
          if(registeredDate.getMonth()===monthEight.getMonth() && registeredDate.getFullYear()=== monthEight.getFullYear()){
            monthEightUsers+=1;
          }
          if(registeredDate.getMonth()===monthNine.getMonth() && registeredDate.getFullYear()=== monthNine.getFullYear()){
            monthNineUsers+=1;
          }
          if(registeredDate.getMonth()===monthTen.getMonth() && registeredDate.getFullYear()=== monthTen.getFullYear()){
            monthTenUsers+=1;
          }
          if(registeredDate.getMonth()===monthEleven.getMonth() && registeredDate.getFullYear()=== monthEleven.getFullYear()){
            monthElevenUsers+=1;
          }
          if(registeredDate.getMonth()===monthTwelve.getMonth() && registeredDate.getFullYear()=== monthTwelve.getFullYear()){
            monthTwelveUsers+=1;
          }
        }
        this.usersByMonth=[
          {y:monthTwelveUsers, label:this.months[monthTwelve.getMonth()]+' '+monthTwelve.getFullYear()},
          {y:monthElevenUsers, label:this.months[monthEleven.getMonth()]+' '+monthEleven.getFullYear()},
          {y:monthTenUsers, label:this.months[monthTen.getMonth()]+' '+monthTen.getFullYear()},
          {y:monthNineUsers, label:this.months[monthNine.getMonth()]+' '+monthNine.getFullYear()},
          {y:monthEightUsers, label:this.months[monthEight.getMonth()]+' '+monthEight.getFullYear()},
          {y:monthSevenUsers, label:this.months[monthSeven.getMonth()]+' '+monthSeven.getFullYear()},
          {y:monthSixUsers, label:this.months[monthSix.getMonth()]+' '+monthSix.getFullYear()},
          {y:monthFiveUsers, label:this.months[monthFive.getMonth()]+' '+monthFive.getFullYear()},
          {y:monthFourUsers, label:this.months[monthFour.getMonth()]+' '+monthFour.getFullYear()},
          {y:monthThreeUsers, label:this.months[monthThree.getMonth()]+' '+monthThree.getFullYear()},
          {y:monthTwoUsers, label:this.months[monthTwo.getMonth()]+' '+monthTwo.getFullYear()},
          {y:monthOneUsers, label:this.months[monthOne.getMonth()]+' '+monthOne.getUTCFullYear()}
        ];
        let usersChart = new CanvasJS.Chart("users", {
          animationEnabled: true,
          exportEnabled: true,
          title: {
            text: "Users"
          },
          data: [{
            type: "spline",
            dataPoints: this.usersByMonth
          }]
        });
        usersChart.render();

      }
      
    }, err=> this.userErr=err);

    this.orderService.getOrders().subscribe(orders=>{
      if(orders){
        this.orders = orders.reverse();
        let first = new Date(Date.now());
        let firstCount = 0;
        let second = this.getPreviousDate(first);
        let secondCount = 0;
        let third = this.getPreviousDate(second);
        let thirdCount = 0;
        let fourth = this.getPreviousDate(third);
        let fourthCount = 0;
        let fifth = this.getPreviousDate(fourth);
        let fifthCount = 0;
        let sixth = this.getPreviousDate(fifth);
        let sixthCount = 0;
        let seventh = this.getPreviousDate(sixth);
        let seventhCount = 0;

        let monthOne =new Date(Date.now());
        let monthOneSales= 0;
        let monthTwo = this.getPreviousMonth(monthOne);
        let monthTwoSales= 0;
        let monthThree =this.getPreviousMonth(monthTwo);
        let monthThreeSales= 0;
        let monthFour =this.getPreviousMonth(monthThree);
        let monthFourSales= 0;
        let monthFive =this.getPreviousMonth(monthFour);
        let monthFiveSales= 0;
        let monthSix =this.getPreviousMonth(monthFive);
        let monthSixSales= 0;
        let monthSeven =this.getPreviousMonth(monthSix);
        let monthSevenSales= 0;
        let monthEight =this.getPreviousMonth(monthSeven);
        let monthEightSales= 0;
        let monthNine =this.getPreviousMonth(monthEight);
        let monthNineSales= 0;
        let monthTen =this.getPreviousMonth(monthNine);
        let monthTenSales= 0;
        let monthEleven =this.getPreviousMonth(monthTen);
        let monthElevenSales= 0;
        let monthTwelve =this.getPreviousMonth(monthEleven);
        let monthTwelveSales= 0;
        // console.log(this.getPreviousMonth(first));
        // console.log(second);
        // console.log(third>fourth);
        // console.log(fourth);
        // console.log(fifth);
        // console.log(monthTwelve);
        // console.log(seventh);
        for (let j = 0; j < this.orders.length; j++) {
          let order = this.orders[j];
          let orderDate = new Date(order.orderedDate);
          if(orderDate.getMonth()<monthTwelve.getMonth() && orderDate.getFullYear()<=monthTwelve.getFullYear()){
            break;
          }
          if(orderDate.getMonth()===monthOne.getMonth() && orderDate.getFullYear()=== monthOne.getFullYear()){
            monthOneSales+=order.cost;
          }
          if(orderDate.getMonth()===monthTwo.getMonth() && orderDate.getFullYear()=== monthTwo.getFullYear()){
            monthTwoSales+=order.cost;
          }
          if(orderDate.getMonth()===monthThree.getMonth() && orderDate.getFullYear()=== monthThree.getFullYear()){
            monthThreeSales+=order.cost;
          }
          if(orderDate.getMonth()===monthFour.getMonth() && orderDate.getFullYear()=== monthFour.getFullYear()){
            monthFourSales+=order.cost;
          }
          if(orderDate.getMonth()===monthFive.getMonth() && orderDate.getFullYear()=== monthFive.getFullYear()){
            monthFiveSales+=order.cost;
          }
          if(orderDate.getMonth()===monthSix.getMonth() && orderDate.getFullYear()=== monthSix.getFullYear()){
            monthSixSales+=order.cost;
          }
          if(orderDate.getMonth()===monthSeven.getMonth() && orderDate.getFullYear()=== monthSeven.getFullYear()){
            monthSevenSales+=order.cost;
          }
          if(orderDate.getMonth()===monthEight.getMonth() && orderDate.getFullYear()=== monthEight.getFullYear()){
            monthEightSales+=order.cost;
          }
          if(orderDate.getMonth()===monthNine.getMonth() && orderDate.getFullYear()=== monthNine.getFullYear()){
            monthNineSales+=order.cost;
          }
          if(orderDate.getMonth()===monthTen.getMonth() && orderDate.getFullYear()=== monthTen.getFullYear()){
            monthTenSales+=order.cost;
          }
          if(orderDate.getMonth()===monthEleven.getMonth() && orderDate.getFullYear()=== monthEleven.getFullYear()){
            monthElevenSales+=order.cost;
          }
          if(orderDate.getMonth()===monthTwelve.getMonth() && orderDate.getFullYear()=== monthTwelve.getFullYear()){
            monthTwelveSales+=order.cost;
          }
          
        }
        // console.log(this.months[monthOne.getMonth()]+' '+monthOne.getFullYear());
        this.salesByMonth=[
          {y:monthTwelveSales, label:this.months[monthTwelve.getMonth()]+' '+monthTwelve.getFullYear()},
          {y:monthElevenSales, label:this.months[monthEleven.getMonth()]+' '+monthEleven.getFullYear()},
          {y:monthTenSales, label:this.months[monthTen.getMonth()]+' '+monthTen.getFullYear()},
          {y:monthNineSales, label:this.months[monthNine.getMonth()]+' '+monthNine.getFullYear()},
          {y:monthEightSales, label:this.months[monthEight.getMonth()]+' '+monthEight.getFullYear()},
          {y:monthSevenSales, label:this.months[monthSeven.getMonth()]+' '+monthSeven.getFullYear()},
          {y:monthSixSales, label:this.months[monthSix.getMonth()]+' '+monthSix.getFullYear()},
          {y:monthFiveSales, label:this.months[monthFive.getMonth()]+' '+monthFive.getFullYear()},
          {y:monthFourSales, label:this.months[monthFour.getMonth()]+' '+monthFour.getFullYear()},
          {y:monthThreeSales, label:this.months[monthThree.getMonth()]+' '+monthThree.getFullYear()},
          {y:monthTwoSales, label:this.months[monthTwo.getMonth()]+' '+monthTwo.getFullYear()},
          {y:monthOneSales, label:this.months[monthOne.getMonth()]+' '+monthOne.getUTCFullYear()}
        ];
        let salesChart = new CanvasJS.Chart("sales", {
          animationEnabled: true,
          exportEnabled: true,
          title: {
            text: "Sales Value"
          },
          data: [{
            type: "spline",
            dataPoints: this.salesByMonth
          }]
        });
        salesChart.render();

        for (let i = 0; i < this.orders.length; i++) {
          let order = this.orders[i];
          let orderDate = new Date(order.orderedDate);
          if(orderDate<seventh){
            break;
          }
          if(orderDate===first){
            firstCount+=1;
          }
          if(orderDate===second){
            secondCount+=1;
          }
          if(orderDate===third){
            thirdCount+=1;
          }
          if(orderDate===fourth){
            fourthCount+=1;
          }
          if(orderDate===fifth){
            fifthCount+=1;
          }
          if(orderDate===sixth){
            sixthCount+=1;
          }
          if(orderDate===seventh){
            seventhCount+=1;
          }
        }
        this.ordersCountByDay=[
          {y:seventhCount, label:this.days[seventh.getUTCDay()]},
          {y:sixthCount, label:this.days[sixth.getUTCDay()]},
          {y:fifthCount, label:this.days[fifth.getUTCDay()]},
          {y:fourthCount, label:this.days[fourth.getUTCDay()]},
          {y:thirdCount, label:this.days[third.getUTCDay()]},
          {y:secondCount, label:this.days[second.getUTCDay()]},
          {y:firstCount, label:this.days[first.getUTCDay()]}
        ];
        let ordersChart = new CanvasJS.Chart("orders", {
          animationEnabled: true,
          exportEnabled: true,
          title: {
            text: "Orders"
          },
          data: [{
            type: "column",
            dataPoints: this.ordersCountByDay
          }]
        });
        ordersChart.render();

      }

    });
    
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
  getPreviousDate(date: Date){
    let d = new Date();
    return new Date(d.setDate(date.getDate()-1));
  }
  getPreviousMonth(date: Date){
    let d = new Date();
    let nm =date.getMonth()-1;
    let year =date.getFullYear();
    // console.log(year);
    if(nm<0){
      nm+=12;
      year = year-1;
    }
    let z= new Date(d.setMonth(nm));
    return new Date(z.setFullYear(year));
  }

}
