import type { Block } from "./block";

export type CodeBlock = Block & {
    type: 'code';
    language?: string;
}
