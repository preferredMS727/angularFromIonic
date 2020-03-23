import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlerthomeComponent } from './alerthome.component';

describe('AlerthomeComponent', () => {
  let component: AlerthomeComponent;
  let fixture: ComponentFixture<AlerthomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlerthomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlerthomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
