import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authService/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoryService } from 'src/app/services/categoryService/category.service';
import { Category } from 'src/app/shared/category';
import { baseURL } from 'src/app/shared/baseurl';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from 'src/app/services/productService/product.service';
import * as CanvasJS from '../../../assets/canvasjs.min';
import { UploadService } from 'src/app/services/uploadService/upload.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  categoryId:any;
  category:Category;
  subCategoryId:number;
  productId:number;
  err:String;
  image;
  subCategoryDataPoints=[];
  productDataPoints=[];
  categoryImageUrl:String = baseURL+'images/categories/';
  productImageUrl:String = baseURL+'images/products/';
  categoryForm: FormGroup;
  changeNameForm: FormGroup;
  changePhotoForm: FormGroup;
  uploadErr:String;
  categoryFormErrors ={
    'categoryId':''
  };
  categoryValidationMessages ={
    'categoryId':{
      'required': 'Product Id is required',
    }
  };
  changeNameFormErrors ={
    'name':''
  };
  changeNameValidationMessages ={
    'name':{
      'required': 'Category Name is required',
    }
  };
  productForm: FormGroup;
  productFormErrors ={
    'productId':''
  };
  productValidationMessages ={
    'productId':{
      'required': 'Product Id is required',
    }
  };
  changePhotoFormErrors ={
    'image':''
  };
  changePhotoValidationMessages ={
    'image':{
      'required': 'Category Photo is required',
    }
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private route:ActivatedRoute,
    private categoryService: CategoryService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private uploadService: UploadService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.authService.loadUserCredentials();
    if(this.authService.isLoggedIn() === false){
      alert('You should log first.!');
      this.router.navigate(['login']);
    }
    // this.categoryId =this.route.snapshot.paramMap.get('id');
    this.createCategoryForm();
    this.createProductForm();
    this.createChangeNameForm();
    this.createChangePhotoForm();
    this.route.params.subscribe(params => {
      this.categoryId = params['id'];
      this.categoryService.getCategoryById(this.categoryId).subscribe(category =>{
        this.category=category;
        if(this.category){
          this.category.subCategories.forEach(cat => {
            cat.sales = this.getSalesCount(cat);
            var dataPoint = {y:cat.sales, label: cat.name};
            this.subCategoryDataPoints.push(dataPoint);
          });
          this.category.products.forEach(product =>{
            var productPoint = {y:product.sales, label: product.name};
            this.productDataPoints.push(productPoint);
          });
        }
        console.log(this.subCategoryDataPoints);
        
      }, err => this.err =err);
    });
    // let subCategoryChart = new CanvasJS.Chart("subCategories", {
    //   animationEnabled: true,
    //   exportEnabled: true,
    //   title: {
    //     text: "SubCategories"
    //   },
    //   data: [{
    //     type: "column",
    //     dataPoints: this.subCategoryDataPoints
        
    //   }
    // ]
      
    // });
    // subCategoryChart.render();
    // let productChart = new CanvasJS.Chart("productChart", {
    //   animationEnabled: true,
    //   exportEnabled: true,
    //   title: {
    //     text: "Products"
    //   },
    //   data: [{
    //     type: "column",
    //     dataPoints: this.productDataPoints
        
    //   }
    // ]
      
    // });
    // productChart.render();
    
    
  }
  onCategorySubmit(){
    this.subCategoryId = this.categoryForm.value['categoryId'];
    this.categoryService.addNewSubCategory(this.categoryId, this.subCategoryId).subscribe(category =>{
      if(category){
        this.category =category;
      }
    }, err=>this.err=err);
    // this.categoryService.addNewCategory(this.body).subscribe(categories =>this.res = categories, err => this.err=err);
    
    this.categoryForm.reset({
      categoryId:''
    });
  }

  open(content, modalSize) {
    this.modalService.open(content, {size:modalSize});
  }
  
  createCategoryForm(){
    this.categoryForm =this.formBuilder.group({
      categoryId:['',[Validators.required]]
      
    });
    this.categoryForm.valueChanges.subscribe(data=>this.onValueChanged());
    this.onValueChanged(); //reset form validation messages
  }

  onValueChanged(){
    if(!this.categoryForm){
      return;
    }
    const form =this.categoryForm;
    for(const field in this.categoryFormErrors){
      if(this.categoryFormErrors.hasOwnProperty(field)){
        //clear previous error messsage(if any)
        this.categoryFormErrors[field]='';
        const control = form.get(field);
        if(control && control.dirty && !control.valid){
          const messages =this.categoryValidationMessages[field];
          for(const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.categoryFormErrors[field]+=messages[key] +' ';
            }
          }
        }
      }
    }
  }

  deleteSubCategory(id: any){
    console.log(this.categoryId);
    this.categoryService.deleteSubCategory(this.categoryId, id).subscribe(res => {
      if(res){
        this.categoryService.getCategoryById(this.categoryId).subscribe(category =>{
          this.category = category;
        }, err => this.err =err);
      }
    }, err => this.err =err)
  }
  getSalesCount(category:Category){
    let sales = 0;
    category.products.forEach(product => {
      sales+= product.sales;
    });
    return sales
  }
  onProductSubmit(){
    this.productId = this.productForm.value['productId'];
    this.categoryService.addNewProduct(this.categoryId, this.productId).subscribe(category =>{
      if(category){
        this.category =category;
      }
    }, err=>this.err=err);
    // this.categoryService.addNewCategory(this.body).subscribe(categories =>this.res = categories, err => this.err=err);
    
    this.productForm.reset({
      productId:''
    });
  }

  
  
  createProductForm(){
    this.productForm =this.formBuilder.group({
      productId:['',[Validators.required]]
      
    });
    this.productForm.valueChanges.subscribe(data=>this.onProductValueChanged());
    this.onProductValueChanged(); //reset form validation messages
  }

  onProductValueChanged(){
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

  deleteProduct(id: any){
    this.categoryService.deleteProduct(this.categoryId, id).subscribe(res => {
      if(res){
        this.categoryService.getCategoryById(this.categoryId).subscribe(category =>{
          this.category = category;
        }, err => this.err =err);
      }
    }, err => this.err =err)
    
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
    this.categoryService.updateCategory(this.categoryId, body).subscribe(category =>{
      if(category){
        alert('Category Name Updated successfully. Please refresh the page.');
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
    this.uploadService.uploadCategoryImage(this.categoryId, formData).subscribe(file =>{
      if(file){
        // this.categoryService.getCategoryById(this.categoryId).subscribe(category => this.category=category, err => this.err=err);
        alert('Category Photo Updated Successfully..!\nPlease refresh the page.');
        
      }
    },err =>{
      this.uploadErr=err;
      alert(this.uploadErr);
    });

  }
  changeTopCatgeory(current: Boolean){
    if(current===true){
      this.categoryService.updateCategory(this.categoryId, {"topCategory": false}).subscribe(category=>{
        if(category){
          alert('Top Category changed successfully.. Please refresh the page');
        }
      }, err=>{
        if(err){
          alert(err.messsage);
        }
      })
    }
    else if(current===false){
      this.categoryService.updateCategory(this.categoryId, {"topCategory": true}).subscribe(category=>{
        if(category){
          alert('Top Category changed successfully.. Please refresh the page');
        }
      }, err=>{
        if(err){
          alert(err.messsage);
        }
      })
    }
    else{
      alert('Something went wrong. Please try again later.');
    }
  }

  copyToClipboard(item): void {
    let listener = (e: ClipboardEvent) => {
        e.clipboardData.setData('text/plain', (item));
        e.preventDefault();
    };
    alert('Id copied to clipboard');
    document.addEventListener('copy', listener);
    document.execCommand('copy');
    document.removeEventListener('copy', listener);
  }


  

}



