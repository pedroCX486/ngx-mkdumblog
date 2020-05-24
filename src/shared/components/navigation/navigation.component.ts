import { Component, OnInit } from '@angular/core';
import { Settings } from '../../constants/settings'
import { Router } from '@angular/router';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  settings = Settings;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  openMenu(): void  {
    var element = document.getElementsByClassName[0]("topnav");
    if (element.className === "topnav") {
      element.className += " responsive";
    } else {
      element.className = "topnav";
    }
  }

  isCurrentPage(url) : boolean {
    return this.router.url === url;
  }

}
