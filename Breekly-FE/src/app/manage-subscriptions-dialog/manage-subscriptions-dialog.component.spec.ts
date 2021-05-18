import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSubscriptionsDialogComponent } from './manage-subscriptions-dialog.component';

describe('ManageSubscriptionsDialogComponent', () => {
  let component: ManageSubscriptionsDialogComponent;
  let fixture: ComponentFixture<ManageSubscriptionsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageSubscriptionsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSubscriptionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
