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
import { baseURL } from 'src/app/shared/baseurl';
import { OrderService } from 'src/app/services/orderService/order.service';
import { Order } from 'src/app/shared/order';
import { Item } from 'src/app/shared/cartItem';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  file:any;
  err:String;
  image;
  orders:Order[];
  productName: String;
  productBrand: String;
  product: Product;
  productImageUrl:String = baseURL+'images/products/';
  productForm:FormGroup;
  products: Product[];
  highestSales:Number=0;
  topProduct: Product;
  productsCountByDay=[];
  days=['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  productFormErrors ={
    'name':'',
    'brand': '',
    'image':''
  };
  productValidationMessages ={
    'name':{
      'required': 'Name is required',
    },
    'brand':{
      'required': 'Brand is required',
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
    private orderService:OrderService,
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
              this.products.push(this.product);
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

  async ngOnInit(): Promise<void> {
    await this.authService.loadUserCredentials();
    if(this.authService.isLoggedIn() === false){
      alert('You should log first.!');
      this.router.navigate(['login']);
    }
    this.createProductForm();
    
    this.productService.getProducts().subscribe(products => {
      this.products=products;
      this.highestSales=0;
      this.products.forEach(product => {
        if(this.highestSales<=product.sales){
          this.topProduct = product;
          this.highestSales=product.sales;
        }
        
      });
    }, err =>this.err=err);

    this.orderService.getOrders().subscribe(orders =>{
      if(orders){
        this.orders = orders.reverse();
        let first = new Date(Date.now());
        let firstCount = 0;
        let second = this.getPreviousDate(first);
        let secondCount = 0;
        let third = this.getPreviousDate(second);
        let thirdCount = 0;
        let fourth = this.getPreviousDate(third);
        let fourthCount = 0;
        let fifth = this.getPreviousDate(fourth);
        let fifthCount = 0;
        let sixth = this.getPreviousDate(fifth);
        let sixthCount = 0;
        let seventh = this.getPreviousDate(sixth);
        let seventhCount = 0;
        for (let i = 0; i < this.orders.length; i++) {
          let order = this.orders[i];
          let orderDate = new Date(order.orderedDate);
          if(orderDate<seventh){
            break;
          }
          if(orderDate===first){
            firstCount+=this.getNumberOfproducts(order.orderItems);
          }
          if(orderDate===second){
            secondCount+=this.getNumberOfproducts(order.orderItems);
          }
          if(orderDate===third){
            thirdCount+=this.getNumberOfproducts(order.orderItems);
          }
          if(orderDate===fourth){
            fourthCount+=this.getNumberOfproducts(order.orderItems);
          }
          if(orderDate===fifth){
            fifthCount+=this.getNumberOfproducts(order.orderItems);
          }
          if(orderDate===sixth){
            sixthCount+=this.getNumberOfproducts(order.orderItems);
          }
          if(orderDate===seventh){
            seventhCount+=this.getNumberOfproducts(order.orderItems);
          }
        }
        this.productsCountByDay=[
          {y:seventhCount, label:this.days[seventh.getUTCDay()]},
          {y:sixthCount, label:this.days[sixth.getUTCDay()]},
          {y:fifthCount, label:this.days[fifth.getUTCDay()]},
          {y:fourthCount, label:this.days[fourth.getUTCDay()]},
          {y:thirdCount, label:this.days[third.getUTCDay()]},
          {y:secondCount, label:this.days[second.getUTCDay()]},
          {y:firstCount, label:this.days[first.getUTCDay()]}
        ];
        // console.log(first);
        let productChart = new CanvasJS.Chart("products", {
          animationEnabled: true,
          exportEnabled: true,
          title: {
            text: "Products"
          },
          data: [{
            type: "column",
            dataPoints: this.productsCountByDay
            
          }
        ]
          
        });
        productChart.render();


      }
    });

    
  }

  deleteProduct(id: number){
    this.productService.deleteProduct(id).subscribe(res =>{
      if(res){
        alert("Product is successfully deleted.!");
        this.productService.getProducts().subscribe(products => {
          this.highestSales=0;
          this.products=products;
          this.products.forEach(product => {
            if(this.highestSales<=product.sales){
              this.topProduct=product;
              this.highestSales= product.sales;
            }
          });
        }, err=>this.err=err);
      }
    },err=>{
      alert("Something went wrong. Please try again..")
    });
  }
  getPreviousDate(date: Date){
    let d = new Date();
    return new Date(d.setDate(date.getDate()-1));
  }
  getNumberOfproducts(items:Item[]){
    let count =0;
    items.forEach(item => {
      count+=item.quantity;
    });
    return count;
  }
  copyToClipboard(item): void {
    let listener = (e: ClipboardEvent) => {
        e.clipboardData.setData('text/plain', (item));
        e.preventDefault();
    };
    alert('Product Id copied to clipboard');
    document.addEventListener('copy', listener);
    document.execCommand('copy');
    document.removeEventListener('copy', listener);
}

}
