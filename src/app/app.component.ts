import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ServicioService } from './servicio.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  username: string = '';
  islogin: boolean = false;
  constructor(private router:Router, private servicio: ServicioService){}
  cerrarsesion():void{
    this.servicio.cerrarsesion();
    this.router.navigate(['login'])
  }
  ngOnInit():void{
    this.username = this.servicio.getUsuario() || 'usuario no encontrado';
    this.verficarSesion();
    this.servicio.ejecutarFuncionApp$.subscribe(() => {
      this.cambiarlogin();
    });
  }
  verficarSesion(){
    const rutaActual = this.router.url;
    if(this.servicio.sesionActiva()){
      this.islogin = true
    }else{
      this.islogin = false;
      this.servicio.cerrarsesion();
      if (rutaActual === '/home' || rutaActual === '/favoritos') {
        this.router.navigate(['login']);
      }
    }
  }
  cambiarlogin():void{
    this.islogin = !this.islogin;
    this.username = this.servicio.getUsuario() || 'usuario no encontrado';
  }
}
