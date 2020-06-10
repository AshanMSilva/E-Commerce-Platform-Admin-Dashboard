import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/authService/auth.service';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { MailService } from 'src/app/services/mailService/mail.service';
import { AdminService } from 'src/app/services/adminService/admin.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Admin } from 'src/app/shared/admin';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm:FormGroup;
  randomValue: Number;
  admin: Admin;
  forgotEmail:string;
  forgotPasswordForm:FormGroup;
  randomCodeForm: FormGroup;
  changePasswordForm:FormGroup;
  forgotPasswordFormErrors ={
    'email':''
  };
  forgotPasswordValidationMessages ={
    'email':{
      'required': 'Email is required',
      'email': 'Not in Email type'
    }
  };
  randomCodeFormErrors ={
    'code':''
  };
  randomCodeValidationMessages ={
    'code':{
      'required': 'Code is required'
      
    }
  };
  changePasswordFormErrors ={
    'newPassword':'',
    'rePassword':''
  };
  changePasswordValidationMessages ={
    'newPassword':{
      'required': 'New Password is required',
      'pattern': 'Must contain at least one number and one uppercase and lowercase letter, at least one special character and at least 6 or more characters without spaces'
    },
    'rePassword':{
      'required': 'Confirm Password is required',
      'pattern': 'Must contain at least one number and one uppercase and lowercase letter, at least one special character and at least 6 or more characters without spaces'
    }
  };
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
    private snackBar: MatSnackBar,
    private mailService: MailService,
    private adminService: AdminService,
    private modalService: NgbModal
  ) { }

  async ngOnInit(): Promise<void> {
    this.createLoginForm();
    this.createChangePasswordForm();
    this.createForgotPasswordForm();
    this.createRandomCodeForm();
    await this.authService.loadUserCredentials();
    if(this.authService.isLoggedIn() === true){
      this.router.navigate(['home']);
    }
    
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
        alert(this.errMsg)
      });
      
    

  }
  open(content, modalSize) {
    this.modalService.open(content, {size:modalSize});
  }
  createForgotPasswordForm(){
    this.forgotPasswordForm =this.formBuilder.group({
      email:['',[Validators.required, Validators.email]]
      
      
    });
    this.forgotPasswordForm.valueChanges.subscribe(data=>this.onChangeForgotPasswordValueChanged());
    this.onChangeForgotPasswordValueChanged(); //reset form validation messages
  }

  onChangeForgotPasswordValueChanged(){
    if(!this.forgotPasswordForm){
      return;
    }
    const form =this.forgotPasswordForm;
    for(const field in this.forgotPasswordFormErrors){
      if(this.forgotPasswordFormErrors.hasOwnProperty(field)){
        //clear previous error messsage(if any)
        this.forgotPasswordFormErrors[field]='';
        const control = form.get(field);
        if(control && control.dirty && !control.valid){
          const messages =this.forgotPasswordValidationMessages[field];
          for(const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.forgotPasswordFormErrors[field]+=messages[key] +' ';
            }
          }
        }
      }
    }
  }
  onForgotPasswordSubmit(forgotPasswordContent, forgotPasswordModalSize, randomCodeContent, randModalSize){
    let mail = this.forgotPasswordForm.value['email'];
    this.forgotEmail = mail;
    this.adminService.getAdminByEmail(mail).subscribe(admins=>{
      if(admins){
        // console.log(admins);
        if(admins.length === 0){
          alert('There is no account in that email address. Please enter correct email address.');
          this.forgotPasswordForm.reset();
          this.open(forgotPasswordContent, forgotPasswordModalSize);
        }
        else{
          this.admin=admins[0];
          this.randomValue = this.getRandomIntInclusive(100000, 999999);
          let body ={
            email: mail,
            subject:'Reset Password Request',
            text:`Verification Code: ${this.randomValue}. Please use the given code to verify your email address`
          }
          this.mailService.sendMail(body).subscribe(res=>{
            if(res){
              if(res===true){
                alert('Verification Code is sent to Your Email Address. Please Check your Mail Box..');
                this.open(randomCodeContent, randModalSize);
             }
              else{
                alert('Something went wrong. Please try again later.');
                this.open(forgotPasswordContent, forgotPasswordModalSize);
              }
           }
          })
        }
        


      }
      
    },
    err=>{
      if(err){
        alert(err);
        this.forgotPasswordForm.reset();
        this.open(forgotPasswordContent, forgotPasswordModalSize);
      }
    })

  }
  createChangePasswordForm(){
    this.changePasswordForm =this.formBuilder.group({
      newPassword:['',[Validators.required, Validators.pattern]],
      rePassword:['',[Validators.required, Validators.pattern]]
      
      
    });
    this.changePasswordForm.valueChanges.subscribe(data=>this.onChangePasswordValueChanged());
    this.onChangePasswordValueChanged(); //reset form validation messages
  }

  onChangePasswordValueChanged(){
    if(!this.changePasswordForm){
      return;
    }
    const form =this.changePasswordForm;
    for(const field in this.changePasswordFormErrors){
      if(this.changePasswordFormErrors.hasOwnProperty(field)){
        //clear previous error messsage(if any)
        this.changePasswordFormErrors[field]='';
        const control = form.get(field);
        if(control && control.dirty && !control.valid){
          const messages =this.changePasswordValidationMessages[field];
          for(const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.changePasswordFormErrors[field]+=messages[key] +' ';
            }
          }
        }
      }
    }
  }
  onChangePasswordSubmit(content, modalSize){
    let newPassword = this.changePasswordForm.value['newPassword'];
    let rePassword = this.changePasswordForm.value['rePassword'];
    if(newPassword === rePassword){
      let body={
        password:newPassword
      }
      this.adminService.forgotPassword(this.admin._id,body).subscribe(res=>{
        if(res){
          if(res.success===true){
            this.changePasswordForm.reset();
            alert(res.message);
            this.authService.logOut();
            this.router.navigate(['login']);
          }
          else{
            alert(res.message);
            this.open(content, modalSize);

          }
        }
      },  err =>{
        if(err){
          alert(err);
        }
      })
    }
    else{
      alert('New password and Confirm Password should be same..!');
      this.open(content,modalSize);
    }
  }
  createRandomCodeForm(){
    this.randomCodeForm =this.formBuilder.group({
      code:['',[Validators.required]]
      
      
    });
    this.randomCodeForm.valueChanges.subscribe(data=>this.onChangeRandomCodeValueChanged());
    this.onChangeRandomCodeValueChanged(); //reset form validation messages
  }

  onChangeRandomCodeValueChanged(){
    if(!this.randomCodeForm){
      return;
    }
    const form =this.randomCodeForm;
    for(const field in this.randomCodeFormErrors){
      if(this.randomCodeFormErrors.hasOwnProperty(field)){
        //clear previous error messsage(if any)
        this.randomCodeFormErrors[field]='';
        const control = form.get(field);
        if(control && control.dirty && !control.valid){
          const messages =this.randomCodeValidationMessages[field];
          for(const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.randomCodeFormErrors[field]+=messages[key] +' ';
            }
          }
        }
      }
    }
  }
  onRandomCodeSubmit(changePasswordContent, changePasswordModalSize, randomCodeContent, randModalSize){
    let rand = this.randomCodeForm.value['code'];
    if(this.randomValue.toString()=== rand){
      this.randomCodeForm.reset();
      this.open(changePasswordContent, changePasswordModalSize);
    }
    else{
      alert('Your Entered Code is Incorrect. Please enter correct code or Click resend to send Code again..');
      this.randomCodeForm.reset();
      this.open(randomCodeContent, randModalSize);
    }

  }
  getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
  }
  reSendCode(randomCodeContent, randModalSize){
    this.randomValue = this.getRandomIntInclusive(100000, 999999);
        let body ={
          email: this.forgotEmail,
          subject:'Reset Password Request',
          text:`Verification Code: ${this.randomValue}. Please use the given code to verify your email address`
        }
        this.mailService.sendMail(body).subscribe(res=>{
          if(res){
            if(res===true){
              alert('Verification Code is sent to Your Email Address. Please Check your Mail Box..');
              this.randomCodeForm.reset();
              this.open(randomCodeContent, randModalSize);
            }
            else{
              alert('Something went wrong. Please try again later.');
              this.randomCodeForm.reset();
              this.open(randomCodeContent, randModalSize);
            }
          }
        })
  }

  

}
