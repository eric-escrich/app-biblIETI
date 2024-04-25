import { Component } from '@angular/core';
import { LibrosComponent } from './libros/libros.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
            LibrosComponent,
            CommonModule
          ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})

export class SearchComponent {
  value: string | undefined;

  books: {
    image: string;
  }[] = [];

  constructor() {
      this.books.push(
        {
          image: 'https://libreria-alzofora.com/wp-content/uploads/2022/06/LISISTRATA-146209.jpg'
        },
        {
          image: 'https://libreria-alzofora.com/wp-content/uploads/2022/06/LISISTRATA-146209.jpg'
        },
      )};
}
