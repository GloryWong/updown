import { Octokit } from '@octokit/rest'
import { retry } from '@octokit/plugin-retry'

const octokit = new (Octokit.plugin(retry))({
  auth: 'your_personal_access_token', // Optional for public repos, mandatory for private repos
  userAgent: 'updown',
})

export { octokit }
