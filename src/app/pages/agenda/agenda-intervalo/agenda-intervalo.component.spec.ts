import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaIntervaloComponent } from './agenda-intervalo.component';

describe('AgendaIntervaloComponent', () => {
  let component: AgendaIntervaloComponent;
  let fixture: ComponentFixture<AgendaIntervaloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgendaIntervaloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaIntervaloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
