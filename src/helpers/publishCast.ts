import env from './env'
import neynar from './neynar'

export default async function (text: string, replyTo: string) {
  console.log('Publishing cast', text, replyTo)
  const publishedCast = await neynar.v2.publishCast(env.NEYNAR_UUID, text, {
    replyTo,
  })
  return publishedCast.hash
}
