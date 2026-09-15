import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit{
  places = signal<Place[] | undefined>(undefined);
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.isLoading.set(true);
    const subscription = this.httpClient.get<{ places: Place[] }>('http://localhost:3000/places')
      .pipe(
        map(response => response.places)
      )
      .subscribe({
        next: places => {
          this.places.set(places);
        },
        complete: () => this.isLoading.set(false),
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
