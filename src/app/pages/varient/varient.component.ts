import { Component, OnInit } from '@angular/core';
import * as CanvasJS from '../../../assets/canvasjs.min'
import { AuthService } from 'src/app/services/authService/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/productService/product.service';
import { Product } from 'src/app/shared/product';
import { baseURL } from 'src/app/shared/baseurl';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Attribute } from '@angular/compiler';
import { VarientService } from 'src/app/services/varientService/varient.service';
import { Varient } from 'src/app/shared/varient';
import { UploadService } from 'src/app/services/uploadService/upload.service';

@Component({
  selector: 'app-varient',
  templateUrl: './varient.component.html',
  styleUrls: ['./varient.component.css']
})
export class VarientComponent implements OnInit {
  product:Product;
  data=[];
  err:String;
  attributes=[];
  attributeId:any;
  varientId:any;
  image;
  productId:any;
  varient:Varient;
  varientErr:String;
  attribute={
    name:'',
    value:''
  };
  uploadErr:String;
  productImageUrl:String = baseURL+'images/products/';
  changeNameFormErrors ={
    'name':''
  };
  changeNameValidationMessages ={
    'name':{
      'required': 'Product Name is required',
    }
  };
  changePriceFormErrors ={
    'price':''
  };
  changePriceValidationMessages ={
    'price':{
      'required': 'Product Price is required',
      'pattern': 'Should contain a Price'
    }
  };
  changeAvailabilityFormErrors ={
    'availability':''
  };
  changeAvailabilityValidationMessages ={
    'availability':{
      'required': 'Product Availability is required',
    }
  };
  changeBrandFormErrors ={
    'brand':''
  };
  changeBrandValidationMessages ={
    'brand':{
      'required': 'Product Brand is required',
    }
  };
  changeAttributeFormErrors ={
    'attr':''
  };
  changeAttributeValidationMessages ={
    'attr':{
      'required': 'Attribute Value is required',
    }
  };
  changePhotoFormErrors ={
    'image':''
  };
  changePhotoValidationMessages ={
    'image':{
      'required': 'Product Photo is required',
    }
  };
  varientFormErrors ={
    'availability':'',
    'price': ''
    
  };
  varientValidationMessages ={
    'availability':{
      'required': 'Availability is required',
    },
    'price':{
      'required': 'Price is required',
    }
  };
  attributeFormErrors ={
    'name':''
    
  };
  attributeValidationMessages ={
    'name':{
      'required': 'Attribute name is required',
    }
  };
  varientForm: FormGroup;
  attributeForm:FormGroup;
  changeNameForm: FormGroup;
  changePhotoForm:FormGroup;
  changeBrandForm: FormGroup;
  changeAttributeForm: FormGroup;
  changePriceForm: FormGroup;
  changeAvailabilityForm: FormGroup;
  constructor(
    private authService: AuthService,
    private router: Router,
    private productService: ProductService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private varientService: VarientService,
    private uploadService: UploadService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.authService.loadUserCredentials();
    if(this.authService.isLoggedIn() === false){
      alert('You should log first.!');
      this.router.navigate(['login']);
    }
    this.productId =this.route.snapshot.paramMap.get('id');
    // console.log(productId);
    this.productService.getProductById(this.productId).subscribe(product =>{
      this.product=product;
      this.data=[];
      this.product.varients.forEach(varient => {
        let d = {y:varient.sales, label:varient._id}
        this.data.push(d);
      });
      let varientChart = new CanvasJS.Chart("varients", {
        animationEnabled: true,
        exportEnabled: true,
        title: {
          text: "Varients"
        },
        data: [
        {
          type: "column",
          dataPoints: this.data
          
        }
      ]
        
      });
      varientChart.render();
      // console.log(this.data);
      this.attributes=[];
      if(product.varients.length>0){
        product.varients[0].attributes.forEach(attr => {
          this.attributes.push(attr.name);
        });
      }
      this.createVarientForm(this.attributes);
      this.createChangeNameForm();
      this.createChangePhotoForm();
      this.createChangeBrandForm();
      this.createChangeAttributeForm();
      this.createChangeAvailabilityForm();
      this.createChangePriceForm();
       //reset form validation messages
    },err=>this.err=err );
    
  }

