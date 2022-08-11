import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaCreateComponent } from './agenda-create.component';

describe('AgendaCreateComponent', () => {
  let component: AgendaCreateComponent;
  let fixture: ComponentFixture<AgendaCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgendaCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
