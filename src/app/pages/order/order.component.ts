import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authService/auth.service';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/services/orderService/order.service';
import { Order } from 'src/app/shared/order';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  orders: Order[];
  err:String;
  constructor(
    private authService: AuthService,
    private router: Router,
    private orderService: OrderService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.authService.loadUserCredentials();
    if(this.authService.isLoggedIn() === false){
      alert('You should log first.!');
      this.router.navigate(['login']);
    }

    this.orderService.getOrders().subscribe(orders =>this.orders=orders, err=> this.err=err);
  }

}
