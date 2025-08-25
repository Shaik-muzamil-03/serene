import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {

  constructor(private router : Router){

  }

  openShop(){
    this.router.navigate(['/shopping']);
  }
}
