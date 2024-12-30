const LoadSecretsIntoEnvironment = (): void => {
  // AWS_SECRETS injected from task-definition.json
  if (process.env.AWS_SECRETS) {
    try {
      const aws_secrets = JSON.parse(process.env.AWS_SECRETS);
      Object.assign(process.env, aws_secrets);
      console.info(`Successfully loaded env vars from AWS Secrets Manager: ${Object.keys(aws_secrets)}`);
    } catch (error) {
      console.error('Failed to fetch env vars from AWS Secrets Manager:', error);
      throw error;
    }
  } else {
    console.info('Did not find AWS_SECRETS. Local .env file will be used instead.');
  }
};

export default LoadSecretsIntoEnvironment();
