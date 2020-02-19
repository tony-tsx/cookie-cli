import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

let lastConfig: { [key: string]: any } = {}

type Search = { yarn?: boolean, npm?: boolean, local?: boolean }

const getLocalNodeModulesDir = () => {
  if ( getLocalNodeModulesDir.done ) return getLocalNodeModulesDir.done

  const existsNodeModulesLocal = fs.existsSync( path.resolve( 'node_modules' ) )
  if ( existsNodeModulesLocal ) return getLocalNodeModulesDir.done = path.resolve( 'node_modules' )
}
getLocalNodeModulesDir.done = ''

const getYarnGlobalDir = () => {
  try {
    if ( getYarnGlobalDir.done ) return getYarnGlobalDir.done
    const yarnGlobalDir = execSync( 'yarn global dir' ).toString().trim()
    const existsNodeModulesGlobalYarn = fs.existsSync( path.join( yarnGlobalDir, 'node_modules' ) )
    if ( existsNodeModulesGlobalYarn ) return getYarnGlobalDir.done = path.join( yarnGlobalDir, 'node_modules' )
  } catch {}
}
getYarnGlobalDir.done = ''

const getNpmGlobalDir = () => {
  try {
    if ( getNpmGlobalDir.done ) return getNpmGlobalDir.done
    const npmGlobalDir = execSync( 'npm root -g' ).toString().trim()
    const existsNodeModulesGlobalNpm = fs.existsSync( path.resolve( npmGlobalDir ) )
    if ( existsNodeModulesGlobalNpm ) return getNpmGlobalDir.done = npmGlobalDir
  } catch {}
}
getNpmGlobalDir.done = ''

const read = ( ...args: string[] ) => {
  const dir = args.length > 1 ? path.join( ...args ) : args[0]
  try { return fs.readdirSync( dir ) } catch { return [] }
}

const searchIn = ( dir: string, config: { root: string, file: string } ): string[] => {
  if ( /^@/.test( dir ) )
    return read( config.root, dir ).map( deep => searchIn( `${dir}/${deep}`, config )  ).flat<string>()

  const absolutePath = ( folder: string ) => path.join( config.root, dir, folder, config.file )
  const check = ( ...args: [ string, string ] ) => cosmicConfig.ifNotIncludeAndExists( ...args )
  return read( config.root, dir ).filter( folder => check( dir, absolutePath( folder ) ) ).map( absolutePath )
}

const cosmicConfig = <T>( file: string, options: Search = {} ): T => {
  if ( lastConfig[file] ) return lastConfig[file]
  cosmicConfig.reset()
  const startAt = Date.now()

  if ( options.local ) cosmicConfig.addDirectoryIfNotInclude( getLocalNodeModulesDir() )
  if ( options.yarn ) cosmicConfig.addDirectoryIfNotInclude( getYarnGlobalDir() )
  if ( options.npm ) cosmicConfig.addDirectoryIfNotInclude( getNpmGlobalDir() )

  const matches: string[] = []

  for ( let root of cosmicConfig.directories )
    matches.push( ...read( root ).map( folder => searchIn( folder, { file, root } ) ).flat<string>( 1 ) )

  if ( !lastConfig[file] ) lastConfig[file] = {}

  for ( let config of matches ) Object.assign( lastConfig[file], require( config ) )

  const endAt = Date.now()
  cosmicConfig.time = endAt - startAt
  return lastConfig[file]
}

cosmicConfig.directories = [] as string[]
cosmicConfig.scannedFolderNames = [] as string[]
cosmicConfig.scannedFolders = 0
cosmicConfig.time = 0

cosmicConfig.reset = () => {
  cosmicConfig.scannedFolderNames = [] as string[]
  cosmicConfig.scannedFolders = 0
  cosmicConfig.time = 0
}

cosmicConfig.addDirectoryIfNotInclude = ( ...dirs: ( string | undefined )[] ) => {
  dirs.forEach( dir => {
    if ( dir && !cosmicConfig.directories.includes( dir ) )
      cosmicConfig.directories.push( dir )
  } )
}

cosmicConfig.incrementScannedFolders = () => { cosmicConfig.scannedFolders++ }

cosmicConfig.addScannedFolderName = ( name: string ) => { cosmicConfig.scannedFolderNames.push( name ) }

cosmicConfig.incrementAndAddFolderName = ( name: string ) => {
  cosmicConfig.incrementScannedFolders()
  cosmicConfig.addScannedFolderName( name )
}

cosmicConfig.ifNotIncludeInclude = ( name: string ) => {
  if ( cosmicConfig.scannedFolderNames.includes( name ) ) return false
  cosmicConfig.incrementAndAddFolderName( name )
  return true
}

cosmicConfig.ifNotIncludeAndExists = ( includedLib: string, pathToFind: string ) =>
  cosmicConfig.ifNotIncludeInclude( includedLib ) && fs.existsSync( pathToFind )

cosmicConfig.setNpmNodeModulesDir = ( dir: string ) => getNpmGlobalDir.done = dir
cosmicConfig.setYarnNodeModulesDir = ( dir: string ) => getYarnGlobalDir.done = dir

export default cosmicConfig
