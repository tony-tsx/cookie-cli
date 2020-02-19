import inquirer from 'inquirer'

const choiceTemplate = async () => ( await inquirer.prompt( { type: 'list', choices: [ 'react-native', 'react-dom', 'cookie-command-extension' ], name: 'template' } ) ).template

export default choiceTemplate
