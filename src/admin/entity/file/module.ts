import type { EntityAttributeModule } from '../types';
import FileAttributeControl from './FileAttributeControl.svelte';
import FileAttributeValue from './FileAttributeValue.svelte';
import type { FileAttribute } from './types';

export const FileAttributeModule: EntityAttributeModule<FileAttribute> = {
  edit: FileAttributeControl,
  value: FileAttributeValue
}
