import config from '../../../config';
import rollbarFactory, { SERVER, CLIENT } from './rollbarFactory';

/*
* Default Rollbar error logger for the application. Both client and server expose the same
* function that accepts an error as an argument.
*
* @example
*  try {
*    // something blows up
*  } catch (err) {
*    serverError(err);
*  }
*/

const serverError = rollbarFactory(SERVER, config('rollbar.serverAccessToken'), config('environment'), config('version'));
const clientError = rollbarFactory(CLIENT, config('rollbar.clientAccessToken'), config('environment'), config('version'));

export { serverError, clientError };
