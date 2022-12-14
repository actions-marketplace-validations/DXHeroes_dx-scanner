/* eslint-disable @typescript-eslint/no-explicit-any */
import { CliUx } from '@oclif/core';
import { debugLog } from '../../detectors/utils';
import { assertNever } from '../assertNever';
import { ErrorCode } from './model';
import { ServiceError } from './ServiceError';
const d = debugLog('errorHandler');

export const errorHandler = (error: Error) => {
  CliUx.ux.action.stop();

  if (error instanceof ServiceError) {
    switch (error.code) {
      case ErrorCode.AUTHORIZATION_ERROR:
        d(error.message);
        d(error.stack);
        process.exit(1); //mandatory (as per the Node.js docs)
      case ErrorCode.SERVICE_ERROR:
      case ErrorCode.NOT_IMPLEMENTED_ERROR:
      case ErrorCode.INTERNAL_ERROR:
      case ErrorCode.ARGUMENT_ERROR:
      case ErrorCode.PRACTICE_EVALUATION_ERROR:
        d(error);
        CliUx.ux.error(error);
      default:
        assertNever(error.code);
    }
  }

  d(error);
  throw error;
};
