import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authService/auth.service';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customerService/customer.service';
import { RegisteredCustomer } from 'src/app/shared/registeredCustomer';
import { baseURL } from 'src/app/shared/baseurl';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users:RegisteredCustomer[];
  err:String;
  userImageUrl:String = baseURL+'images/profilePictures/';
  constructor(
    private authService: AuthService,
    private router: Router,
    private customerService: CustomerService
  ) { }

  ngOnInit(): void {
    this.authService.loadUserCredentials();
    if(this.authService.isLoggedIn() === false){
      alert('You should log first.!');
      this.router.navigate(['login']);
    }
    this.customerService.getUsers().subscribe(users => this.users=users, err=> this.err=err);
  }

}
