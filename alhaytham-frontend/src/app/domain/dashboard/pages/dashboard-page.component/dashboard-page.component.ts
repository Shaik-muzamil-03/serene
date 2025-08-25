import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '../../components/dashboard.component/dashboard.component';

@Component({
  selector: 'app-dashboard-page.component',
  imports: [CommonModule, DashboardComponent],
  templateUrl: './dashboard-page.component.html'
})
export class DashboardPageComponent {
  

}
