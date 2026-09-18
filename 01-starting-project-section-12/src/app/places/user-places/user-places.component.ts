import { Component, DestroyRef, inject, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { HttpClient } from '@angular/common/http';
import { Place } from '../place.model';
import { catchError } from 'rxjs/internal/operators/catchError';
import { map } from 'rxjs/internal/operators/map';
import { throwError } from 'rxjs/internal/observable/throwError';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent {
  places = signal<Place[] | undefined>(undefined);
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  isLoading = signal<boolean>(false);
  error = signal<string>('');

   ngOnInit(): void {
      this.isLoading.set(true);
      const subscription = this.httpClient.get<{ places: Place[] }>('http://localhost:3000/user-places')
        .pipe(
          map(response => response.places),
          catchError(error => {
            console.log('Error fetching places:', error);
            return throwError(
              () => new Error('Failed to fetch your favorite places. Please try again later.')
            );
          })
        )
        .subscribe({
          next: places => {
            this.places.set(places);
          },
          error: (error: Error) => {
            this.error.set(error.message);
          },
          complete: () => this.isLoading.set(false),
        });
  
      this.destroyRef.onDestroy(() => {
        subscription.unsubscribe();
      });
    }
}
