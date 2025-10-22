import {
  Component,
  ChangeDetectionStrategy,
  output,
  inject,
  signal,
  input,
  effect,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { UserSettingsService } from '../../../core/services';
import { CrewType } from '../../../core/models';
import { SHIFT_CONFIG } from '../../../core/constants';

interface CrewOption {
  type: CrewType;
  title: string;
}

@Component({
  selector: 'app-crew-selection-modal',
  imports: [DialogModule, ButtonModule, CardModule],
  templateUrl: './crew-selection-modal.html',
  styleUrl: './crew-selection-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrewSelectionModal {
  private userSettingsService = inject(UserSettingsService);

  // Inputs
  visible = input<boolean>(true);
  title = input<string>('Welcome to Crew Shift');
  subtitle = input<string>('Please select which crew schedule you would like to view:');
  showFooter = input<boolean>(true);
  closable = input<boolean>(false);

  // Outputs
  crewSelected = output<CrewType>();
  visibilityChange = output<boolean>();

  // Component state
  selectedCrew = signal<CrewType | null>(null);

  constructor() {
    // Reset selection when modal becomes visible
    effect(() => {
      if (this.visible()) {
        this.selectedCrew.set(null);
      }
    });
  }

  crewOptions: CrewOption[] = Object.values(SHIFT_CONFIG.CREWS).map((crew) => ({
    type: crew.name,
    title: crew.displayName,
  }));

  async selectCrew(crew: CrewType): Promise<void> {
    this.selectedCrew.set(crew);

    if (!this.showFooter()) {
      await this.userSettingsService.updateSelectedCrew(crew);
      this.crewSelected.emit(crew);
    }
  }

  async confirmSelection(): Promise<void> {
    const crew = this.selectedCrew();
    if (crew) {
      await this.userSettingsService.updateSelectedCrew(crew);
      this.crewSelected.emit(crew);
    }
  }

  onVisibilityChange(visible: boolean): void {
    if (!visible) {
      this.visibilityChange.emit(false);
    }
  }
}
