import { Component, OnInit, Inject } from '@angular/core';
import * as CanvasJS from '../../../assets/canvasjs.min'
import{FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UploadService } from 'src/app/services/uploadService/upload.service';
import { CategoryService } from 'src/app/services/categoryService/category.service';
import { Category } from 'src/app/shared/category';
import { AuthService } from 'src/app/services/authService/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  
  file:any;
  err:String;
  image;
  categoryName: String;
  category: Category;
  categoryForm:FormGroup;
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
    if(this.authService.isLoggedIn() === false){
      this.router.navigate(['login']);
    }

    this.createCategoryForm();

    let categoryChart = new CanvasJS.Chart("categories", {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: "Categories"
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
    categoryChart.render();
  }

}
