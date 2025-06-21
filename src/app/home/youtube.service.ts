import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class YoutubeService {

  private apiKey = 'AIzaSyCDOQn41iKI9p3HUth2Xgd6JnLvaScsMC0';
  private apiUrl = 'https://www.googleapis.com/youtube/v3/search';

  constructor(private http: HttpClient) {}

  searchVideos(query: string = 'angular') {
    const url = `${this.apiUrl}?part=snippet&q=${query}&type=video&maxResults=20&key=${this.apiKey}`;
    return this.http.get<any>(url).pipe(
      map((response) =>
        response.items.map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.medium.url,
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
          canal: item.snippet.channelTitle
        }))
      )
    );
  }
}
