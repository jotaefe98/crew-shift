import { Component, ChangeDetectionStrategy, input, signal, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CrewType } from '../../../core/models';
import { SHIFT_CONFIG } from '../../../core/constants';
import { SettingsModal } from '../settings-modal/settings-modal';
import { CrewSelectionModal } from '../crew-selection-modal/crew-selection-modal';

@Component({
  selector: 'app-crew-info',
  imports: [ButtonModule, SettingsModal, CrewSelectionModal],
  templateUrl: './crew-info.html',
  styleUrl: './crew-info.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrewInfo {
  currentCrew = input.required<CrewType>();

  // Outputs
  crewChanged = output<CrewType>();

  // Settings modal
  showSettingsModal = signal(false);

  // Crew selection modal
  showCrewSelectionModal = signal(false);

  getCrewDisplayName(): string {
    return SHIFT_CONFIG.CREWS[this.currentCrew()].displayName;
  }

  openSettings(event?: Event): void {
    if (event) {
      this.preventZoom(event);
    }
    this.showSettingsModal.set(true);
  }

  onSettingsModalVisibilityChange(visible: boolean): void {
    this.showSettingsModal.set(visible);
  }

  openCrewSelection(event?: Event): void {
    if (event) {
      this.preventZoom(event);
    }
    this.showCrewSelectionModal.set(true);
  }

  onCrewSelected(crew: CrewType): void {
    this.showCrewSelectionModal.set(false);
    this.crewChanged.emit(crew);
  }

  onCrewSelectionModalVisibilityChange(visible: boolean): void {
    this.showCrewSelectionModal.set(visible);
  }

  // Prevent zoom on fast taps
  private preventZoom(event: Event): void {
    // Prevent default behavior that might trigger zoom
    if (event.type === 'touchend' || event.type === 'touchstart') {
      event.preventDefault();
    }
    event.stopPropagation();

    // Additional touch handling for mobile
    const target = event.target as HTMLElement;
    if (target) {
      target.style.touchAction = 'manipulation';

      // Ensure no highlight or callout appears using setProperty for webkit properties
      target.style.setProperty('-webkit-tap-highlight-color', 'transparent');
      target.style.setProperty('-webkit-touch-callout', 'none');
    }

    // Add a small delay to prevent double-tap detection
    const button = (event.target as HTMLElement)?.closest('.p-button') as HTMLElement;
    if (button) {
      button.style.pointerEvents = 'none';
      setTimeout(() => {
        button.style.pointerEvents = 'auto';
      }, 300);
    }
  }
}
