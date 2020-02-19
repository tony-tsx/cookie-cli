import { execSync } from 'child_process'
import semver from 'semver'
import { logger } from '@cookie/cli-tools'
import findUp from 'find-up'

export const getYarnVersionIfAvailable = () => {
  let yarnVersion
  try {
    yarnVersion = ( execSync('yarn --version', { stdio: [0, 'pipe', 'ignore'] } ).toString() || '' ).trim()
  } catch (error) { return null }

  try {
    if ( semver.gte(yarnVersion, '0.16.0') ) return yarnVersion
    return null
  } catch ( error ) {
    logger.error( `Cannot parse yarn version: ${yarnVersion}` )
    return null
  }
}

export const isProjectUsingYarn = ( cwd: string ) => findUp.sync( 'yarn.lock', { cwd } )
