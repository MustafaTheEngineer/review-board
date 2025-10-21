import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiPlatform } from '@taiga-ui/cdk';
import { TuiAppearance, TuiButton, TuiTextfield, TuiTitle } from '@taiga-ui/core';
import { TuiBadge, TuiInputPin } from '@taiga-ui/kit';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';

@Component({
  selector: 'app-confirm-account',
  imports: [
    FormsModule,
    TuiInputPin,
    TuiTextfield,
    TuiAppearance,
    TuiBadge,
    TuiButton,
    TuiCardLarge,
    TuiHeader,
    TuiPlatform,
    TuiTitle,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './confirm-account.html',
  styleUrl: './confirm-account.less',
  host: {
    style: `
      display: flex;
      justify-content: center;
      height: 100vh;

    `,
  },
})
export class ConfirmAccount {
  protected value = signal('');
}
