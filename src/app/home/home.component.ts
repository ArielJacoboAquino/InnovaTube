import { Component,OnInit } from '@angular/core';
import { YoutubeService } from './youtube.service';
import { CommonModule } from '@angular/common';
import { ServicioService } from '../servicio.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  videos: any[] = [];
  searchform: FormGroup
  busqueda: boolean = false;
  constructor(private youtubeService: YoutubeService, private servicio: ServicioService, private router: Router) {
    this.searchform = new FormGroup({
      search: new FormControl('', [])
    })
  }
  ngOnInit() {
    this.verficarsesion();
    this.cargarVideosConFavoritos();
    this.obtenerfavoritos();
  }
  verficarsesion():void{
    if (this.servicio.sesionActiva()) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/login']);
    }
  }
  marcarFavoritos(videos: any[], favoritos: any[]): any[] {
    return videos.map(video => {
      const esFavorito = favoritos.some(fav => fav.video_id === video.id);
      return { ...video, favorito: esFavorito };
    });
  }
  cargarVideosConFavoritos(termino: string = 'tendencias'): void {
    this.servicio.obtenerfavoritos().subscribe(favoritos => {
      this.youtubeService.searchVideos(termino).subscribe(videos => {
        this.videos = this.marcarFavoritos(videos, favoritos);
      });
    });
  }
  buscar() {
    const parametro = this.searchform.value.search;
    this.cargarVideosConFavoritos(parametro);
    this.busqueda = true;
  }

  restore() {
    this.cargarVideosConFavoritos();
    this.busqueda = false;
  }

  favorito(id:number):void{
    const video = this.videos.find(v => v.id === id);
    this.servicio.agregarfavorito(video.id,video.title,video.thumbnail,video.canal).subscribe((response) => {
      video.favorito = true;
    }, (error) => {
      console.error('Error al agregar video a favoritos:', error);
    } );
  }
  eliminarfavorito(id:string):void{
     const video = this.videos.find(v => v.id === id);
    this.servicio.eliminarfavorito(id).subscribe((response) => {
      video.favorito = false;
    }, (error) => {
      console.error('Error al eliminar video de favoritos:', error);
    });
  }
  obtenerfavoritos():void{
    this.servicio.obtenerfavoritos().subscribe((response) => {

    }, (error) => {

    });
  }
}
