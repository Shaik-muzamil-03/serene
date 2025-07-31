import { Component } from '@angular/core';
import { DashboardComponent } from '../../components/dashboard.component/dashboard.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-page.component',
  imports: [CommonModule, DashboardComponent],
  templateUrl: './dashboard-page.component.html'
})
export class DashboardPageComponent {

}
