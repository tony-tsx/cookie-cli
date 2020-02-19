import commander from 'commander'
import chalk from 'chalk'
import { logger } from '@cookie/cli-tools'

const handlerError = (err: Error) => {
  if ( commander.verbose ) logger.error( err.message )

  else logger.error( handlerError.formatErrorMessage( err ) )

  if ( err.stack ) logger.log( chalk.dim( err.stack ) )

  process.exit(1)
}

handlerError.formatErrorMessage = ( err: Error ) =>
  `${err.message.replace( /\.$/, '' )}. ${chalk.dim( `Run CLI with ${chalk.reset('--verbose')} ${chalk.dim( 'flag for more details.' )}` )}`

export default handlerError
