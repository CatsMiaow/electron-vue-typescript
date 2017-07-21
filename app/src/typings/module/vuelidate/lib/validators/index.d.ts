export interface Validators {
    [key: string]: any;
}

export function alpha(): void;
export function alphaNum(): void;
export function numeric(): void;
export function between(min: number, max: number): void;
export function email(): void;
export function maxLength(length: number): void;
export function minLength(length: number): void;
export function required(): void;
export function requiredIf(prop: string): void;
export function requiredUnless(prop: string): void;
export function sameAs(equalTo: string): void;
export function url(): void;
export function or(validators: Validators): void;
export function and(validators: Validators): void;
