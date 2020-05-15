import { Component, OnInit } from '@angular/core';
import * as CanvasJS from '../../../assets/canvasjs.min'
import { AuthService } from 'src/app/services/authService/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  alert: String = null;
  hasAlert:Boolean = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.authService.loadUserCredentials();
    if(this.authService.isLoggedIn() === false){
      alert('You should log first.!');
      this.router.navigate(['login']);
    }
    this.alert =this.route.snapshot.paramMap.get('alert');
      if(this.alert!= null){
        alert(this.alert);
      }
      

    
    
    let salesChart = new CanvasJS.Chart("sales", {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: "Sales Value"
      },
      data: [{
        type: "spline",
        dataPoints: [
          { y: 71, label: "Jan" },
          { y: 55, label: "Feb" },
          { y: 50, label: "Mar" },
          { y: 65, label: "Apr" },
          { y: 95, label: "May" },
          { y: 68, label: "Jun" },
          { y: 28, label: "Jul" },
          { y: 34, label: "Aug" },
          { y: 14, label: "Sep" },
          { y: 30, label: "Oct" },
          { y: 22, label: "Nov" },
          { y: 17, label: "Dec" },
        ]
      }]
    });
    let ordersChart = new CanvasJS.Chart("orders", {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: "Orders"
      },
      data: [{
        type: "column",
        dataPoints: [
          { y: 71, label: "Mon" },
          { y: 55, label: "Tue" },
          { y: 50, label: "Wed" },
          { y: 65, label: "Thu" },
          { y: 95, label: "Fri" },
          { y: 68, label: "Sat" },
          { y: 28, label: "Sun" }
        ]
      }]
    });
    let usersChart = new CanvasJS.Chart("users", {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: "Users"
      },
      data: [{
        type: "spline",
        dataPoints: [
          { y: 71, label: "Jan" },
          { y: 55, label: "Feb" },
          { y: 50, label: "Mar" },
          { y: 65, label: "Apr" },
          { y: 95, label: "May" },
          { y: 68, label: "Jun" },
          { y: 28, label: "Jul" },
          { y: 34, label: "Aug" },
          { y: 14, label: "Sep" },
          { y: 30, label: "Oct" },
          { y: 22, label: "Nov" },
          { y: 17, label: "Dec" }
        ]
      }]
    });

      
    salesChart.render();
    ordersChart.render();
    usersChart.render();
  }
  closeAlert(){
    this.alert = null;
    this.hasAlert = false;
  }

}
