import inquirer from 'inquirer'
import Init from '../types'
import choiceTemplate from '../messages/templateChoices'

const getTemplateName = async ( options: Init.Options ): Promise<string> => {
  if ( options.template ) return options.template
  return await choiceTemplate()
}

export default getTemplateName
