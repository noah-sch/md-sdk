import type { Block } from "./block";

export type TextBlock = Block & {
    type: 'text';
}