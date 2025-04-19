import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios';

@Injectable()
export class HttpHelper {
  /**
   * Builds the base Axios request config.
   * Includes optional headers and query params like api_key.
   */
  buildRequestConfig(
    apiKey?: string,
    bearerToken?: string,
    additionalHeaders?: Record<string, string>,
  ): AxiosRequestConfig {
    const headers: Record<string, string> = {
      ...additionalHeaders,
      ...(bearerToken && { Authorization: `Bearer ${bearerToken}` }),
    };

    const params = apiKey ? { api_key: apiKey } : {};

    const config: AxiosRequestConfig = {
      headers,
      params,
    };

    return config;
  }

  /**
   * Makes a request to the given endpoint with support for headers, body, and query params.
   */
  async makeRequest<T>(
    baseUrl: string,
    endpoint: string,
    method: Method = 'GET',
    apiKey?: string,
    bearerToken?: string,
    data?: Record<string, any>,
    params?: Record<string, any>,
    additionalHeaders?: Record<string, string>,
  ): Promise<AxiosResponse<T>> {
    const url = `${baseUrl.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;

    const baseConfig = this.buildRequestConfig(
      apiKey,
      bearerToken,
      additionalHeaders,
    );

    const config: AxiosRequestConfig = {
      method,
      url,
      headers: baseConfig.headers,
      params: { ...baseConfig.params, ...params },
      data,
    };

    try {
      return await axios(config);
    } catch (error) {
      Logger.error(`Request failed: ${method} ${url}`, error.stack);
      throw new Error(`Request failed: ${error.message}`);
    }
  }

  /**
   * Checks whether the status code indicates a successful request.
   */
  isValidRequest(status: number): boolean {
    return status >= 200 && status < 300;
  }
}
