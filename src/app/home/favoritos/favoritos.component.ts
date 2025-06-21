import { Component } from '@angular/core';
import { ServicioService } from '../../servicio.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './favoritos.component.html',
  styleUrl: './favoritos.component.css'
})
export class FavoritosComponent {
  videos: any[] = [];
   searchform: FormGroup
   busqueda:boolean = false
   todosLosVideos: any[] = [];
  constructor(private servicio:ServicioService){
    this.searchform = new FormGroup({
        search: new FormControl('', [])
      })
  }
  ngOnInit() {
    this.obtenerfavoritos();
  }
  obtenerfavoritos(): void {
    this.servicio.obtenerfavoritos().subscribe(
      (response) => {
        this.todosLosVideos = response.map((v: any) => ({
          ...v,
          favorito: true
        }));
        this.videos = [...this.todosLosVideos];
      },
      (error) => {
        console.error(error);
      }
    );
  }
  favorito(id:number):void{
    const video = this.videos.find(v => v.id === id);
    this.servicio.agregarfavorito(video.id,video.title,video.thumbnail,video.canal).subscribe((response) => {
      video.favorito = true;
    }, (error) => {
      console.error('Error al agregar video a favoritos:', error);
    } );
  }
  eliminarfavorito(id: string): void {
    const video = this.videos.find(v => v.video_id === id);
    console.log(id);

    this.servicio.eliminarfavorito(id).subscribe(
      () => {
        if (video) video.favorito = false;

        const videoEnTodos = this.todosLosVideos.find(v => v.video_id === id);
        if (videoEnTodos) videoEnTodos.favorito = false;
      },
      (error) => {
        console.error('Error al eliminar favorito:', error);
      }
    );
  }


  buscar(): void {
    const termino = this.searchform.value.search?.toLowerCase() || '';
    if (termino.trim() !== '') {
      this.videos = this.todosLosVideos.filter(video =>
        video.titulo.toLowerCase().includes(termino)
      );
      this.busqueda = true;
    }
  }
  restore(): void {
    this.videos = [...this.todosLosVideos];
    this.searchform.reset();
    this.busqueda = false;
  }
}
