import { getSubtitles } from 'youtube-captions-scraper'
import youtubedl from 'youtube-dl-exec'
import { writeFile } from 'fs/promises'

const videoUrl = process.argv[2]

async function main() {
  console.log(videoUrl)
  const data = await youtubedl.exec(videoUrl, {
    skipDownload: true,
    printJson: true,
  })
  const info = JSON.parse(data.stdout)
  console.log(info)

  const subtitle = await getSubtitles({
    videoID: info.id,
    lang: 'en',
  }).catch((err) => {
    console.log(err, 'no captions')
  })
  console.log(subtitle)
  const text = subtitle.reduce((text, curr) => text + ' ' + curr.text, '')

  try {
    await writeFile(info.title, text)
    console.log('File written successfully!')
  } catch (err) {
    console.error('Error writing to file:', err)
  }
}

main()
