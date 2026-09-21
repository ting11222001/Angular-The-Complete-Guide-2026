import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit{
  places = signal<Place[] | undefined>(undefined);
  private destroyRef = inject(DestroyRef);
  isLoading = signal<boolean>(false);
  error = signal<string>('');
  private placesService = inject(PlacesService);

  ngOnInit(): void {
    this.isLoading.set(true);
    const subscription = this.placesService.loadAvailablePlaces()
      .subscribe({        // better subscribe to the observable returned by loadAvailablePlaces in the component
        next: places => { // I can also easily update the UI based on the state of the observable
          this.places.set(places);
        },
        error: (error: Error) => {
          this.error.set(error.message);
        },
        complete: () => this.isLoading.set(false),
      });

    this.destroyRef.onDestroy(() => { // so that I can unsubscribe from the observable when the component is destroyed
      subscription.unsubscribe();
    });
  }

  onSelectPlace(selectedPlace: Place) {
    console.log('=== AvailablePlacesComponent === onSelectPlace: ', selectedPlace);

    const subscription = this.placesService.addPlaceToUserPlaces(selectedPlace).subscribe({
      next: (response) => console.log('User places:', response),
      complete: () => console.log('Place added to user places successfully.'),
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
