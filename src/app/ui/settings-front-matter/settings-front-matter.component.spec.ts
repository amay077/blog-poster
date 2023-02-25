import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsFrontMatterComponent } from './settings-front-matter.component';

describe('SettingsFrontMatterComponent', () => {
  let component: SettingsFrontMatterComponent;
  let fixture: ComponentFixture<SettingsFrontMatterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsFrontMatterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsFrontMatterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
