import fs from 'fs-extra'
import path from 'path'

const assertDirectory = async ( dir: string ) => {
  const rootStat = await fs.promises.lstat( dir )
  if ( !rootStat.isDirectory() ) throw new Error( `${dir} is not a folder` )
}

const processDir = async ( dir: string ) => {
  await assertDirectory( dir )

  const inDir = await fs.promises.readdir( dir )

  const folder: string[] = []
  const files: string[] = []

  for await ( let archive of inDir ) {
    const fullpath = path.join( dir, archive )
    const stat = await fs.promises.lstat( fullpath )
    if ( stat.isFile() ) files.push( fullpath )
    else if (stat.isDirectory() ) folder.push( fullpath )
  }

  return { folder, files }
}

const createProjectFromTemplate = ( templateFolder: string, output: string ) => new Promise( async ( resolve, reject ) => {
  try {
    const root = await processDir( templateFolder )
    
    const templatePackageJson = root.files.find( /package.json$/.test )
    if ( !templatePackageJson ) throw new Error( 'package.json not exists in template' )
  } catch ( e ) { reject( e ) }
} )
