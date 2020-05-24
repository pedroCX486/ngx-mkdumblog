import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ArchiveModel } from '@shared/models/archive.model';
import { PostModel } from '@shared/models/post.model';
import { Settings } from '@shared/constants/settings';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  contents: PostModel[] = [];
  archives: ArchiveModel[] = [];
  settings = Settings;
  postsLoaded = 0;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.loadArchive();
  }

  loadArchive() {
    this.getJSON('./assets/posts/archive.json').toPromise().then(data => {
      this.archives = data;
      this.settings.maxPosts = this.archives.length < this.settings.maxPosts ? this.archives.length : this.settings.maxPosts;
    }).then(data => this.loadPosts());
  }

  loadPosts() {
    if (this.postsLoaded < this.settings.maxPosts) {
      this.getJSON('./assets/posts/' + this.archives[this.postsLoaded].filename + '.json').toPromise().then(data => {
        this.contents.push(data);
      }).then(data => {
        this.continue();
      }).catch(error => {
        this.continue(error);
      });
    }
  }

  continue(error?) {
    if (error) {
      const errorPost = new PostModel();
      errorPost.postTitle = 'Aw shucks!';
      errorPost.postContent = 'We couldn\'t load this post! Sorry! <strong>(' + error.status + ' ' + error.statusText + ')</strong>';
      errorPost.filename = 'not-found';
      this.contents.push(errorPost);
    }

    this.postsLoaded += 1;
    this.loadPosts();
  }

  parseTimestamp(timestamp) {
    return new Date(timestamp * 1000).toUTCString();
  }

  getJSON(arg): Observable<any> {
    return this.http.get(arg);
  }
}