  onVarientSubmit(attributes:string[]){
    console.log(this.varientForm.value);
    this.productService.getProductById(this.productId).subscribe(product =>{
      if(product){
        let attributesList = [];
        if(product.varients.length>0){
          product.varients[0].attributes.forEach(attr => {
            attributesList.push(attr.name);
          });
        }
        if(attributes.length!=attributesList.length){
          let l = attributesList.length;
          for (let q = l; q < attributes.length; q++) {
            let attrBody = {
              name:attributes[q],
              value:""
            }
            product.varients.forEach(varient => {
              this.varientService.addNewAttribute(this.productId,varient._id,attrBody).subscribe(varient => this.varient=varient, err=>this.err=err);
            });
            
            
          }
          
          // console.log(attributes);
          


        }
        // console.log(attributes);
        let body = {
          availability:this.varientForm.value['availability'],
          price:this.varientForm.value['price'],
          attributes:[]
        }
        attributes.forEach(attr => {
          let attribute ={
            name:'',
            value:''
          }
          attribute.name=attr;
          attribute.value= this.varientForm.value[attr];
          body.attributes.push(attribute);
        });
        console.log(body);
        this.varientService.addNewVarient(this.productId, body).subscribe(product =>{
          this.product=product;
          this.data=[];
          this.product.varients.forEach(varient => {
            let d = {y:varient.sales, label:varient._id}
            this.data.push(d);
          });
          let varientChart = new CanvasJS.Chart("varients", {
            animationEnabled: true,
            exportEnabled: true,
            title: {
              text: "Varients"
            },
            data: [
            {
              type: "column",
              dataPoints: this.data
              
            }
          ]
            
          });
          varientChart.render();
          this.attributes=[];
          if(product.varients.length>0){
            product.varients[0].attributes.forEach(attr => {
            this.attributes.push(attr.name);
            });
          }
          this.createVarientForm(this.attributes);
        }, err => this.err=err);
      }
    },err =>this.err=err);
    
    // this.categoryService.addNewCategory(this.body).subscribe(categories =>this.res = categories, err => this.err=err);
    
  }

  open(content, modalSize) {
    this.modalService.open(content, {size:modalSize});
  }
  
  

