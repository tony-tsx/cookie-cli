import Init from './types'
import util from './utils'
import Tools from '@cookie/cli-tools'
import createProject from './tools/createProject'

const init: Init = ( [ projectName, projectDir ], options ) => {
  const caseNames = util.createCaseNames( projectName )
  const outputFolder = projectDir || caseNames[options.case]
  Tools.logger.info( `Configuring new application in ${outputFolder}` )
  return createProject( caseNames, outputFolder, options )
}

export default init
