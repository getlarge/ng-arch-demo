import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';
import { filter } from 'rxjs';

import { MovieService } from '../movie/movie.service';
import { DarkModeToggleComponent } from '../ui/component/dark-mode-toggle/dark-mode-toggle.component';
import { HamburgerButtonComponent } from '../ui/component/hamburger-button/hamburger-button.component';
import { SearchBarComponent } from '../ui/component/search-bar/search-bar.component';
import { SideDrawerComponent } from '../ui/component/side-drawer/side-drawer.component';

@Component({
  selector: 'app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss'],
  standalone: true,
  imports: [
    SideDrawerComponent,
    RouterLinkActive,
    RouterLink,
    FastSvgComponent,
    HamburgerButtonComponent,
    SearchBarComponent,
    FormsModule,
    DarkModeToggleComponent,
    AsyncPipe,
  ],
})
export class AppShellComponent {
  private movieService = inject(MovieService);
  private router = inject(Router);

  genres$ = this.movieService.getGenres();

  sideDrawerOpen = false;

  private _searchValue = '';
  set searchValue(value: string) {
    this._searchValue = value;
    this.router.navigate(['search', value]);
  }
  get searchValue(): string {
    return this._searchValue;
  }

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.sideDrawerOpen = false;
      });
  }
}
