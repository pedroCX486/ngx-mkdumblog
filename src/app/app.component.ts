import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Settings } from '@shared/constants/settings';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  settings = new Settings;
  urlParams = new URLSearchParams(window.location.search);

  constructor(private titleService: Title, private router: Router) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.settings.blogTitle);

    if (this.urlParams.get('post')) {
      this.router.navigate(['/blog/posts'], { queryParams: { post: this.urlParams.get('post') }, skipLocationChange: true });
    } else {
      switch (this.urlParams.get('page')) {
        case 'editor':
          this.router.navigate(['/editor'], { skipLocationChange: true });
          break;
        case 'archives':
          this.router.navigate(['/blog/archives'], { skipLocationChange: true });
          break;
        default:
          this.router.navigate(['/blog'], { skipLocationChange: true });
          break;
      }
    }
  }

  navigate(arg) {
    this.router.navigate([arg], { skipLocationChange: true });
  }

}
