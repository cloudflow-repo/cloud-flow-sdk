
export interface CloudFlowServiceOptions {
  host: string;
  apiKey: string;
}


export class CloudFlowService {
  private readonly options: CloudFlowServiceOptions;

  constructor(options: CloudFlowServiceOptions) {
    this.options = options;
  }
}