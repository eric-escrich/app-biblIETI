import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { SearchComponent } from './modules/search/search.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
            RouterOutlet,
            HomeComponent,
            DashboardComponent,
            SearchComponent
          ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