  onValueChanged(varientForm: FormGroup){
    if(!varientForm){
      return;
    }
    const form =varientForm;
    for(const field in this.varientFormErrors){
      if(this.varientFormErrors.hasOwnProperty(field)){
        //clear previous error messsage(if any)
        this.varientFormErrors[field]='';
        const control = form.get(field);
        if(control && control.dirty && !control.valid){
          const messages =this.varientValidationMessages[field];
          for(const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.varientFormErrors[field]+=messages[key] +' ';
            }
          }
        }
      }
    }
  }
  onAttributeValueChanged(attributeForm: FormGroup){
    if(!attributeForm){
      return;
    }
    const form =attributeForm;
    for(const field in this.attributeFormErrors){
      if(this.attributeFormErrors.hasOwnProperty(field)){
        //clear previous error messsage(if any)
        this.attributeFormErrors[field]='';
        const control = form.get(field);
        if(control && control.dirty && !control.valid){
          const messages =this.attributeValidationMessages[field];
          for(const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.attributeFormErrors[field]+=messages[key] +' ';
            }
          }
        }
      }
    }
  }

  addNewAttribute(attribute: string, attributes:string[]){
    attributes.push(attribute);
    this.createVarientForm(attributes);
  }
  createVarientForm(attributes:string[]){
    this.createAttributeForm();
    let group = {};

    for (let j = 0; j < attributes.length; j++) {
      group[`${attributes[j]}`] = [''];
    };
    group['availability'] = ['',[Validators.required]];
    group['price'] = ['',[Validators.required]];
    this.varientForm = this.formBuilder.group(group);
      this.varientForm.valueChanges.subscribe(data=>this.onValueChanged(this.varientForm));
      this.onValueChanged(this.varientForm);
  }
  onAttributeSubmit(attributes:string[]){
    // console.log("ashan")
    let attr = this.attributeForm.value['name'];
    this.addNewAttribute(attr, attributes);

  }
  createAttributeForm(){
    this.attributeForm =this.formBuilder.group({
      name:['',[Validators.required]]
     
    });
    this.attributeForm.valueChanges.subscribe(data=>this.onAttributeValueChanged(this.attributeForm));
    this.onAttributeValueChanged(this.attributeForm); //reset form validation messages


  }
  createChangeNameForm(){
    this.changeNameForm =this.formBuilder.group({
      name:['',[Validators.required]]
      
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
    let name = this.changeNameForm.value['name'];
    let body = {
      "name": name
    };
    this.productService.updateProduct(this.productId, body).subscribe(product =>{
      if(product){
        alert('Product Name Updated successfully. Please refresh the page.');
      }
    }, err=>{
      if(err){
        alert(err);
      }
    })

  }

  createChangeBrandForm(){
    this.changeBrandForm =this.formBuilder.group({
      brand:['',[Validators.required]]
      
    });
    this.changeBrandForm.valueChanges.subscribe(data=>this.onChangeBrandValueChanged());
    this.onChangeBrandValueChanged(); //reset form validation messages
  }

  onChangeBrandValueChanged(){
    if(!this.changeBrandForm){
      return;
    }
    const form =this.changeBrandForm;
    for(const field in this.changeBrandFormErrors){
      if(this.changeBrandFormErrors.hasOwnProperty(field)){
        //clear previous error messsage(if any)
        this.changeBrandFormErrors[field]='';
        const control = form.get(field);
        if(control && control.dirty && !control.valid){
          const messages =this.changeBrandValidationMessages[field];
          for(const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.changeBrandFormErrors[field]+=messages[key] +' ';
            }
          }
        }
      }
    }
  }
  onChangeBrandSubmit(){
    let brand = this.changeBrandForm.value['brand'];
    let body = {
      "brand": brand
    };
    this.productService.updateProduct(this.productId, body).subscribe(product =>{
      if(product){
        alert('Product Name Updated successfully. Please refresh the page.');
      }
    }, err=>{
      if(err){
        alert(err);
      }
    })

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
    this.uploadService.uploadProductImage(this.productId, formData).subscribe(file =>{
      if(file){
        // this.productService.getProductById(this.productId).subscribe(product => this.product=product, err => this.err=err);
        alert('Product Photo Updated Successfully..!\nPlease refresh the page.');
        
      }
    },err =>{
      this.uploadErr=err;
      alert(this.uploadErr);
    });

  }
  removeVarient(varientId: any){
    this.varientService.deleteVarient(this.productId, varientId).subscribe(product =>{
      if(product){
        this.product=product;
        this.data=[];
        this.product.varients.forEach(varient => {
          let d = {y:varient.sales, label:varient._id}
          this.data.push(d);
        });
        let varientChart = new CanvasJS.Chart("varients", {
          animationEnabled: true,
          exportEnabled: true,
          title: {
            text: "Varients"
          },
          data: [
          {
            type: "column",
            dataPoints: this.data
            
          }
        ]
          
        });
        varientChart.render();
        alert("Varient removed Successfully..");
      }
      
    }, err=>{
      if(err){
        this.err=err;
        alert('Something went wrong.Please try again..');
      }
    });
    
  }
  chageAttribute(content,modalSize, attributeId, varientId){
    this.attributeId = attributeId;
    this.varientId= varientId;
    this.open(content, modalSize);
  }

  createChangeAttributeForm(){
    this.changeAttributeForm =this.formBuilder.group({
      attr:['',[Validators.required]]
      
    });
    this.changeAttributeForm.valueChanges.subscribe(data=>this.onChangeAttributeValueChanged());
    this.onChangeAttributeValueChanged(); //reset form validation messages
  }

  onChangeAttributeValueChanged(){
    if(!this.changeAttributeForm){
      return;
    }
    const form =this.changeAttributeForm;
    for(const field in this.changeAttributeFormErrors){
      if(this.changeAttributeFormErrors.hasOwnProperty(field)){
        //clear previous error messsage(if any)
        this.changeAttributeFormErrors[field]='';
        const control = form.get(field);
        if(control && control.dirty && !control.valid){
          const messages =this.changeAttributeValidationMessages[field];
          for(const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.changeAttributeFormErrors[field]+=messages[key] +' ';
            }
          }
        }
      }
    }
  }
  onChangeAttributeSubmit(){
    let val = this.changeAttributeForm.value['attr'];
    console.log(val);
    let body = {
      value: val
    };
    console.log(body);
    this.varientService.updateAttribute(this.productId, body, this.varientId, this.attributeId).subscribe(varient =>{
      if(varient){
        alert('Attribute Updated successfully. Please refresh the page.');
      }
    }, err=>{
      if(err){
        alert(err);
      }
    })

  }

  createChangeAvailabilityForm(){
    this.changeAvailabilityForm =this.formBuilder.group({
      availability:['',[Validators.required]]
      
    });
    this.changeAvailabilityForm.valueChanges.subscribe(data=>this.onChangeAvailabilityValueChanged());
    this.onChangeAvailabilityValueChanged(); //reset form validation messages
  }

  onChangeAvailabilityValueChanged(){
    if(!this.changeAvailabilityForm){
      return;
    }
    const form =this.changeAvailabilityForm;
    for(const field in this.changeAvailabilityFormErrors){
      if(this.changeAvailabilityFormErrors.hasOwnProperty(field)){
        //clear previous error messsage(if any)
        this.changeAvailabilityFormErrors[field]='';
        const control = form.get(field);
        if(control && control.dirty && !control.valid){
          const messages =this.changeAvailabilityValidationMessages[field];
          for(const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.changeAvailabilityFormErrors[field]+=messages[key] +' ';
            }
          }
        }
      }
    }
  }
  onChangeAvailabilitySubmit(){
    let val = this.changeAvailabilityForm.value['availability'];
    console.log(val);
    let body = {
      "availability": val
    };
    console.log(body);
    this.varientService.updateVarient(this.productId, this.varientId, body).subscribe(varient =>{
      if(varient){
        alert('Varient Updated successfully. Please refresh the page.');
      }
    }, err=>{
      if(err){
        alert(err);
      }
    })

  }

  createChangePriceForm(){
    this.changePriceForm =this.formBuilder.group({
      price:['',[Validators.required, Validators.pattern]]
      
    });
    this.changePriceForm.valueChanges.subscribe(data=>this.onChangePriceValueChanged());
    this.onChangePriceValueChanged(); //reset form validation messages
  }

  onChangePriceValueChanged(){
    if(!this.changePriceForm){
      return;
    }
    const form =this.changePriceForm;
    for(const field in this.changePriceFormErrors){
      if(this.changePriceFormErrors.hasOwnProperty(field)){
        //clear previous error messsage(if any)
        this.changePriceFormErrors[field]='';
        const control = form.get(field);
        if(control && control.dirty && !control.valid){
          const messages =this.changePriceValidationMessages[field];
          for(const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.changePriceFormErrors[field]+=messages[key] +' ';
            }
          }
        }
      }
    }
  }
  onChangePriceSubmit(){
    let val = this.changePriceForm.value['price'];
    console.log(val);
    let body = {
      "price": val
    };
    console.log(body);
    this.varientService.updateVarient(this.productId, this.varientId, body).subscribe(varient =>{
      if(varient){
        alert('Varient Updated successfully. Please refresh the page.');
      }
    }, err=>{
      if(err){
        alert(err);
      }
    })

  }
  updateVarient(content, modalSize, varientId){
    this.varientId= varientId;
    this.open(content, modalSize);

  }


}
