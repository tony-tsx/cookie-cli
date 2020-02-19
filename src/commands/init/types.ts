import { Command } from '@cookie/cli-types'

namespace Init {
  export interface Options {
    case: 'snake' | 'original' | 'pascal' | 'hyphen' | 'camel'
    template?: string
  }
}

interface Init extends Command.Detached.Function<Init.Options> {}

export = Init
