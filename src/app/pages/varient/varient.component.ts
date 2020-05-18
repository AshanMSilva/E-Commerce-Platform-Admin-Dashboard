import { Component, OnInit } from '@angular/core';
import * as CanvasJS from '../../../assets/canvasjs.min'
import { AuthService } from 'src/app/services/authService/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/productService/product.service';
import { Product } from 'src/app/shared/product';
import { baseURL } from 'src/app/shared/baseurl';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-varient',
  templateUrl: './varient.component.html',
  styleUrls: ['./varient.component.css']
})
export class VarientComponent implements OnInit {
  product:Product;
  err:String;
  attributes=[];
  productImageUrl:String = baseURL+'images/products/';
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
  constructor(
    private authService: AuthService,
    private router: Router,
    private productService: ProductService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.authService.loadUserCredentials();
    if(this.authService.isLoggedIn() === false){
      alert('You should log first.!');
      this.router.navigate(['login']);
    }
    let productId =this.route.snapshot.paramMap.get('id');
    // console.log(productId);
    this.productService.getProductById(productId).subscribe(product =>{
      this.product=product;
      if(product.varients.length>0){
        product.varients[0].attributes.forEach(attr => {
          this.attributes.push(attr.name);
        });
      }
      this.createVarientForm(this.attributes);
       //reset form validation messages
    },err=>this.err=err );
    let varientChart = new CanvasJS.Chart("varients", {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: "Varients"
      },
      data: [{
        type: "spline",
        dataPoints: [
          { y: 71, label: "Mon" },
          { y: 55, label: "Tue" },
          { y: 50, label: "Wed" },
          { y: 65, label: "Thu" },
          { y: 95, label: "Fri" },
          { y: 68, label: "Sat" },
          { y: 28, label: "Sun" }
        ]
        
      },
      {
        type: "spline",
        dataPoints: [
          { y: 23, label: "Mon" },
          { y: 75, label: "Tue" },
          { y: 20, label: "Wed" },
          { y: 35, label: "Thu" },
          { y: 68, label: "Fri" },
          { y: 32, label: "Sat" },
          { y: 80, label: "Sun" }
        ]
        
      }
    ]
      
    });
    varientChart.render();
  }

  onVarientSubmit(){
    console.log(this.varientForm.value);
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

  addNewAttribute(attribute: String, attributes:String[]){
    attributes.push(attribute);
    this.createVarientForm(attributes);
  }
  createVarientForm(attributes:String[]){
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
  onAttributeSubmit(attributes:String[]){
    console.log("ashan")
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

}
