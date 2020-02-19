import realfs from 'fs'
import gracefulFs from 'graceful-fs'
import executeSetupShell from './tools/executeSetupShell'
import commander from 'commander'
// @ts-ignore
import pkg from '../package.json'
import { detachedCommands } from './commands'
import printUnknownCommand from './tools/printUnknownCommand'
import cosmicConfig from './tools/cosmicConfig'
import { logger } from '@cookie/cli-tools'
import attachCommand from './tools/attachCommand'

const setup = () => {
  if ( setup.ready ) return commander

  commander
    .option('--version', 'Print CLI version')
    .option('--verbose', 'Increase logging verbosity')

  commander.version( pkg.version )

  commander.arguments( '<command>' ).action( cmd => printUnknownCommand( cmd, true ) )
  setup.ready = true
  gracefulFs.gracefulify( realfs )
  cosmicConfig( 'cookie.config.js' )

  if ( process.argv.includes('--verbose') ) logger.config.enableVerbose()
  if ( process.platform !== 'win32' ) executeSetupShell()

  for ( let cmd of detachedCommands ) attachCommand( cmd )

  return commander
}

setup.ready = false

export default setup
