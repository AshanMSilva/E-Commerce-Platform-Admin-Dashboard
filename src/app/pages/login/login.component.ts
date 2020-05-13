import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/authService/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm:FormGroup;
  user={
    email:'',
    password:''
  }
  errMsg: String;
  isLoggedIn: Boolean;
  loginFormErrors ={
    'email':'',
    'password':''
  };
  loginValidationMessages ={
    'email':{
      'required': 'Email Address is required',
      'email':'Emai Address is not in valid format'
    },
    'password':{
      'required': 'password is required'
    }
  };

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private zone:NgZone,
  ) { }

  ngOnInit(): void {
    this.authService.loadUserCredentials();
    if(this.authService.isLoggedIn() === true){
      this.router.navigate(['home']);
    }
    this.createLoginForm();
  }

  createLoginForm(){
    this.loginForm =this.formBuilder.group({
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required]]
    });
    this.loginForm.valueChanges.subscribe(data=>this.onValueChanged());
    this.onValueChanged(); //reset form validation messages
  }

  onValueChanged(){
    if(!this.loginForm){
      return;
    }
    const form =this.loginForm;
    for(const field in this.loginFormErrors){
      if(this.loginFormErrors.hasOwnProperty(field)){
        //clear previous error messsage(if any)
        this.loginFormErrors[field]='';
        const control = form.get(field);
        if(control && control.dirty && !control.valid){
          const messages =this.loginValidationMessages[field];
          for(const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.loginFormErrors[field]+=messages[key] +' ';
            }
          }
        }
      }
    }
  }
  onLoginSubmit(){
    console.log(this.loginForm.value);
    this.user.email = this.loginForm.value['email'];
    this.user.password = this.loginForm.value['password'];
    this.authService.logIn(this.user)
      .subscribe(res => {
        if (res.success) {
          this.zone.run(() => this.router.navigate(['home', {alert: 'Succesfully logged In'}]));
        } else {
          console.log(res);
        }
      },
      error => {
        console.log(error);
        this.errMsg = error;
      });
      
    

  }

}
