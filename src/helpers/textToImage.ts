import { UltimateTextToImage, VerticalImage } from 'ultimate-text-to-image'

export default function (text: string, author: string | number) {
  const authorToImage = new UltimateTextToImage(`@${author}`, {
    width: 512,
    fontFamily: 'Arial',
    fontColor: '#373530',
    fontSize: 16,
    valign: 'middle',
  })
  const textToImage = new UltimateTextToImage(text, {
    width: 512,
    fontFamily: 'Arial',
    fontColor: '#373530',
    fontSize: 16,
    valign: 'middle',
    marginTop: 20,
  })
  const verticalImage = new VerticalImage([authorToImage, textToImage], {
    margin: 14,
    backgroundColor: '#ffffff',
  })
  return verticalImage.render().toStream()
}
