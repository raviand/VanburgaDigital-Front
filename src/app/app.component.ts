import { Component, ViewChild } from '@angular/core';
import { CarouselComponent } from './carousel/carousel.component';
import { AnimationType } from './carousel/carousel.animations';
import { Slide } from './carousel/carousel.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'vanburga-digital';
  @ViewChild(CarouselComponent) carousel: CarouselComponent;
  animationType = AnimationType.Scale;
  animationTypes = [
    {
      name: 'Scale',
      value: AnimationType.Scale,
    },
  ];
  slides: Slide[] = [
    {
      src:
        'https://drive.google.com/drive/u/0/folders/1p8HBri0OOhiYrGBbzl4jb8L2sI6YQ3dX',
    },
    {
      src: 'assetsimgBurga.PNG',
    },
    {
      src:
        'https://images.unsplash.com/photo-1557800634-7bf3c7305596?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2001&q=80',
    },
    {
      src:
        'https://images.unsplash.com/photo-1567653418876-5bb0e566e1c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80',
    },
    { src: 'assetsimgSweet Onion.jpeg' },
    { src: 'assetsimgSmoke Shack.jpeg' },
    { src: 'assetsimgOklahoma.jpeg' },
    { src: 'assetsimgCuarto Vanburga.jpeg' },
  ];
  constructor() {
  }

  setAnimationType(type) {
    this.animationType = type.value;
    setTimeout(() => {
      this.carousel.onNextClick();
    });
  }

  onActivate(event) {
    window.scroll(0,0);
}
}
