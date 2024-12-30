import { config } from '../../../framework_and_cloud/config';
import { BaseApiClient } from '../api';

export class SomethingApi {
  public baseApiClient: BaseApiClient;

  constructor() {
    this.baseApiClient = new BaseApiClient(config().api_config);
  }

  async proxySomething(something: string): Promise<any> {
    return this.baseApiClient.postRequest('/some_endpoint', { something }, [201]);
  }
}
