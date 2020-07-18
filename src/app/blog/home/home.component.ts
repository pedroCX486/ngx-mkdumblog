import { Component, OnInit } from '@angular/core';
import { ArchiveModel } from '@shared/models/archive.model';
import { PostModel } from '@shared/models/post.model';
import { SettingsModel } from '@shared/models/settings.model';
import { HelperService } from '@shared/services/helper.service';
import * as showdown from 'showdown';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  contents: PostModel[] = [];
  archives: ArchiveModel[] = [];
  settings: SettingsModel;
  postsLoaded = 0;

  showdownmd;

  constructor(public helperService: HelperService) {
  }

  ngOnInit(): void {
    this.showdownmd = new showdown.Converter();

    this.helperService.getSettings().toPromise()
      .then((data: SettingsModel) => this.settings = data)
      .then(() => this.loadArchive());
  }

  loadArchive(): void {
    this.helperService.getJSON('./assets/posts/archive.json').toPromise().then(data => {
      this.archives = data;
      this.settings.maxPosts = this.archives.length < this.settings.maxPosts ? this.archives.length : this.settings.maxPosts;
    }).then(() => this.loadPosts());
  }

  loadPosts(): void {
    if (this.postsLoaded < this.settings.maxPosts) {
      this.helperService.getJSON('./assets/posts/' + this.archives[this.postsLoaded].filename + '.json').toPromise().then(data => {
        this.contents.push(data);
      }).then(() => {
        this.continue();
      }).catch(error => {
        this.continue(error);
      });
    }
  }

  continue(error?: any): void {
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

  generateHTML(markdown: string): void {
    return this.showdownmd.makeHtml(markdown);
  }
}
