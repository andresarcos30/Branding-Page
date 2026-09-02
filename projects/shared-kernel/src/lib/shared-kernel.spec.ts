import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedKernel } from './shared-kernel';

describe('SharedKernel', () => {
  let component: SharedKernel;
  let fixture: ComponentFixture<SharedKernel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedKernel],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedKernel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
