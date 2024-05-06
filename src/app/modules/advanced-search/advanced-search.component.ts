import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LibrosComponent } from '../libros/libros.component';

@Component({
  selector: 'app-advanced-search',
  standalone: true,
  imports: [
            RouterLink,
            CommonModule,
            LibrosComponent
          ],
  templateUrl: './advanced-search.component.html',
  styleUrl: './advanced-search.component.css'
})

export class AdvancedSearchComponent {
  constructor() {
    this.books.push(
        { image: 'https://libreria-alzofora.com/wp-content/uploads/2022/06/LISISTRATA-146209.jpg' },
        { image: 'https://static.bookscovers.es/imagenes/9789500/978950039871.JPG' },
        { image: 'https://pictures.abebooks.com/inventory/30813148918.jpg' },
        { image: 'https://libreria-alzofora.com/wp-content/uploads/2022/06/LISISTRATA-146209.jpg' },
        { image: 'https://www.loqueleo.com/co/uploads/2021/01/la-odisea-1.JPG' },
        { image: 'https://m.media-amazon.com/images/I/81HWYegtSpL._SL1500_.jpg' },
        { image: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Homer_Ilias_Griphanius_c1572.jpg' },
        { image: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Visions_%26_Cants_%281900%29_%28page_3_crop%29.jpg' },
        { image: 'https://imagessl9.casadellibro.com/a/l/s7/89/9788473292689.webp' },
        { image: 'https://planetalibro.net/biblioteca/e/s/esquilo/esquilo-los-siete-contra-tebas/esquilo-los-siete-contra-tebas.webp' },
        { image: 'https://static.bookscovers.es/imagenes/9789500/978950039871.JPG' },
        { image: 'https://pictures.abebooks.com/inventory/30813148918.jpg' },
        { image: 'https://libreria-alzofora.com/wp-content/uploads/2022/06/LISISTRATA-146209.jpg' },
        { image: 'https://www.loqueleo.com/co/uploads/2021/01/la-odisea-1.JPG' },
        { image: 'https://m.media-amazon.com/images/I/81HWYegtSpL._SL1500_.jpg' },
        { image: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Homer_Ilias_Griphanius_c1572.jpg' },
        { image: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Visions_%26_Cants_%281900%29_%28page_3_crop%29.jpg' },
        { image: 'https://imagessl9.casadellibro.com/a/l/s7/89/9788473292689.webp' },
        { image: 'https://libreria-alzofora.com/wp-content/uploads/2022/06/LISISTRATA-146209.jpg' },
        { image: 'https://static.bookscovers.es/imagenes/9789500/978950039871.JPG' },
        { image: 'https://pictures.abebooks.com/inventory/30813148918.jpg' },
        { image: 'https://m.media-amazon.com/images/I/511ZSAP8PlL.jpg' },
        { image: 'https://www.loqueleo.com/co/uploads/2021/01/la-odisea-1.JPG' },
        { image: 'https://m.media-amazon.com/images/I/81HWYegtSpL._SL1500_.jpg' },
        { image: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Homer_Ilias_Griphanius_c1572.jpg' },
        { image: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Visions_%26_Cants_%281900%29_%28page_3_crop%29.jpg' },
        { image: 'https://imagessl9.casadellibro.com/a/l/s7/89/9788473292689.webp' },
    );
  }

  books: {
    image: string;
  }[] = [];
  // POP UP
  isPopupVisible = false;

  showPopup() {
    this.isPopupVisible = true;
  }

  hidePopup() {
    this.isPopupVisible = false;
  }

}
