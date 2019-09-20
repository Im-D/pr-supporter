/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
module.exports = app => {
  // app.on('pull_request.opened', async context => {
  //   console.log('test', context)
  //   return context.github.issues.createComment('')
  // })
  app.on('pull_request.opened', async context => {
    const filesChanged = await context.github.pullRequests.listFiles(context.issue())
    console.log('========================result======================', filesChanged.data)

    const urlList = await filesChanged.data.reduce((acc, cur) => {
      if (cur['filename'].includes('.md')) {
        acc += `[${cur['filename']}](${cur['blob_url']})\n`
      }
      return acc
    }, '')
    // if (results && results.length > 0) {
    //   // make URLs
    //   let urls = ''
    //   await results.forEach(async (result) => {
    //     urls += `\n[View rendered ${result.filename}](${context.payload.pull_request.head.repo.html_url}/blob/${context.payload.pull_request.head.ref}/${result.filename})`
    //   })
    // await context.github.pullRequests.update(context.issue({ body: `${context.payload.pull_request.body}\n\n-----${urls}` }))
    await context.github.pullRequests.update(context.issue({ body: urlList }))
    // }
  })
}
