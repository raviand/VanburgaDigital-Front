import { Component, ViewChild } from '@angular/core';
import { Slide } from './../../../carousel/carousel.interface';
import { AnimationType } from './../../../carousel/carousel.animations';
import { CarouselComponent } from './../../../carousel/carousel.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  @ViewChild(CarouselComponent) carousel: CarouselComponent;
  animationType = AnimationType.Scale;
  animationTypes = [
    {
      name: 'Scale',
      value: AnimationType.Scale,
    },
  ];
  slides: Slide[] = [
    { src: '/assets/img/H-A.jpeg' },
    { src: '/assets/img/H-B.jpeg' },
    { src: '/assets/img/H-C.jpeg' },
    { src: '/assets/img/H-CHB.jpeg' },
    { src: '/assets/img/H-CO.jpeg' },
    { src: '/assets/img/H-CV.jpeg' },
    { src: '/assets/img/H-O.jpeg' },
    { src: '/assets/img/H-SO.jpeg' },
    { src: '/assets/img/H-SS.jpeg' },
  ];

  setAnimationType(type) {
    this.animationType = type.value;
    setTimeout(() => {
      this.carousel.onNextClick();
    });
  }

  constructor() {}

  ngOnInit(): void {}
}
