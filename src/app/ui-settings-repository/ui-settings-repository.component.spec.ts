import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiSettingsRepositoryComponent } from './ui-settings-repository.component';

describe('UiSettingsRepositoryComponent', () => {
  let component: UiSettingsRepositoryComponent;
  let fixture: ComponentFixture<UiSettingsRepositoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UiSettingsRepositoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiSettingsRepositoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
