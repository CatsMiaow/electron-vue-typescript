import EncodingDown from 'encoding-down';
import { LevelUp } from 'levelup';

export type Database = LevelUp<EncodingDown>;
