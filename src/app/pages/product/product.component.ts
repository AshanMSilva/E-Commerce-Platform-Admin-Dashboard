import { Component, OnInit, Inject } from '@angular/core';
import * as CanvasJS from '../../../assets/canvasjs.min'
import { AuthService } from 'src/app/services/authService/auth.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from 'src/app/shared/category';
import { UploadService } from 'src/app/services/uploadService/upload.service';
import { CategoryService } from 'src/app/services/categoryService/category.service';
import { Product } from 'src/app/shared/product';
import { ProductService } from 'src/app/services/productService/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  file:any;
  err:String;
  image;
  productName: String;
  productBrand: String;
  product: Product;
  productForm:FormGroup;
  productFormErrors ={
    'name':'',
    'brand': '',
    'image':''
  };
  productValidationMessages ={
    'name':{
      'required': 'Category Name is required',
    },
    'brand':{
      'required': 'Category Name is required',
    },
    'image':{
      'required': 'Image is required'
    }
  };

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private uploadService: UploadService,
    private productService: ProductService,
    private authService: AuthService,
    private router: Router,
    @Inject('BaseURL') private BaseURL
  ) { }
  
  onProductSubmit(){
    // console.log(typeof(this.categoryForm.value['image']));
    this.productName = this.productForm.value['name'];
    this.productBrand = this.productForm.value['brand'];
    const formData = new FormData();
    formData.append('imageFile', this.image);
    let body ={
      name: this.productName,
      brand: this.productBrand
    }
    this.productService.addNewProduct(body).subscribe(product =>{
      if(product){
        this.uploadService.uploadProductImage(product._id, formData).subscribe(file =>{
          if(file){
            let imageName = file.filename;
            this.productService.updateProduct(product._id, {"image":imageName}).subscribe(prod =>{
              this.product = prod;
            }, err => this.err = err)
          }
        },err => this.err = err)
      }
    },err => this.err = err)
    
    // this.categoryService.addNewCategory(this.body).subscribe(categories =>this.res = categories, err => this.err=err);
    
    this.productForm.reset({
      name:'',
      image:'',
      brand:''
    });
  }

  open(content, modalSize) {
    this.modalService.open(content, {size:modalSize});
  }
  
  createProductForm(){
    this.productForm =this.formBuilder.group({
      name:['',[Validators.required]],
      brand:['', [Validators.required]],
      image:['',[Validators.required]]
    });
    this.productForm.valueChanges.subscribe(data=>this.onValueChanged());
    this.onValueChanged(); //reset form validation messages
  }

  onValueChanged(){
    if(!this.productForm){
      return;
    }
    const form =this.productForm;
    for(const field in this.productFormErrors){
      if(this.productFormErrors.hasOwnProperty(field)){
        //clear previous error messsage(if any)
        this.productFormErrors[field]='';
        const control = form.get(field);
        if(control && control.dirty && !control.valid){
          const messages =this.productValidationMessages[field];
          for(const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.productFormErrors[field]+=messages[key] +' ';
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

  ngOnInit(): void {
    this.authService.loadUserCredentials();
    if(this.authService.isLoggedIn() === false){
      this.router.navigate(['login']);
    }
    this.createProductForm();
    let productChart = new CanvasJS.Chart("products", {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: "Products"
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
    productChart.render();
  }


}
