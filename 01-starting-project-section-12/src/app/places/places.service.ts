import { inject, Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { catchError } from 'rxjs/internal/operators/catchError';
import { map } from 'rxjs/internal/operators/map';
import { throwError } from 'rxjs/internal/observable/throwError';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/internal/operators/tap';
import { ErrorService } from '../shared/error.service';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);
  private httpClient = inject(HttpClient);
  private errorService = inject(ErrorService);

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchPlaces(
      'http://localhost:3000/places', 
      'Failed to fetch available places. Please try again later.'
    );
  }

  loadUserPlaces() {
    return this.fetchPlaces(
      'http://localhost:3000/user-places', 
      'Failed to fetch your favorite places. Please try again later.'
    ).pipe( // I can pipe here again even though I already piped in fetchPlaces, because the return value of fetchPlaces is an observable
      tap({
        next: (userPlaces) => this.userPlaces.set(userPlaces), // I can update the userPlaces signal with the fetched user places without subscribing here
      })
    );
  }

  addPlaceToUserPlaces(place: Place) {
    const prevPlaces = this.userPlaces(); // prepare the rollback in case the HTTP request fails

    // only add the place to the userPlaces signal if it is not already in the list
    if (!prevPlaces.some(p => p.id === place.id)) {
      this.userPlaces.set([ ...prevPlaces, place ]);
    }

    return this.httpClient.put('http://localhost:3000/user-places', {
      placeId: place.id,
    }).pipe(
      catchError(error => {
        this.userPlaces.set(prevPlaces); // rollback the userPlaces signal to the previous state if the HTTP request fails
        this.errorService.showError('Failed to add place to your favorite places.');
        return throwError(() => new Error('Failed to add place to your favorite places.'));
      })
    );
  }

  removeUserPlace(place: Place) {
    const prevPlaces = this.userPlaces();

    // optimistically remove the place from the userPlaces signal
    if (prevPlaces.some(p => p.id === place.id)) {
      this.userPlaces.set(prevPlaces.filter(p => p.id !== place.id)); // filter means keeping all the places that are not the one we want to remove
    }

    return this.httpClient.delete(`http://localhost:3000/user-places/${place.id}`)
    .pipe(
      catchError(error => {
        this.userPlaces.set(prevPlaces);
        this.errorService.showError('Failed to remove place from your favorite places.');
        return throwError(() => new Error('Failed to remove place from your favorite places.'));
      })
    );
  }

  // added a private method to fetch places from the backend, and use it in loadAvailablePlaces and loadUserPlaces
  private fetchPlaces(url: string, errorMessage: string) {
    return this.httpClient.get<{ places: Place[] }>(url)
        .pipe(
          map(response => response.places),
          catchError(error => {
            console.log('Error fetching places:', error);
            return throwError(
              () => new Error(errorMessage)
            );
          })
        )
  }
}
