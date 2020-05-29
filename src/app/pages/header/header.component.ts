import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authService/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isMenuCollapsed = true;
  isLoggedIn: Boolean;
  subscription: Subscription;
  email: String;

  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    
   }
  

   async ngOnInit() {
    await this.authService.loadUserCredentials();
    this.subscription = this.authService.getEmail()
      .subscribe(email => {
        if(email != null){
          this.isLoggedIn = true;
        }
        console.log(this.isLoggedIn);
        
      
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  logOut(){
    this.authService.logOut();
    this.isLoggedIn = this.authService.isLoggedIn();
    console.log(this.isLoggedIn);
    this.router.navigate(['login']);
  }

}
