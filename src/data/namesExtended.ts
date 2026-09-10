import { BabyName } from '@/types/name';
import { BABY_NAMES } from './names';
import { PART1 } from './extendedNamesPart1';
import { PART2 } from './extendedNamesPart2';
import { PART3 } from './extendedNamesPart3';
import { PART4 } from './extendedNamesPart4';
import { PART5 } from './extendedNamesPart5';
import { PART6 } from './extendedNamesPart6';
import { PART7 } from './extendedNamesPart7';
import { PART8 } from './extendedNamesPart8';
import { PART9 } from './extendedNamesPart9';
import { PART10 } from './extendedNamesPart10';
import { PART11 } from './extendedNamesPart11';
import { makeSeed } from './nameSeed';

export const EXTENDED_NAMES: BabyName[] = [
  ...PART1,
  ...PART2,
  ...PART3,
  ...PART4,
  ...PART5,
  ...PART6,
  ...PART7,
  ...PART8,
  ...PART9,
  ...PART10,
  ...PART11,
].map((seed) => makeSeed(seed));

export const ALL_NAMES: BabyName[] = [...BABY_NAMES, ...EXTENDED_NAMES];