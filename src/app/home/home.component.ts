import { Component,OnInit } from '@angular/core';
import { YoutubeService } from './youtube.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  videos: any[] = [];
  constructor(private youtubeService: YoutubeService) {}
  ngOnInit() {
    this.youtubeService.searchVideos('tendencias').subscribe((videos) => {
      this.videos = videos;
    });
  }
}
