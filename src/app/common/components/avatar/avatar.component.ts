import { ChangeDetectionStrategy, Component, NgModule } from "@angular/core";
import { AvatarModule as PrimeAvatarModule } from 'primeng/avatar';

/**
 * Presentational component to display an avatar profile icon.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-avatar',
  templateUrl: './avatar.component.html'
})
export class AvatarComponent {}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [AvatarComponent],
  exports: [AvatarComponent],
  imports: [
    PrimeAvatarModule
  ]
})
export class AvatarModule {}
