import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiSettingsFrontMatterComponent } from './ui-settings-front-matter.component';

describe('UiSettingsFrontMatterComponent', () => {
  let component: UiSettingsFrontMatterComponent;
  let fixture: ComponentFixture<UiSettingsFrontMatterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UiSettingsFrontMatterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiSettingsFrontMatterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
