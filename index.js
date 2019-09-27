const core = require('@actions/core');
const github = require('@actions/github');
// const path = require('path')

// function fileLink(pullRequest, file) {
//   return pullRequest.head.repo.html_url + path.join('/blob', pullRequest.head.ref, file.filename)
// }

// https://octokit.github.io/rest.js/
async function run() {
  try {
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(payload)
    const { owner, repo, number } = payload
    const filesChanged = github.pulls.listFiles({ owner, repo, pull_number : number })

    const urlList = await filesChanged.data.reduce((acc, cur) => {
      if (cur.filename.match(/\.(md|markdown)$/)) {
        // const link = fileLink(context.payload.pull_request, cur)

        // acc += `[${cur.filename}](${link})\n`
      }
      return acc
    }, '')

    console.log('urlList', urlList);
    github.pulls.update({ owner, repo, pull_number:number, body: urlList })
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
