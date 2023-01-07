import runMongo from './helpers/runMongo'
import runServer from './helpers/runServer'
import startPolling from './helpers/startPolling'

void (async () => {
  console.log('Starting mongo')
  await runMongo()
  console.log('Starting server')
  await runServer()
  console.log('Starting polling')
  await startPolling()
  console.log('App started')
})()
