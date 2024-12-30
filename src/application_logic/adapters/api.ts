import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ParsedQs } from 'qs';
import { BaseApiConfig } from '../../framework_and_cloud/interfaces/config';
import { log, log_levels, log_labels } from '../../framework_and_cloud/monitor/logger';
import { ApiClientException } from '../../framework_and_cloud/monitor/error-handler';

export class BaseApiClient {
  public instance: AxiosInstance;
  public timeout: number;

  constructor(config: BaseApiConfig) {
    const { timeout, base_url: baseURL, headers } = config;
    this.timeout = timeout;

    this.instance = axios.create({
      baseURL,
      timeout,
      headers: headers(),
    });
  }

  async getRequest(endpoint: string, params: ParsedQs | null = {}, status_codes: Array<number>): Promise<any> {
    const { timeout, instance } = this;
    log(log_levels.info, log_labels.api_request.get, { endpoint, params });
    const config = {
      timeout,
      params,
      validateStatus: (status: number) =>
        status_codes.includes(status)
          ? true
          : (log(log_levels.warning, log_labels.api_request.unexpected_status_code, {
              endpoint,
              expected: status_codes,
              received: status,
            }),
            false),
    };
    try {
      const response: AxiosResponse = await instance.get(endpoint, config);
      const { data } = response;
      log(log_levels.info, log_labels.api_request.get_success, {
        endpoint,
        response: data,
      });
      return data;
    } catch (error: any) {
      log(log_levels.error, log_labels.api_request.get_failure, {
        endpoint,
        error: error.message,
      });
      throw new ApiClientException(error.response.data.errorCode);
    }
  }

  async postRequest(endpoint: string, payload: any, status_codes: Array<number>): Promise<any> {
    const { timeout, instance } = this;
    log(log_levels.info, log_labels.api_request.post, {
      endpoint,
      payload,
    });
    const config = {
      timeout,
      validateStatus: (status: number) =>
        status_codes.includes(status)
          ? true
          : (log(log_levels.warning, log_labels.api_request.unexpected_status_code, {
              endpoint,
              expected: status_codes,
              received: status,
            }),
            false),
    };

    try {
      const response: AxiosResponse = await instance.post(endpoint, payload, config);
      const { data } = response;
      log(log_levels.info, log_labels.api_request.post_success, {
        endpoint,
        response: data,
      });
      return data;
    } catch (error: any) {
      log(log_levels.error, log_labels.api_request.post_failure, {
        endpoint,
        error: error.message,
      });
      throw new ApiClientException(error.response.data.errorCode);
    }
  }

  async patchRequest(endpoint: string, payload: any, status_codes: Array<number>): Promise<any> {
    log(log_levels.info, log_labels.api_request.patch, {
      endpoint,
      payload,
    });
    const config = {
      timeout: this.timeout,
      validateStatus: (status: number) => {
        const validate = status_codes.includes(status);
        if (!validate)
          log(log_levels.warning, log_labels.api_request.unexpected_status_code, {
            endpoint,
            expected: status_codes,
            received: status,
          });
        return validate;
      },
    };

    try {
      const response: AxiosResponse = await this.instance.patch(endpoint, payload, config);
      log(log_levels.info, log_labels.api_request.patch_success, {
        endpoint,
        response: response.data,
      });

      return response.data;
    } catch (error: any) {
      log(log_levels.error, log_labels.api_request.patch_failure, {
        endpoint,
        error: error.message,
      });
      throw new ApiClientException(error.response.data.errorCode);
    }
  }

  async deleteRequest(endpoint: string, params: ParsedQs | null = {}, status_codes: Array<number>): Promise<any> {
    const config = {
      timeout: this.timeout,
      url: endpoint,
      params,
      validateStatus: (status: number) => {
        const validate = status_codes.includes(status);
        if (!validate)
          log(log_levels.info, log_labels.api_request.unexpected_status_code, {
            endpoint,
            expected: status_codes,
            received: status,
          });
        return validate;
      },
    };

    try {
      const response: AxiosResponse = await this.instance.delete(endpoint, config);
      log(log_levels.info, log_labels.api_request.delete_success, {
        endpoint,
        response: response.data,
      });

      return response.data;
    } catch (error: any) {
      log(log_levels.error, log_labels.api_request.delete_failure, {
        endpoint,
        error: error.message,
      });
      throw new ApiClientException(error.response.data.errorCode);
    }
  }
}
