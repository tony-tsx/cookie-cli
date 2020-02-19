import Init from '../types'
import util from '../utils'
import setProjectDirectory from './setProjectDiretory'
import ora from 'ora'
import getTemplateName from './getTemplateName'
import path from 'path'
import fs from 'fs-extra'
import os from 'os'
import processTemplateName from './processTemplateName'
import Tools, { Error } from '@cookie/cli-tools'
import { installTemplatePackage } from './template'

const createProject = (
  caseNames: ReturnType<typeof util.createCaseNames>,
  outputFolder: string,
  options: Init.Options
) => new Promise<void>( async ( resolve, reject ) => {
  const projectDirectory = await setProjectDirectory( outputFolder )
  
  const installingTemplateOra = ora()
  const template = await getTemplateName( options )
  const templateSourceDir = fs.mkdtempSync( path.join( os.tmpdir(), 'cookie-tmp-' ) )

  try {
    installingTemplateOra.start()
    const processedTemplate = processTemplateName( template )
    await installTemplatePackage( processedTemplate.uri, templateSourceDir )
  } catch ( e ) {
    installingTemplateOra.fail()
    throw new Error( e.message, e )
  } finally {
    installingTemplateOra.succeed()
  }
} )

export default createProject
