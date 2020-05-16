import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authService/auth.service';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customerService/customer.service';
import { RegisteredCustomer } from 'src/app/shared/registeredCustomer';
import { baseURL } from 'src/app/shared/baseurl';
import { Admin } from 'src/app/shared/admin';
import { AdminService } from 'src/app/services/adminService/admin.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users:RegisteredCustomer[];
  adminUsers:Admin[];
  usersErr:String;
  adminsErr:String;
  userImageUrl:String = baseURL+'images/profilePictures/';
  constructor(
    private authService: AuthService,
    private router: Router,
    private customerService: CustomerService,
    private adminService: AdminService
  ) { }

  ngOnInit(): void {
    this.authService.loadUserCredentials();
    if(this.authService.isLoggedIn() === false){
      alert('You should log first.!');
      this.router.navigate(['login']);
    }
    this.customerService.getUsers().subscribe(users => this.users=users, err=> this.usersErr=err);
    this.adminService.getAdmins().subscribe(admins => this.adminUsers=admins, err => this.adminsErr=err);

  }

  deleteAdmin(id: number){
    this.adminService.deleteAdmin(id).subscribe(res =>{
      if(res){
        alert("Admin is successfully removed.!");
        this.adminService.getAdmins().subscribe(admins=> this.adminUsers=admins, err=> this.adminsErr=err);
        } 
    },err=>{
      alert("Something went wrong. Please try again..");
      console.log(err);
    });
  }

}
