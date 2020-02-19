import chalk from 'chalk'
import { logger } from '@cookie/cli-tools'
import childProcess from 'child_process'
import path from 'path'

const executeSetupShell = () => {
  const scriptName = 'setup_env.sh'
  const absolutePath = path.join( __dirname, '..', '..', scriptName )

  try {
    childProcess.execFileSync( absolutePath, { stdio: 'pipe' } )
  } catch (error) {
    logger.warn( `Failed to run environment setup script "${scriptName}"\n\n${chalk.red( error )}`, )
    logger.info(`React Native CLI will continue to run if your local environment matches what React Native expects. If it does fail, check out "${absolutePath}" and adjust your environment to match it.` )
  }
}

export default executeSetupShell
