import { Schema } from 'joi';

export interface ValidationSchema {
  body?: Schema;
  params?: Schema;
  query?: Schema;
}
