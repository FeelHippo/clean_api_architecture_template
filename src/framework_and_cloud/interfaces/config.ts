import { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';

export interface Config {
  api_key: string;
  sqs: SqsConfiguration;
  mongodb: MongoDbConfiguration;
  api_config: BaseApiConfig;
}

export interface BaseApiConfig extends Omit<AxiosRequestConfig, 'headers'> {
  timeout: number;
  base_url: string;
  headers: () => ApiHeaders;
  data?: any;
}

export interface ApiHeaders extends AxiosRequestHeaders {
  Authorization: string;
}

export interface SqsConfiguration {
  queue_url: string;
}

export interface MongoDbConfiguration {
  uri: string;
}
