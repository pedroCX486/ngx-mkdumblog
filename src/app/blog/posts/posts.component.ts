import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { PostModel } from '@shared/models/post.model';
import { SettingsModel } from '@shared/models/settings.model';
import { HelperService } from '@shared/services/helper.service';


@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  urlParams = new URLSearchParams(window.location.search);
  content: PostModel = new PostModel();
  settings: SettingsModel;

  constructor(private titleService: Title, private helperService: HelperService) {
  }

  ngOnInit(): void {
    this.helperService.getConfigs().subscribe((data: SettingsModel) => this.settings = data);

    if (this.urlParams.get('post')) {
      this.loadPost();
    }
  }

  loadPost(): void {
    this.helperService.getJSON('./assets/posts/' + this.urlParams.get('post') + '.json').toPromise().then(data => {
      this.content = data;
      this.content.timestamp = !!this.content.timestamp ? new Date(data.timestamp * 1000).toUTCString() : '';
      this.content.editedTimestamp = !!this.content.editedTimestamp ? new Date(data.editedTimestamp * 1000).toUTCString() : '';
      this.titleService.setTitle(this.content.postTitle + ' - ' + this.settings.blogTitle);
    }).then(() => {
      if (this.settings.enableDisqus) {
        this.loadDisqus();
      }
    }).catch(error => {
      this.content.postTitle = 'Whoops!';
      this.content.postContent = 'We couldn\'t load this post! <strong>(' + error.status + ' ' + error.statusText + ')</strong>';
    });
  }

  loadDisqus(): void {
    const body = document.body as HTMLDivElement;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = './assets/disqus.js';
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }
}
