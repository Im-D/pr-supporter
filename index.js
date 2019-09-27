module.exports = app => {
  app.on('pull_request.opened', async context => {
    const filesChanged = await context.github.pullRequests.listFiles(context.issue())

    const urlList = await filesChanged.data.reduce((acc, cur) => {
      if (cur['filename'].match(/\.(md|markdown)$/)) {
        acc += `[${cur['filename']}](${cur['blob_url']})\n`
      }
      return acc
    }, '')

    await context.github.pullRequests.update(context.issue({ body: urlList }))
  })
}
