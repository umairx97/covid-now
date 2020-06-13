#!/usr/bin/env node

const yargs = require('yargs')
const { promisify } = require('util')
const chalk = require('chalk')
const request = promisify(require('request').get)
const SUBSCRIPTION_KEY = 'cf146759ec47426c903aa5291eafd41c'
const BASE_URL = 'https://api.smartable.ai'

var argv = yargs
  .usage('Usage: -c PK')
  .example('-c PK', 'See the latest reports on covid19')
  .alias('c', 'country')
  .nargs('c', 1)
  .describe('c', 'Your Country Code')
  .demandOption(['c'])
  .argv

const getCovidData = async (countryCode) => {
  try {
    const opts = {
      url: `${BASE_URL}/coronavirus/stats/${countryCode}`,
      headers: { 'Subscription-Key': SUBSCRIPTION_KEY }
    }
    const data = await request(opts)
    return JSON.parse(data.body)
  } catch (err) {
    throw new Error(err.message)
  }
}

const printStats = (stats) => {
  const { totalConfirmedCases, newlyConfirmedCases, newDeaths, totalRecoveredCases } = stats
  console.log(`Total Confirmed Cases: ${chalk.yellowBright(totalConfirmedCases)}`)
  console.log(`New Confirmed Cases: ${chalk.redBright(newlyConfirmedCases)}`)
  console.log(`New Deaths: ${chalk.redBright(newDeaths)}`)
  console.log(`Total Recovered: ${chalk.blueBright(totalRecoveredCases)}`)
}

getCovidData(argv.c || argv.country)
  .then(({ stats }) => printStats(stats))
  .catch(err => console.log(err.message))
