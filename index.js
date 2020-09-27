#!/usr/bin/env node

const yargs = require('yargs')
const { promisify } = require('util')
const chalk = require('chalk')
const request = promisify(require('request').get)
const SUBSCRIPTION_KEY = '13faaf98c4msh60d857634ffa70dp1bc433jsn995dbaba52d6'
const BASE_URL = 'https://coronavirus-smartable.p.rapidapi.com'

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
      url: `${BASE_URL}/stats/v1/${countryCode}/`,
      headers: {
        'x-rapidapi-host': 'coronavirus-smartable.p.rapidapi.com',
        'x-rapidapi-key': SUBSCRIPTION_KEY,
        useQueryString: true
      }
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
