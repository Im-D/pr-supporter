/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
const path = require('path')

function fileLink ({ repository, pullRequest }, file) {
  return repository.html_url + path.join('/blob', pullRequest.head.ref, file.filename)
}

module.exports = app => {
  // app.on('pull_request.opened', async context => {
  //   console.log('test', context)
  //   return context.github.issues.createComment('')
  // })
  app.on('pull_request.opened', async context => {
    const filesChanged = await context.github.pullRequests.listFiles(context.issue())
    console.log('========================result======================', filesChanged.data)

    const urlList = await filesChanged.data.reduce((acc, cur) => {
      if (cur['filename'].includes('.js')) {
        return acc
      }
      const link = fileLink(context.payload, cur)
      console.log(link)
      acc += `[${cur['filename']}](${link})\n`
      return acc
    }, '')

    await context.github.pullRequests.update(context.issue({ body: urlList }))
  })
}
