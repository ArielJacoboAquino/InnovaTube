import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class YoutubeService {

  private apiKey = 'AIzaSyBohx6RkMQzqJUN8e9Aopl7IFOx28UnWzc';
  private apiUrl = 'https://www.googleapis.com/youtube/v3/search';

  constructor(private http: HttpClient) {}

  searchVideos(query: string = 'angular') {
    const url = `${this.apiUrl}?part=snippet&q=${query}&type=video&maxResults=10&key=${this.apiKey}`;
    return this.http.get<any>(url).pipe(
      map((response) =>
        response.items.map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.medium.url
        }))
      )
    );
  }
}
