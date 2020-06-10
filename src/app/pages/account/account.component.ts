import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authService/auth.service';
import { Router } from '@angular/router';
import { baseURL } from 'src/app/shared/baseurl';
import { Admin } from 'src/app/shared/admin';
import { AdminService } from 'src/app/services/adminService/admin.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UploadService } from 'src/app/services/uploadService/upload.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  userImageUrl:String = baseURL+'images/profilePictures/';
  admin: Admin =null;
  adminEmail: String;
  emailErr: String;
  err:String;
  changePhotoForm: FormGroup;
  changeNameForm: FormGroup;
  changeEmailForm: FormGroup;
  changePasswordForm: FormGroup;
  changePhotoFormErrors ={
    'image':''
  };
  changePhotoValidationMessages ={
    'image':{
      'required': 'Product Photo is required',
    }
  };
  changeNameFormErrors ={
    'firstName':'',
    'lastName':''
  };
  changeNameValidationMessages ={
    'firstName':{
      'required': 'First Name is required',
    },
    'lastName':{
      'required': 'Last Name is required',
    }
  };
  changeEmailFormErrors ={
    'email':''
  };
  changeEmailValidationMessages ={
    'email':{
      'required': 'Email is required',
      'email': 'Not in Email type'
    }
  };
  changePasswordFormErrors ={
    'currentPassword':'',
    'newPassword':'',
    'newRePassword':''
  };
  changePasswordValidationMessages ={
    'currentPassword':{
      'required': 'Current Password is required'
    },
    'newPassword':{
      'required': 'New Password is required',
      'pattern': 'Must contain at least one number and one uppercase and lowercase letter, at least one special character and at least 6 or more characters without spaces'
    },
    'newRePassword':{
      'required': 'Confirm Password is required',
      'pattern': 'Must contain at least one number and one uppercase and lowercase letter, at least one special character and at least 6 or more characters without spaces'
    }
  };
  image;
  constructor(
    private authService: AuthService,
    private router: Router,
    private adminService: AdminService,
    private modalService: NgbModal,
    private uploadService: UploadService,
    private formBuilder: FormBuilder
  ) { }

  async ngOnInit(): Promise<void> {
    await this.authService.loadUserCredentials();
    if(this.authService.isLoggedIn() === false){
      alert('You should log first.!');
      this.router.navigate(['login']);
    }
    this.createChangePhotoForm();
    this.createChangeNameForm();
    this.createChangeEmailForm();
    this.createChangePasswordForm();
    this.authService.getEmail().subscribe(email =>{
      this.adminEmail=email;
      this.adminService.getAdmins().subscribe(admins =>{
        if(admins){
          for (let i = 0; i < admins.length; i++) {
            let admin = admins[i];
            if(admin.email === this.adminEmail){
              this.admin=admin;
              break;
            }
            
          }
          if(this.admin===null){
            alert('Something went Wrong. Please Log first');
            this.router.navigate(['login']);
          }
        }
      }, err=> this.err=err);
    }, err => this.emailErr=err);


  }
  open(content, modalSize) {
    this.modalService.open(content, {size:modalSize});
  }
  
  createChangePhotoForm(){
    this.changePhotoForm =this.formBuilder.group({
      image:['',[Validators.required]]
      
    });
    this.changePhotoForm.valueChanges.subscribe(data=>this.onChangePhotoValueChanged());
    this.onChangePhotoValueChanged(); //reset form validation messages
  }

  onChangePhotoValueChanged(){
    if(!this.changePhotoForm){
      return;
    }
    const form =this.changePhotoForm;
    for(const field in this.changePhotoFormErrors){
      if(this.changePhotoFormErrors.hasOwnProperty(field)){
        //clear previous error messsage(if any)
        this.changePhotoFormErrors[field]='';
        const control = form.get(field);
        if(control && control.dirty && !control.valid){
          const messages =this.changePhotoValidationMessages[field];
          for(const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.changePhotoFormErrors[field]+=messages[key] +' ';
            }
          }
        }
      }
    }
  }

  selectImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.image = file;
    }
  }
  onChangePhotoSubmit(){
    const formData = new FormData();
    formData.append('imageFile', this.image);
    this.uploadService.uploadPofilePicture(this.admin._id, formData).subscribe(file =>{
      if(file){
        let imageName = file.filename;
        this.adminService.updateAdmin(this.admin._id, {"image": imageName}).subscribe(admin =>{
          if(admin){
            this.admin=admin;
            alert('Profile picture changed successfully. Please refresh the page..!');
          }
        }, err=>{
          if(err){
            alert(err);
          }
        })
        
      }
    },err =>{
      if(err){
        alert(err);
      }
      
    });

  }
  createChangeNameForm(){
    this.changeNameForm =this.formBuilder.group({
      firstName:['',[Validators.required]],
      lastName:['',[Validators.required]]
      
    });
    this.changeNameForm.valueChanges.subscribe(data=>this.onChangeNameValueChanged());
    this.onChangeNameValueChanged(); //reset form validation messages
  }

  onChangeNameValueChanged(){
    if(!this.changeNameForm){
      return;
    }
    const form =this.changeNameForm;
    for(const field in this.changeNameFormErrors){
      if(this.changeNameFormErrors.hasOwnProperty(field)){
        //clear previous error messsage(if any)
        this.changeNameFormErrors[field]='';
        const control = form.get(field);
        if(control && control.dirty && !control.valid){
          const messages =this.changeNameValidationMessages[field];
          for(const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.changeNameFormErrors[field]+=messages[key] +' ';
            }
          }
        }
      }
    }
  }
  onChangenameSubmit(){
    let fName = this.changeNameForm.value['firstName'];
    let lName = this.changeNameForm.value['lastName'];
    let body = {
      firstName: fName,
      lastName: lName
    };
    this.adminService.updateAdmin(this.admin._id, body).subscribe(admin=>{
      if(admin){
        this.admin = admin;
        this.changeNameForm.reset();
        alert('Name Changed successfully. Please refresh the page..!');
      }
    }, err=>{
      if(err){
        alert(err);
      }
    })

  }

  createChangeEmailForm(){
    this.changeEmailForm =this.formBuilder.group({
      email:['',[Validators.required, Validators.email]]
      
      
    });
    this.changeEmailForm.valueChanges.subscribe(data=>this.onChangeEmailValueChanged());
    this.onChangeEmailValueChanged(); //reset form validation messages
  }

  onChangeEmailValueChanged(){
    if(!this.changeEmailForm){
      return;
    }
    const form =this.changeEmailForm;
    for(const field in this.changeEmailFormErrors){
      if(this.changeEmailFormErrors.hasOwnProperty(field)){
        //clear previous error messsage(if any)
        this.changeEmailFormErrors[field]='';
        const control = form.get(field);
        if(control && control.dirty && !control.valid){
          const messages =this.changeEmailValidationMessages[field];
          for(const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.changeEmailFormErrors[field]+=messages[key] +' ';
            }
          }
        }
      }
    }
  }
  onChangeEmailSubmit(){
    let e = this.changeEmailForm.value['email'];
    let body = {
      email: e
    };
    this.adminService.updateAdmin(this.admin._id, body).subscribe(admin=>{
      if(admin){
        this.admin = admin;
        this.changeEmailForm.reset();
        alert('Email Changed successfully. Please refresh the page..!');
      }
    }, err=>{
      if(err){
        alert(err);
      }
    })

  }

  createChangePasswordForm(){
    this.changePasswordForm =this.formBuilder.group({
      currentPassword:['',[Validators.required]],
      newPassword:['',[Validators.required, Validators.pattern]],
      newRePassword:['',[Validators.required, Validators.pattern]]
      
      
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
    let currentPassword = this.changePasswordForm.value['currentPassword'];
    let newPassword = this.changePasswordForm.value['newPassword'];
    let newRePassword = this.changePasswordForm.value['newRePassword'];
    if(newPassword === newRePassword){
      let body={
        newpassword:newPassword,
        oldpassword:currentPassword
      }
      this.adminService.changePassword(this.admin._id,body).subscribe(res=>{
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

}
