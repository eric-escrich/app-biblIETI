import { Component, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormControl, FormGroup } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-creacio-usuari',
  standalone: true,
  imports: [
            InputTextModule,
            ButtonModule,
            PasswordModule
          ],
  templateUrl: './creacio-usuari.component.html',
  styleUrl: './creacio-usuari.component.css'
})
export class CreacioUsuariComponent implements OnInit{
  formGroup: FormGroup | undefined;

  ngOnInit() {
      this.formGroup = new FormGroup({
          text: new FormControl<string | null>(null)
      });
  }
}