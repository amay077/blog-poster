import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsRepositoryComponent } from './settings-repository.component';

describe('SettingsRepositoryComponent', () => {
  let component: SettingsRepositoryComponent;
  let fixture: ComponentFixture<SettingsRepositoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsRepositoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsRepositoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
