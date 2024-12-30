export const log = (level: log_levels, label: string, details?: any): void => {
  const log_object = {
    level,
    label,
    details,
  };
  console.log(JSON.stringify(log_object));
};

export enum log_levels {
  info = 'info',
  warning = 'warning',
  error = 'error',
  debug = 'debug',
}

/// https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/FilterAndPatternSyntax.html
/// Unify log labels to optimize search query
export const log_labels = {
  middleware: {
    warning: 'MIDDLEWARE_WARNING',
  },
  server: {
    init: 'INITIALIZING_SERVER',
    error: 'SERVER_ERROR',
  },
  sqs: {
    publisher_started: 'SQS_PUBLISHER_STARTED',
    publisher_error: 'SQS_PUBLISHER_ERROR',
    publisher_data: 'SQS_PUBLISHER_DATA',
    consumer_started: 'SQS_CONSUMER_STARTED',
    consumer_failed: 'SQS_CONSUMER_FAILURE',
    consumer_stopped: 'SQS_CONSUMER_STOPPED',
    consumer_message: 'SQS_CONSUMER_MESSAGE',
    consumer_exception: 'SQS_CONSUMER_EXCEPTION',
    consumer_handled: 'SQS_CONSUMER_HANDLED',
  },
  db: {
    connect_success: 'DB_CONNECT',
    connect_error: 'DB_CONNECT_ERROR',
    format_error: 'FORMAT_ERROR',
    get_something: 'GET_SOMETHING',
    upsert_something: 'UPSERT_SOMETHING',
  },
  token: {
    error: 'CREATE_TOKEN_FAILURE',
  },
  modules: {
    operation_failed: 'OPERATION_FAILURE',
  },
  api_request: {
    get: 'API_REQUEST_GET',
    post: 'API_REQUEST_POST',
    patch: 'API_REQUEST_PATCH',
    patch_success: 'API_REQUEST_PATCH_SUCCESS',
    patch_failure: 'API_REQUEST_PATCH_FAILURE',
    delete_success: 'API_REQUEST_DELETE_SUCCESS',
    delete_failure: 'API_REQUEST_DELETE_FAILURE',
    unexpected_status_code: 'API_REQUEST_RESPONSE_UNEXPECTED_STATUS_CODE',
    get_success: 'API_REQUEST_GET_SUCCESS',
    get_failure: 'API_REQUEST_GET_FAILURE',
    post_success: 'API_REQUEST_POST_SUCCESS',
    post_failure: 'API_REQUEST_POST_FAILURE',
    format_error: 'API_REQUEST_RESPONSE_FORMAT_FAILURE',
    start_rejected: 'API_REQUEST_START_FAILURE',
    stop_rejected: 'API_REQUEST_STOP_FAILURE',
  },
  create_token: {
    init: 'CREATE_TOKEN_INIT',
    success: 'CREATE_TOKEN_SUCCESS',
  },
  connect: {
    init: 'CONNECT_INIT',
    success: 'CONNECT_SUCCESS',
    failed: 'CONNECT_FAILURE',
  },
};
