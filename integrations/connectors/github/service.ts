// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/integrations/connectors/github/service.ts
================================================================================

```typescript
import { Octokit } from "@octokit/core";
import { restEndpointMethods } from "@octokit/plugin-rest-endpoint-methods";
import { throttling } from "@octokit/plugin-throttling";

// Define custom types for GitHub API responses.
interface Repository {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  private: boolean;
  owner: {
    login: string;
  };
}

interface CreateRepoResponse {
  name: string;
  full_name: string;
  html_url: string;
}


interface CreateFileParams {
  owner: string;
  repo: string;
  path: string;
  message: string;
  content: string;
  branch?: string;
  sha?: string;
}

interface UpdateFileParams extends CreateFileParams {
  sha: string;
}

const ThrottledOctokit = Octokit.plugin(throttling).plugin(restEndpointMethods);


export class GitHubService {
  private octokit: InstanceType<typeof ThrottledOctokit>;
  private readonly clientId: string | undefined;
  private readonly clientSecret: string | undefined;

  constructor(private readonly accessToken: string, clientId?: string, clientSecret?: string) {
    if (!accessToken) {
      throw new Error("GitHub access token is required.");
    }

    this.clientId = clientId;
    this.clientSecret = clientSecret;


    this.octokit = new ThrottledOctokit({
        auth: this.accessToken,
        throttle: {
          onRateLimit: (retryAfter: number, options: any, octokit: any, retryCount: number) => {
            octokit.log.warn(
              `Request quota exhausted for request ${options.method} ${options.url}`,
            );
            if (retryCount < 2) {
              console.log(`Retrying after ${retryAfter} seconds!`);
              return true;
            }
          },
          onSecondaryRateLimit: (retryAfter: number, options: any, octokit: any) => {
            // does not retry, only logs
            octokit.log.warn(
              `Secondary rate limit detected for request ${options.method} ${options.url}`,
            );
          },
        },
      });

  }


  async getUser(): Promise<any> {
    try {
      const response = await this.octokit.rest.users.getAuthenticated();
      return response.data;
    } catch (error: any) {
      console.error("Error fetching user:", error);
      throw this.handleGitHubError(error);
    }
  }


  async listRepositories(): Promise<Repository[]> {
    try {
      const response = await this.octokit.rest.repos.listForAuthenticatedUser({
        per_page: 100, // Retrieve up to 100 repositories per page
      });

      if (!response.data) {
        return [];
      }
      return response.data as Repository[];

    } catch (error: any) {
      console.error("Error listing repositories:", error);
      throw this.handleGitHubError(error);
    }
  }


  async createRepository(repoName: string, description: string = "", isPrivate: boolean = false): Promise<CreateRepoResponse> {
    try {
      const response = await this.octokit.rest.repos.createForAuthenticatedUser({
        name: repoName,
        description: description,
        private: isPrivate,
        // Add other repository creation options as needed
      });
      return response.data as CreateRepoResponse;

    } catch (error: any) {
      console.error("Error creating repository:", error);
      throw this.handleGitHubError(error);
    }
  }


  async getRepository(owner: string, repo: string): Promise<Repository | null> {
    try {
      const response = await this.octokit.rest.repos.get({
        owner,
        repo,
      });

      return response.data as Repository;

    } catch (error: any) {
      if (error.status === 404) {
        // Repository not found
        return null;
      }
      console.error("Error fetching repository:", error);
      throw this.handleGitHubError(error);
    }
  }



  async createFile(params: CreateFileParams): Promise<any> {
    try {
      const { owner, repo, path, message, content, branch } = params;
      const response = await this.octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message,
        content: Buffer.from(content).toString('base64'), // Encode content to base64
        branch,
      });

      return response.data;

    } catch (error: any) {
      console.error("Error creating file:", error);
      throw this.handleGitHubError(error);
    }
  }


  async updateFile(params: UpdateFileParams): Promise<any> {
    try {
      const { owner, repo, path, message, content, branch, sha } = params;
      const response = await this.octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message,
        content: Buffer.from(content).toString('base64'), // Encode content to base64
        sha,
        branch,
      });

      return response.data;
    } catch (error: any) {
      console.error("Error updating file:", error);
      throw this.handleGitHubError(error);
    }
  }

  async getFileContent(owner: string, repo: string, path: string, branch: string = 'main'): Promise<string | null> {
    try {
      const response = await this.octokit.rest.repos.getContent({
        owner,
        repo,
        path,
        ref: branch,
      });

      if (!response.data || Array.isArray(response.data) ) {
        return null;  // Handle the case where the file doesn't exist or is a directory
      }

      if ('content' in response.data && response.data.content) {
          const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
          return content;
      }
      return null;
    } catch (error: any) {
      if (error.status === 404) {
          return null;  // File not found
      }
      console.error('Error fetching file content:', error);
      throw this.handleGitHubError(error);
    }
  }



  async deleteFile(owner: string, repo: string, path: string, message: string, sha: string, branch: string = 'main'): Promise<any> {
    try {
      const response = await this.octokit.rest.repos.deleteFile({
        owner,
        repo,
        path,
        message,
        sha,
        branch,
      });
      return response.data;
    } catch (error: any) {
      console.error("Error deleting file:", error);
      throw this.handleGitHubError(error);
    }
  }

  async listBranches(owner: string, repo: string): Promise<any[]> {
    try {
      const response = await this.octokit.rest.repos.listBranches({
        owner,
        repo,
        per_page: 100, // Adjust as needed
      });
      return response.data;
    } catch (error: any) {
      console.error("Error listing branches:", error);
      throw this.handleGitHubError(error);
    }
  }

    async createBranch(owner: string, repo: string, branchName: string, sha: string): Promise<any> {
        try {
            const response = await this.octokit.rest.git.createRef({
                owner,
                repo,
                ref: `refs/heads/${branchName}`,
                sha: sha,
            });
            return response.data;
        } catch (error: any) {
            console.error("Error creating branch:", error);
            throw this.handleGitHubError(error);
        }
    }


    async getLatestCommitSha(owner: string, repo: string, branch: string = 'main'): Promise<string | null> {
        try {
            const response = await this.octokit.rest.repos.getCommit({
                owner,
                repo,
                ref: branch,
            });
            return response.data.sha;
        } catch (error: any) {
            if (error.status === 404) {
                return null; // Branch not found
            }
            console.error("Error getting latest commit SHA:", error);
            throw this.handleGitHubError(error);
        }
    }


  private handleGitHubError(error: any): Error {
    const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred with GitHub.";
    const statusCode = error.status || error.response?.status || 500; // Get the status code

    // Log the full error for debugging (consider removing in production)
    console.error("GitHub API Error:", {
        message: errorMessage,
        status: statusCode,
        details: error,
    });


    return new Error(`GitHub API Error: ${errorMessage} (Status: ${statusCode})`);

  }

  // Add more methods here for other GitHub API operations as needed
}
```