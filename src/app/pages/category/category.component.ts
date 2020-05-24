import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authService/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoryService } from 'src/app/services/categoryService/category.service';
import { Category } from 'src/app/shared/category';
import { baseURL } from 'src/app/shared/baseurl';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  categoryImageUrl:String = baseURL+'images/categories/';
  productImageUrl:String = baseURL+'images/products/';
  categoryForm: FormGroup;
  categoryFormErrors ={
    'categoryId':''
  };
  categoryValidationMessages ={
    'categoryId':{
      'required': 'Product Id is required',
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

  constructor(
    private authService: AuthService,
    private router: Router,
    private route:ActivatedRoute,
    private categoryService: CategoryService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.authService.loadUserCredentials();
    if(this.authService.isLoggedIn() === false){
      alert('You should log first.!');
      this.router.navigate(['login']);
    }
    // this.categoryId =this.route.snapshot.paramMap.get('id');
    this.createCategoryForm();
    this.createProductForm();
    this.route.params.subscribe(params => {
      this.categoryId = params['id'];
      this.categoryService.getCategoryById(this.categoryId).subscribe(category =>{
        this.category=category;
        if(this.category){
          this.category.subCategories.forEach(cat => {
            cat.sales = this.getSalesCount(cat);
          });
        }
      }, err => this.err =err);
    });
    
    
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

  deleteProduct(id: number){
    
  }
  


  

}



