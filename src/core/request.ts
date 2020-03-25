import Axios, { Method, AxiosRequestConfig } from 'axios';
import _ from 'lodash';
import querystring, { stringify } from 'query-string';

export interface THttpHeaders {
  [key: string]: string;
}

export interface FnParams {
  [paramName: string]: any;
}

export interface HttpOptions {
  method?: Method;
  headers?: THttpHeaders;
}



export async function request(url: string, params?: FnParams, httpOptions?: HttpOptions): Promise<any> {
  const config: AxiosRequestConfig = {};
  config.method = _.get(httpOptions, 'method', 'get');

  // 是否通过 URL 传参
  const passByQuery: boolean = (_.toLower(config.method) === 'get' || _.toLower(config.method) === 'options');

  config.url = url;
  if (passByQuery) {
    const queryStr: string = querystring.stringify(params);
    config.url = `${config.url}?${queryStr}`;
  } else {
    config.data = stringify(params);
  }

  config.headers = _.get(httpOptions, 'headers', {});

  return (await Axios(config)).data;
} 