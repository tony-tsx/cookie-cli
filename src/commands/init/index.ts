import { Command } from '@cookie/cli-types'
import funcInit from './init'

const init: Command<true> = {
  name: 'init <projectName> [projectDir]',
  // @ts-ignore
  func: funcInit,
  detached: true,
  description: 'Cookie Project Init',
  options: [ {
    name: '-y, --yes',
    default: false,
    description: 'Skip any question'
  }, {
    name: '--case <format>',
    description: 'Case for output folder',
    default: 'hyphen'
  }, {
    name: '--template <templateName>',
    description: 'Load template',
    default: 'default'
  } ]
}

export default init
