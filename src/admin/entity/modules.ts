import type { EntityAttributeModule } from './types';
import { RelationshipAttributeModule } from './relationship/module';
import { InputAttributeModule } from './input/module';
import { FileAttributeModule } from './file/module';
import { EmbedAttributeModule } from './embed/module';
import { SelectAttributeModule } from './select/module';
import { SwitchAttributeModule } from './switch/module';

export type AttributeModuleDict = {
  [type: string]: EntityAttributeModule<any>;
}

export const attributeModuleDict: AttributeModuleDict = {
  'relationship:belongs_to': RelationshipAttributeModule,
  'relationship:belongs_to_many': RelationshipAttributeModule,

  'text': InputAttributeModule,
  'number': InputAttributeModule,

  'file': FileAttributeModule,
  'embed': EmbedAttributeModule,
  'select': SelectAttributeModule,
  'switch': SwitchAttributeModule
}
