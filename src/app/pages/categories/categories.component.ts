import { Component, OnInit, Inject } from '@angular/core';
import * as CanvasJS from '../../../assets/canvasjs.min';
import{FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UploadService } from 'src/app/services/uploadService/upload.service';
import { CategoryService } from 'src/app/services/categoryService/category.service';
import { Category } from 'src/app/shared/category';
import { AuthService } from 'src/app/services/authService/auth.service';
import { Router } from '@angular/router';
import { baseURL } from 'src/app/shared/baseurl';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  dataPoints=[];
  res: any;
  file:any;
  err:String;
  image;
  categoryImageUrl:String = baseURL+'images/categories/';
  categoryName: String;
  category: Category;
  categories:Category[];
  categoryForm:FormGroup;
  topCategory: Category;
  highestSales:Number=0;
  categoryFormErrors ={
    'name':'',
    'image':''
  };
  categoryValidationMessages ={
    'name':{
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
    private categoryService: CategoryService,
    private authService: AuthService,
    private router: Router,
    @Inject('BaseURL') private BaseURL
  ) { }
  
  onCategorySubmit(){
    // console.log(typeof(this.categoryForm.value['image']));
    this.categoryName = this.categoryForm.value['name']
    const formData = new FormData();
    formData.append('imageFile', this.image);
    let body ={
      name: this.categoryName
    }
    this.categoryService.addNewCategory(body).subscribe(category =>{
      if(category){
        this.uploadService.uploadCategoryImage(category._id, formData).subscribe(file =>{
          if(file){
            let imageName = file.filename;
            this.categoryService.updateCategory(category._id, {"image":imageName}).subscribe(cat =>{
              this.category = cat;
              this.category.sales= this.getSalesCount(this.category);
              this.categories.push(this.category);
              var dataPoint = {y:this.category.products.length, label: this.category.name};
              this.dataPoints.push(dataPoint);
              let categoryChart = new CanvasJS.Chart("categories", {
                animationEnabled: true,
                exportEnabled: true,
                title: {
                  text: "Categories"
                },
                data: [{
                  type: "column",
                  dataPoints: this.dataPoints
                  
                }
              ]
                
              });
              categoryChart.render();
            }, err => this.err = err)
          }
        },err => this.err = err)
      }
    },err => this.err = err)
    
    // this.categoryService.addNewCategory(this.body).subscribe(categories =>this.res = categories, err => this.err=err);
    
    this.categoryForm.reset({
      name:'',
      image:''
    });
  }

  open(content, modalSize) {
    this.modalService.open(content, {size:modalSize});
  }
  
  createCategoryForm(){
    this.categoryForm =this.formBuilder.group({
      name:['',[Validators.required]],
      image:['',[Validators.required]]
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
  selectImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.image = file;
    }
  }


  ngOnInit(): void {
    this.authService.loadUserCredentials();
    if(this.authService.isLoggedIn() === false){
      alert('You should log first.!');
      this.router.navigate(['login']);
    }


    this.createCategoryForm();
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
      this.highestSales = 0;
      this.dataPoints = [];
      this.categories.forEach(category => {
        category.sales = this.getSalesCount(category);
        let date = new Date(category.createdAt);
        let month= date.getMonth();
        console.log(month);
        console.log(date);
        var dataPoint = {y:category.products.length, label: category.name}
        this.dataPoints.push(dataPoint);
        if(this.highestSales<= category.sales){
          this.topCategory= category;
          this.highestSales = category.sales;
        }
      });
      console.log(this.dataPoints);
      let categoryChart = new CanvasJS.Chart("categories", {
        animationEnabled: true,
        exportEnabled: true,
        title: {
          text: "Categories"
        },
        data: [{
          type: "column",
          dataPoints: this.dataPoints
          
        }
      ]
        
      });
      categoryChart.render();

    }, err=> this.err =err);
    
    
  }
  deleteCategory(id: number){
    this.categoryService.deleteCategory(id).subscribe(res =>{
      if(res){
        this.categoryService.getCategories().subscribe(categories=>{
          this.categories=categories;
          this.highestSales =0;
          this.dataPoints = [];
          this.categories.forEach(category => {
            category.sales = this.getSalesCount(category);
            var dataPoint = {y:category.products.length, label: category.name}
            this.dataPoints.push(dataPoint);
            if(this.highestSales<= category.sales){
              this.topCategory= category;
              this.highestSales = category.sales;
            }
          });
          let categoryChart = new CanvasJS.Chart("categories", {
            animationEnabled: true,
            exportEnabled: true,
            title: {
              text: "Categories"
            },
            data: [{
              type: "column",
              dataPoints: this.dataPoints
              
            }
          ]
            
          });
          categoryChart.render();
        }, err => this.err=err);
      }
    },err=> this.err=err);
  }
  getSalesCount(category:Category){
    let sales = 0;
    category.products.forEach(product => {
      sales+= product.sales;
    });
    return sales
  }

}
