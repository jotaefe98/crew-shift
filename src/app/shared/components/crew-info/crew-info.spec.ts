import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrewInfo } from './crew-info';
import { CrewType } from '../../../core/models';
import { SHIFT_CONFIG } from '../../../core/constants';

describe('CrewInfo', () => {
  let component: CrewInfo;
  let fixture: ComponentFixture<CrewInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrewInfo],
    }).compileComponents();

    fixture = TestBed.createComponent(CrewInfo);
    component = fixture.componentInstance;

    // Set required input
    fixture.componentRef.setInput('currentCrew', CrewType.DAVID);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display crew name correctly', () => {
    const crewDisplayName = component.getCrewDisplayName();
    expect(crewDisplayName).toBe(SHIFT_CONFIG.CREWS[CrewType.DAVID].displayName);
  });

  it('should open crew selection modal when crew name is clicked', () => {
    expect(component.showCrewSelectionModal()).toBe(false);

    component.openCrewSelection();

    expect(component.showCrewSelectionModal()).toBe(true);
  });

  it('should open settings modal when settings button is clicked', () => {
    expect(component.showSettingsModal()).toBe(false);

    component.openSettings();

    expect(component.showSettingsModal()).toBe(true);
  });

  it('should emit crewChanged when crew is selected', () => {
    spyOn(component.crewChanged, 'emit');

    component.onCrewSelected(CrewType.TREVOR);

    expect(component.crewChanged.emit).toHaveBeenCalledWith(CrewType.TREVOR);
    expect(component.showCrewSelectionModal()).toBe(false);
  });

  it('should close modal when visibility changes', () => {
    component.showCrewSelectionModal.set(true);

    component.onCrewSelectionModalVisibilityChange(false);

    expect(component.showCrewSelectionModal()).toBe(false);
  });
});
