import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authService/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerService } from 'src/app/services/customerService/customer.service';
import { RegisteredCustomer } from 'src/app/shared/registeredCustomer';
import { baseURL } from 'src/app/shared/baseurl';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  err:String;
  customer: RegisteredCustomer;
  customerId: any;
  productImageUrl:String = baseURL+'images/products/';
  constructor(
    private authService: AuthService,
    private router: Router,
    private customerService: CustomerService,
    private route: ActivatedRoute
  ) { }

  async ngOnInit(): Promise<void> {
    await this.authService.loadUserCredentials();
    if(this.authService.isLoggedIn() === false){
      alert('You should log first.!');
      this.router.navigate(['login']);
    }
    this.route.params.subscribe(params => {
      this.customerId = params['id'];
      this.customerService.getUserById(this.customerId).subscribe(customer =>{
        this.customer=customer;
        
      }, err => this.err =err);
    });
  }

}
