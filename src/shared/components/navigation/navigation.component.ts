import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsModel } from '@shared/models/settings.model';
import { HelperService } from '@shared/services/helper.service';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  settings: SettingsModel;

  constructor(private router: Router, private helperService: HelperService) {
  }

  ngOnInit(): void {
    this.helperService.getConfigs().subscribe((data: SettingsModel) => this.settings = data);
  }

  openMenu(): void {
    const element = document.getElementsByClassName[0]('topnav');
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
