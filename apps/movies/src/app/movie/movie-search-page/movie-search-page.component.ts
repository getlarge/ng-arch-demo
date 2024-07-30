import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';
import { Observable, switchMap } from 'rxjs';

import { TMDBMovieModel } from '../../shared/model/movie.model';
import { Suspensify, suspensify } from '../../shared/suspensify';
import { MovieService } from '../movie.service';
import { MovieListComponent } from '../movie-list/movie-list.component';

@Component({
  selector: 'movie-search-page',
  template: `
    @if (movies$ | async; as state) {
      @if (state.suspense) {
        <div class="loader"></div>
      } @else if (state.error) {
        <h2>An error occurred</h2>
        <p>{{ state.error.name }}: {{ state.error.message }}</p>
        <div><fast-svg name="sad" size="350" /></div>
      } @else {
        <movie-list [movies]="state.data" />
      }
    }
  `,
  standalone: true,
  imports: [MovieListComponent, AsyncPipe, FastSvgComponent],
})
export class MovieSearchPageComponent {
  private movieService = inject(MovieService);
  private activatedRoute = inject(ActivatedRoute);

  movies$: Observable<Suspensify<TMDBMovieModel[]>> =
    this.activatedRoute.params.pipe(
      switchMap((params) =>
        this.movieService
          .searchMovies(params['query'])
          .pipe(suspensify([] as TMDBMovieModel[], { count: 2, delay: 1000 })),
      ),
    );
}
