import { FnParams, HttpOptions, request } from './core/request';
import { SnapshotHub, Snapshot, createSnapshot, SnapshotOptions } from './core/snapshot';
import _ from 'lodash';


export interface CloudFlowServiceOptions {
  host: string;
  apiKey: string;
}


export class CloudFlowService {
  protected readonly options: CloudFlowServiceOptions;
  public readonly snapshots: SnapshotHub;

  public constructor(options: CloudFlowServiceOptions) {
    this.options = options;
    this.snapshots = {};
  }

  public async invoke(functionName: string, params: FnParams = {}, httpOptions?: HttpOptions): Promise<any> {
    let options: HttpOptions = _.cloneDeep(httpOptions);
    if (!_.isObject(options)) {
      options = {};
    }
    if (!_.isObject(options.headers)) {
      options.headers = {};
    }
    if (!_.isString(options.method) || options.method.length === 0) {
      options.method = 'get';
    }

    // 设置 API Key
    const { apiKey, host } = this.options;
    options.headers = _.assign({}, options.headers, {
      apiKey
    });
    const url: string = _.trimEnd(host, '/') + `/api/client/functions/${functionName}`;
    
    return await request(url, params, options);
  }

  public createSnapshot(snapshotName: string, snapshot: Snapshot): void;
  public createSnapshot(snapshotName: string, options?: SnapshotOptions): void;
  public createSnapshot(): void {
    const snapshotName: string = arguments[0];
    const secondArg: Snapshot | SnapshotOptions = arguments[1];
    if (_.isFunction(secondArg)) {
      this.snapshots[snapshotName] = secondArg;

    } else {
      const functionName: string = _.get(secondArg, 'functionName', snapshotName);
      const options: SnapshotOptions = _.assign({}, secondArg, { functionName });
      this.snapshots[snapshotName] = createSnapshot(this, options);
    }
  }

  public removeSnapshot(snapshotName: string): void {
    _.unset(this.snapshots, snapshotName);
  }
}