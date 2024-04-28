// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';

// @Component({
//     selector: 'app-reset-password-component',
//     standalone: true,
//     imports: [],
//     templateUrl: './reset-password-component.component.html',
//     styleUrl: './reset-password-component.component.css',
// })
// export class ResetPasswordComponent implements OnInit {
//     uid!: string;
//     token!: string;

//     constructor(private route: ActivatedRoute) {}

//     ngOnInit() {
//         this.uid = this.route.snapshot.paramMap.get('uid');
//         this.token = this.route.snapshot.paramMap.get('token');
//         // Ahora puedes usar uid y token para verificar el token y restablecer la contraseña

//         this.route.queryParamMap
//             .subscribe((params) => {
//                 this.paramsObject = { ...params.keys, ...params };
//                 console.log(this.paramsObject);
//             }
//         );
//     }
// }
