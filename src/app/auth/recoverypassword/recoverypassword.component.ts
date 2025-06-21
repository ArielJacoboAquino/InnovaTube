import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServicioService } from '../../servicio.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-recoverypassword',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './recoverypassword.component.html',
  styleUrl: './recoverypassword.component.css'
})
export class RecoverypasswordComponent {
  recoveryform : FormGroup
  error: string = ''
  constructor(private router: Router, private servicio: ServicioService){
    this.recoveryform = new FormGroup({
      correo : new FormControl('', [Validators.required, Validators.email]),
      nuevacontrasena : new FormControl('', [Validators.required, Validators.minLength(6)]),
      nuevacontrasenac : new FormControl('', [Validators.required, Validators.minLength(6)])
    })
  }

  recuperar(): void {
  Swal.fire({
    title: "Cargando...",
    text: "Estamos procesando tu solicitud.",
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  const { correo, nuevacontrasena, nuevacontrasenac } = this.recoveryform.value;

  if (nuevacontrasena !== nuevacontrasenac) {
    this.error = 'Las contraseñas no coinciden';
    this.recoveryform.get('nuevacontrasenac')?.setErrors({ mismatch: true });
    this.recoveryform.markAsTouched();
    Swal.close();
    return;
  }

  this.servicio.verificarcorreo(correo).subscribe({
    next: (response) => {
      if (response.existe === true) {
        this.servicio.cambiarcontrasena(correo, nuevacontrasena).subscribe({
          next:(response) =>{
            Swal.close();
            Swal.fire({
              title: "Cambio exitoso",
              text: "Inicia sesión para continuar.",
              icon: "success",
              allowOutsideClick: false,
              allowEscapeKey: false,
              showConfirmButton: true
            }).then(() => {
              this.router.navigate(['/login']);
            });
          },error: (error)=>{
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: error.mensaje || "Algo salió mal, por favor intente nuevamente.",
            });
          }

        });
      } else {
        Swal.close();
        this.error = 'El correo electrónico no está registrado';
      }
    },
    error: (error) => {
      Swal.close();
      console.error(error);
      this.error = 'Error al verificar el correo';
    }
  });
}

}
