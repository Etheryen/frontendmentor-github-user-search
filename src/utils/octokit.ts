import { Octokit } from "@octokit/core";
import { env } from "~/env.mjs";

// Octokit.js
// https://github.com/octokit/core.js#readme
const octokit = new Octokit({
  auth: env.GITHUB_API_TOKEN,
});

export const getGitHubProfileByUsername = (username: string) => {
  return octokit.request("GET /users/{username}", {
    username: username,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
};
