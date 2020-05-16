import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authService/auth.service';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customerService/customer.service';
import { RegisteredCustomer } from 'src/app/shared/registeredCustomer';
import { baseURL } from 'src/app/shared/baseurl';
import { Admin } from 'src/app/shared/admin';
import { AdminService } from 'src/app/services/adminService/admin.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  admin={
    firstName:'',
    lastName:'',
    email:'',
    password:''
  }
  users:RegisteredCustomer[];
  adminUsers:Admin[];
  usersErr:String;
  adminsErr:String;
  adminForm: FormGroup;
  userImageUrl:String = baseURL+'images/profilePictures/';
  adminFormErrors ={
    'firstName':'',
    'lastName':'',
    'email':'',
    'password':'',
    'rePassword':''
  };
  adminValidationMessages ={
    'firstName':{
      'required': 'First Name is Required',
      'pattern':'Allowed alphabetic characters only'
    },
    'lastName':{
      'required': 'Last Name is Required',
      'pattern':'Allowed alphabetic characters only'
    },
    'email':{
      'required': 'Email Address is Required',
      'email':'Email Address is not in valid format'
    },
    'password':{
      'required': 'Password is Required',
      'pattern': 'Must contain at least one number and one uppercase and lowercase letter, at least one special character and at least 6 or more characters without spaces'
    },
    'rePassword':{
      'required': 'Re-Password is Required',
      'pattern': 'Must contain at least one number and one uppercase and lowercase letter, at least one special character and at least 6 or more characters without spaces'
    }
  };
  constructor(
    private authService: AuthService,
    private router: Router,
    private customerService: CustomerService,
    private adminService: AdminService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.authService.loadUserCredentials();
    if(this.authService.isLoggedIn() === false){
      alert('You should log first.!');
      this.router.navigate(['login']);
    }
    this.createAdminForm();
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

  onAdminSubmit(){
    // console.log(typeof(this.categoryForm.value['image']));
    this.admin = this.adminForm.value;
    console.log(this.admin);
    
    
    
    
    
    // this.adminForm.reset({
    //   name:'',
    //   image:''
    // });
  }

  open(content, modalSize) {
    this.modalService.open(content, {size:modalSize});
  }
  
  createAdminForm(){
    this.adminForm =this.formBuilder.group({
      firstName:['',[Validators.required, Validators.pattern]],
      lastName:['',[Validators.required, Validators.pattern]],
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required, Validators.pattern]],
      rePassword:['',[Validators.required, Validators.pattern]],
    });
    this.adminForm.valueChanges.subscribe(data=>this.onValueChanged());
    this.onValueChanged(); //reset form validation messages
  }

  onValueChanged(){
    if(!this.adminForm){
      return;
    }
    const form =this.adminForm;
    for(const field in this.adminFormErrors){
      if(this.adminFormErrors.hasOwnProperty(field)){
        //clear previous error messsage(if any)
        this.adminFormErrors[field]='';
        const control = form.get(field);
        if(control && control.dirty && !control.valid){
          const messages =this.adminValidationMessages[field];
          for(const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.adminFormErrors[field]+=messages[key] +' ';
            }
          }
        }
      }
    }
  }

}
