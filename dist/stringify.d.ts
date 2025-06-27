interface Builder {
    (part: string, node?: any, type?: 'start' | 'end'): void;
}
export interface Stringifier {
    (node: any, builder: Builder): void;
}
export declare const stringify: Stringifier;
export {};
