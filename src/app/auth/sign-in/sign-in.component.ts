import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ServicioService } from '../../servicio.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {
  loginForm: FormGroup;
  constructor(private router: Router, private servicio: ServicioService,private fb : FormBuilder) {
    this.loginForm = this.fb.group({
      dato: new FormControl('', [Validators.required, Validators.email]),
      contrasena: new FormControl('', [Validators.required])
    })
   }
  ngOnInit():void{
    this.verficarsesion();
  }

  verficarsesion():void{
    if (this.servicio.sesionActiva()) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/login']);
    }
  }
  login():void{
    Swal.fire({
      title: "Cargando...",
      text: "Estamos iniciando sesión.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const {dato,contrasena} = this.loginForm.value

    if (this.loginForm.valid) {
      this.servicio.login(dato,contrasena).subscribe({
        next:(response) => {
          Swal.close();
          this.servicio.guardardatos(response.nombre_usuario,response.token,new Date());
          this.servicio.cambiarlogin();
          this.router.navigate(['/home']);
        },error: (error) =>{
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Algo salió mal, por favor intente nuevamente.",
          });
        }
      })
    }
  }
}
