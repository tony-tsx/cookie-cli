import execa from 'execa'
import path from 'path'
import { logger, Error } from '@cookie/cli-tools'
import { install } from '../../../tools/packageManager'
import copyFiles from '../../../tools/copyFiles'
import replacePathSepForRegex from '../../../tools/replacePathSepForRegex'
import fs from 'fs'

export type TemplateConfig = {
  placeholderName: string;
  templateDir: string;
  postInitScript?: string;
  titlePlaceholder?: string;
};

export const installTemplatePackage = ( templateName: string, root: string, npm?: boolean ) => {
  // logger.debug(`Installing template from ${templateName}`)
  return install( [ templateName ], { preferYarn: !npm, silent: true, root } )
}

export const getTemplateConfig = ( templateName: string, templateSourceDir: string ): TemplateConfig => {
  const configFilePath = path.resolve( templateSourceDir, 'node_modules', templateName, 'template.config.js' )

  logger.debug( `Getting config from ${configFilePath}` )

  if ( !fs.existsSync( configFilePath ) )
    throw new Error( `Couldn't find the "${configFilePath} file inside "${templateName}" template. Please make sure the template is valid.` )
  return require( configFilePath )
}

export const copyTemplate = async ( templateName: string, templateDir: string, templateSourceDir: string ) => {
  const templatePath = path.resolve( templateSourceDir, 'node_modules', templateName, templateDir )

  logger.debug( `Copying template from ${templatePath}` )
  let regexStr = path.resolve( templatePath, 'node_modules' )
  await copyFiles( templatePath, process.cwd(), { exclude: [ new RegExp( replacePathSepForRegex( regexStr ) ) ] } )
}

export const executePostInitScript = ( templateName: string, postInitScript: string, templateSourceDir: string ) => {
  const scriptPath = path.resolve( templateSourceDir, 'node_modules', templateName, postInitScript )

  logger.debug( `Executing post init script located ${scriptPath}` )

  return execa( scriptPath, {stdio: 'inherit'} )
}
