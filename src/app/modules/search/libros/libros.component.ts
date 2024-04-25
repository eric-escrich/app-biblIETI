import { Component, Input, } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { v4 as uuidv4 } from 'uuid';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-libros',
  standalone: true,
  imports: [
            FormsModule,
            ReactiveFormsModule,
            TagModule,
            ButtonModule,
            RouterLink
          ],
  templateUrl: './libros.component.html',
  styleUrl: './libros.component.css'
})

export class LibrosComponent {
  @Input() bookImg!: string;
}
