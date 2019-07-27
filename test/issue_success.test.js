const nock = require('nock')
// Requiring our app implementation
const myProbotApp = require('..')
const { Probot } = require('probot')
// Requiring our fixtures
const payload = require('./fixtures/pull_request.opened')
// const issueCreatedBody = { body: 'Thanks for opening this issue!' }

// 실제 주소와 연결을 하지 않고 테스트 진행
nock.disableNetConnect()

describe('Start Pull Request Open', () => {
  let probot

  beforeEach(() => {
    probot = new Probot({})

    const app = probot.load(myProbotApp)
    app.app = () => 'test'
  })

  test('creates a comment when an pull request is opened', async () => {
    nock('https://api.github.com')
      .post('/app/installations/1189219/access_tokens')
      .reply(200, { token: 'test' })

    nock('https://api.github.com')
      .get('/repos/Im-D/probot-practice/pulls/32/files')
      .reply(200, [
        {
          filename: 'README.md'
        }
      ])

    nock('https://api.github.com')
      .patch('/repos/Im-D/probot-practice/pulls/32', body => {
        console.log('=========================body', body)
        expect(body).toMatchObject({ body: 'comments test' })
        return true
      })
      .reply(200)

    // Receive a webhook event
    await probot.receive({ name: 'pull_request', payload })
  })
})

// For more information about testing with Jest see:
// https://facebook.github.io/jest/

// For more information about testing with Nock see:
// https://github.com/nock/nock
