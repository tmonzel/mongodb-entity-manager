import type { EntityAttributeModule } from '../types';
import SwitchAttributeControl from './SwitchAttributeControl.svelte';
import type { SwitchAttribute } from './types';

export const SwitchAttributeModule: EntityAttributeModule<SwitchAttribute> = {
  edit: SwitchAttributeControl
}
