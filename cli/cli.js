'use strict'

const inquirer = require('inquirer')
const { join } = require('path')
const { dirs } = require('./lib/list-dirs')

const question = {
  message: 'Choose task',
  type: 'list',
  choices: listTasks,
  name: 'task'
}

function listTasks () {
  return dirs(join(__dirname, 'lib'))
    .map(d => d.replace(/-/g, ' '))
}

async function execute () {
  const { task } = await inquirer.prompt([
    question
  ])

  const taskDir = task.replace(/ /g, '-')
  const cli = require(`./lib/${taskDir}`)
  try {
    const response = await cli.execute()
    console.log(response)
  } catch (e) {
    console.log('Error:', e.message)
  }
  process.exit(0)
}

execute()
