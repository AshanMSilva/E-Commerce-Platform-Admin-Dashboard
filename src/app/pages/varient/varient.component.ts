import { Component, OnInit } from '@angular/core';
import * as CanvasJS from '../../../assets/canvasjs.min'
import { AuthService } from 'src/app/services/authService/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/productService/product.service';
import { Product } from 'src/app/shared/product';
import { baseURL } from 'src/app/shared/baseurl';

@Component({
  selector: 'app-varient',
  templateUrl: './varient.component.html',
  styleUrls: ['./varient.component.css']
})
export class VarientComponent implements OnInit {
  product:Product;
  err:String;
  productImageUrl:String = baseURL+'images/products/';
  constructor(
    private authService: AuthService,
    private router: Router,
    private productService: ProductService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.authService.loadUserCredentials();
    if(this.authService.isLoggedIn() === false){
      alert('You should log first.!');
      this.router.navigate(['login']);
    }
    let productId =this.route.snapshot.paramMap.get('id');
    // console.log(productId);
    this.productService.getProductById(productId).subscribe(product =>this.product=product,err=>this.err=err );
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

}
