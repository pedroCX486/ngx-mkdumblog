import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsModel } from '@shared/models/settings.model';
import { HelperService } from '@shared/services/helper.service';
import { environment } from '@env/environment';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  settings: SettingsModel;
  isProduction = environment.production;

  constructor(private router: Router, private helperService: HelperService, private titleService: Title) {
  }

  ngOnInit(): void {
    this.initialize();
  }

  initialize(): void {
    this.helperService.getSettings().toPromise()
      .then((data: SettingsModel) => this.settings = data)
      .then(() => this.titleService.setTitle(this.settings.blogTitle));
  }

  openMenu(): void {
    const element = document.getElementsByClassName('topnav')[0];
    if (element.className === 'topnav') {
      element.className += ' responsive';
    } else {
      element.className = 'topnav';
    }
  }

  isCurrentPage(url: string): boolean {
    return this.router.url === url;
  }

}
