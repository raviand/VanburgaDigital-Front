import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorCocinaComponent } from './monitor-cocina.component';

describe('MonitorCocinaComponent', () => {
  let component: MonitorCocinaComponent;
  let fixture: ComponentFixture<MonitorCocinaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitorCocinaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorCocinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
