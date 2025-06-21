import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject, switchMap, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  private apiUrl: string = environment.apiUrl
  private ejecutarFuncionApp = new Subject<void>();
  constructor(private http: HttpClient) { }
  ejecutarFuncionApp$ = this.ejecutarFuncionApp.asObservable();
  registro(nombre: string,apellido:string,nombre_usuario:string, correo:string,contrasena:string,recaptcha_token:string): Observable<any> {
      return this.http.post(`${this.apiUrl}register`, { nombre,apellido,nombre_usuario,correo,contrasena,recaptcha_token });
  }
  login(dato: string, contrasena: string): Observable<any> {
    return this.http.post(`${this.apiUrl}login`, { dato, contrasena });
  }
  verificarcorreo(correo:string): Observable<any> {
    return this.http.post(`${this.apiUrl}verificar-correo`, { correo });
  }
  cambiarcontrasena(correo: string, nuevacontrasena: string): Observable<any> {
    return this.http.post(`${this.apiUrl}cambiar-contrasena`, { correo, nuevacontrasena });
  }
  agregarfavorito(video_id:number,titulo:string,thumbnail:string,canal:string): Observable<any>{
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
     return this.http.post(`${this.apiUrl}favoritos`, { video_id, titulo, thumbnail, canal },{ headers });
  }
  eliminarfavorito(video_id:string): Observable<any>{
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.delete(`${this.apiUrl}favoritos/${video_id}`,{ headers });
  }
  obtenerfavoritos(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.get(`${this.apiUrl}favoritos`, { headers });
  }

  guardardatos(usuario:string, token:string,inicio:Date):void{
    localStorage.setItem('usuario', usuario);
    localStorage.setItem('token', token);
    localStorage.setItem('inicio', inicio.toString());
  }
  cambiarlogin() {
    this.ejecutarFuncionApp.next();
  }
  cerrarsesion():void{
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    localStorage.removeItem('inicio');
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  getUsuario(): string | null {
    return localStorage.getItem('usuario');
  }
  private getInicio(): Date | null {
    const inicio = localStorage.getItem('inicio');
    return inicio ? new Date(inicio) : null;
  }
  sesionActiva(): boolean {
    const horainicio = this.getInicio();
    if (horainicio != null) {
      const horaactual = new Date();
      const diferencia = horaactual.getTime() - horainicio.getTime();
      const minutos = Math.floor(diferencia / 1000 / 60);
      return minutos < 30;
    } else {
      return false;
    }
  }
}
