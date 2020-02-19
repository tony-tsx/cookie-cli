import didYouMean from 'didyoumean'
import commander from 'commander'
import chalk from 'chalk'
import { logger } from '@cookie/cli-tools'

const printUnknownCommand = ( name: string, exit: boolean = false ) => {
  if ( !name ) return commander.outputHelp()

  const suggestion = printUnknownCommand.getSuggestion( name )
  const msg = printUnknownCommand.createErrorMsg( name, suggestion )
  logger.error( msg )
  logger.info( `Run ${chalk.bold( '"cookie --help"' )} to see a list of all available commands.` )
  if ( exit ) process.exit( 1 )
}

printUnknownCommand.getSuggestion = ( name: string ) =>
  didYouMean( name, commander.commands.map( ( cmd: any ) => cmd._name) )

printUnknownCommand.createErrorMsg = ( name: string, suggestion?: string | string[] ) =>
  `Unrecognized command "${chalk.bold(name)}".` + ( suggestion ? ` Did you mean "${suggestion}"?` : '' )

export default printUnknownCommand
