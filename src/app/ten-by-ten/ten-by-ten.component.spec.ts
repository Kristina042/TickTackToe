import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenByTenComponent } from './ten-by-ten.component';

describe('TenByTenComponent', () => {
  let component: TenByTenComponent;
  let fixture: ComponentFixture<TenByTenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenByTenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenByTenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
