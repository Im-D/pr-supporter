const core = require('@actions/core');
const github = require('@actions/github');
const path = require('path')

function fileLink(pullRequest, file) {
  return pullRequest.head.repo.html_url + path.join('/blob', pullRequest.head.ref, file.filename)
}

// https://octokit.github.io/rest.js/
async function run() {
  try {
    const myToken = core.getInput('myToken');
    const octokit = new github.GitHub(myToken);
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    const { owner, repo, number } = github.context.issue

    if(!number) {
      console.warn("Dont have number")
      return 
    }
    
    octokit.pulls.listFiles({ owner, repo, pull_number : number })
      .then((fileList) => {
        fileList.data.reduce((acc, cur) => {
          if (cur.filename.match(/\.(md|markdown)$/)) {
            // const link = fileLink(payload.pull_request, cur)
            acc += `[${cur.filename}](${cur.blob_url})\n`
          }
          return acc
        }, '')
      }).then((urlList) => {
        console.log('urlList', urlList)
        octokit.pulls.update({ owner, repo, pull_number:number, body: urlList })
      })
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
