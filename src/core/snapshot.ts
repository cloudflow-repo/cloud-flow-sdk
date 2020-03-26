import { FnParams, HttpOptions } from "./request";
import { CloudFlowService } from '../';
import _ from "lodash";

export type Snapshot = (params?: FnParams) => Promise<any> | any;

export interface SnapshotOptions {
  functionName?: string;
  defaultParams?: FnParams;
  httpOptions?: HttpOptions;
}

export interface SnapshotHub {
  [snapshotName: string]: Snapshot;
}


export function createSnapshot(client: CloudFlowService, options: SnapshotOptions): Snapshot {
  return async function(params?: FnParams): Promise<void> {
    return await client.invoke(
      options.functionName,
      _.assign({}, options.defaultParams, params),
      options.httpOptions
    );
  }
}
