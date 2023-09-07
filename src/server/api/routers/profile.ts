import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getGitHubProfileByUsername } from "~/utils/octokit";

export const profileRouter = createTRPCRouter({
  getProfileByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(({ input }) => {
      return getGitHubProfileByUsername(input.username);
    }),
});
