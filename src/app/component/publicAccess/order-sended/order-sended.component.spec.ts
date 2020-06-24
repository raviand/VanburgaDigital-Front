import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSendedComponent } from './order-sended.component';

describe('OrderSendedComponent', () => {
  let component: OrderSendedComponent;
  let fixture: ComponentFixture<OrderSendedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderSendedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderSendedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
