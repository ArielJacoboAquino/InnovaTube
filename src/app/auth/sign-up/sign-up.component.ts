import { Component } from '@angular/core';
import { RecaptchaModule } from 'ng-recaptcha';
import { CommonModule } from '@angular/common';
import { ServicioService } from '../../servicio.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [RecaptchaModule,ReactiveFormsModule,CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  private recaptchaToken: string = '';
  registerForm:FormGroup
  error:string = '';

  constructor(private servicio: ServicioService, private fb: FormBuilder, private route: Router) {
    this.registerForm = this.fb.group({
      nombre: new FormControl('', [Validators.required]),
      apellido: new FormControl('', [Validators.required]),
      nombre_usuario: new FormControl('', [Validators.required]),
      correo: new FormControl('', [Validators.required, Validators.email]),
      contrasena: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmar_contrasena: new FormControl('', [Validators.required, Validators.minLength(6)]),
    })
  }
  resolved(token:any){
    this.recaptchaToken = token;
  }
  registrar():void{
    Swal.fire({
      title: "Cargando...",
      text: "Estamos registrando en nuestro sistema.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    const { nombre, apellido, nombre_usuario,correo, contrasena, confirmar_contrasena} = this.registerForm.value;
    if (contrasena !== confirmar_contrasena) {
      this.error = 'Las contraseñas no coinciden';
      this.registerForm.get('confirmar_contrasena')?.setErrors({ mismatch: true });
      this.registerForm.markAsTouched();
      return;
    }
    if(this.registerForm.valid){
      this.error = '';
      this.servicio.registro(nombre, apellido,nombre_usuario ,correo, contrasena, this.recaptchaToken).subscribe({
        next: (response) => {
            Swal.fire({
              title: "Registro exitoso",
              text: "Inicia sesión para continuar.",
              icon: "success",
              allowOutsideClick: false,
              allowEscapeKey: false,
              showCloseButton: false,
              showCancelButton: false,
              showConfirmButton: true
            }).then(() => {
              this.route.navigate(['/login']);
            });
        },
        error: (error) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Algo salió mal, por favor intente nuevamente.",
          });
        }
      });
    }else{
      this.error = 'Por favor, complete todos los campos correctamente.';
      this.registerForm.markAllAsTouched();
    }
  }
}
