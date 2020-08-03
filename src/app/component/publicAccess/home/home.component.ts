import { Component, ViewChild } from '@angular/core';
import { Slide } from 'src/app/component/publicAccess/carousel/carousel.interface';
import { AnimationType } from 'src/app/component/publicAccess/carousel/carousel.animations';
import { CarouselComponent } from 'src/app/component/publicAccess/carousel/carousel.component';

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
    { src: '/assets/img/H-AR.jpeg' },
    { src: '/assets/img/H-B.jpeg' },
    { src: '/assets/img/H-CH.jpeg' },
    { src: '/assets/img/H-CL.jpeg' },
    { src: '/assets/img/H-CR.jpeg' },
    { src: '/assets/img/H-CV.jpeg' },
    { src: '/assets/img/H-OK.jpeg' },
    { src: '/assets/img/H-SM.jpeg' },
    { src: '/assets/img/H-SW.jpeg' },
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
