import { ApiHeaders, Config } from '../interfaces/config';

const getEnvironmentVariable = (key: string): string => {
  if (!process.env[key]) throw new Error(`Missing environment variable '${key}'`);
  return process.env[key] as string;
};

export const shared_config = {
  api_key: getEnvironmentVariable('API_KEY'),
  sqs: {
    queue_url: getEnvironmentVariable('SQS_QUEUE_URL'),
  },
  mongodb: {
    uri: getEnvironmentVariable('MONGODB_URI'),
  },
};

export const config = (): Config => ({
  ...shared_config,
  api_config: {
    timeout: 1000,
    base_url: getEnvironmentVariable(`SOMETHING_BASE_URL`),
    headers: (): ApiHeaders => ({
      Authorization: `Bearer ...`,
    }),
  },
});
