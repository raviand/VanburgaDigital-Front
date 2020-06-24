import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogExtraComponent } from './dialog-extra.component';

describe('DialogExtraComponent', () => {
  let component: DialogExtraComponent;
  let fixture: ComponentFixture<DialogExtraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogExtraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogExtraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
