import { BaseError } from 'galat';

export class RouterError extends BaseError<'PATH_UNSET' | 'METHOD_UNSET'> {}
