import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePhotoDialogComponent } from './change-photo-dialog.component';

describe('ChangePhotoDialogComponent', () => {
  let component: ChangePhotoDialogComponent;
  let fixture: ComponentFixture<ChangePhotoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangePhotoDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangePhotoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
