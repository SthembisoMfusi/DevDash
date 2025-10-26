import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class GitHubService {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async getUserRepositories(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !(user as any).githubAccessToken) {
      throw new HttpException('GitHub access token not found', HttpStatus.BAD_REQUEST);
    }

    try {
      const response = await axios.get('https://api.github.com/user/repos', {
        headers: {
          Authorization: `token ${(user as any).githubAccessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
        params: {
          sort: 'updated',
          per_page: 100,
        },
      });

      const repos = response.data as any[];
      return repos.map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        owner: repo.owner.login,
        description: repo.description,
        private: repo.private,
        htmlUrl: repo.html_url,
        cloneUrl: repo.clone_url,
        updatedAt: repo.updated_at,
      }));
    } catch (error) {
      throw new HttpException('Failed to fetch repositories', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getRepositoryDetails(owner: string, repo: string, userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !(user as any).githubAccessToken) {
      throw new HttpException('GitHub access token not found', HttpStatus.BAD_REQUEST);
    }

    try {
      const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          Authorization: `token ${(user as any).githubAccessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      const repoData = response.data as any;
      return {
        id: repoData.id,
        name: repoData.name,
        fullName: repoData.full_name,
        owner: repoData.owner.login,
        description: repoData.description,
        private: repoData.private,
        htmlUrl: repoData.html_url,
        cloneUrl: repoData.clone_url,
        updatedAt: repoData.updated_at,
      };
    } catch (error) {
      throw new HttpException('Failed to fetch repository details', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getPullRequestDetails(owner: string, repo: string, prNumber: number, userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !(user as any).githubAccessToken) {
      throw new HttpException('GitHub access token not found', HttpStatus.BAD_REQUEST);
    }

    try {
      const prResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`, {
        headers: {
          Authorization: `token ${(user as any).githubAccessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      const [reviewsResponse, checksResponse] = await Promise.all([
        axios.get(`https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/reviews`, {
          headers: {
            Authorization: `token ${(user as any).githubAccessToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }),
        axios.get(`https://api.github.com/repos/${owner}/${repo}/commits/${(prResponse.data as any).head.sha}/check-runs`, {
          headers: {
            Authorization: `token ${(user as any).githubAccessToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }).catch(() => ({ data: { check_runs: [] } })), // CI checks might not be available
      ]);

      const pr = prResponse.data as any;
      const reviews = reviewsResponse.data as any[];
      const checks = (checksResponse.data as any).check_runs || [];

      // Determine review status
      const approvedReviews = reviews.filter((review: any) => review.state === 'APPROVED');
      const changesRequestedReviews = reviews.filter((review: any) => review.state === 'CHANGES_REQUESTED');
      
      let reviewStatus = 'PENDING';
      if (approvedReviews.length > 0) {
        reviewStatus = 'APPROVED';
      } else if (changesRequestedReviews.length > 0) {
        reviewStatus = 'CHANGES_REQUESTED';
      }

      // Determine CI status
      let ciStatus = 'PENDING';
      if (checks.length > 0) {
        const failedChecks = checks.filter((check: any) => check.conclusion === 'failure');
        const successfulChecks = checks.filter((check: any) => check.conclusion === 'success');
        
        if (failedChecks.length > 0) {
          ciStatus = 'FAILING';
        } else if (successfulChecks.length === checks.length) {
          ciStatus = 'PASSING';
        }
      }

      return {
        number: pr.number,
        title: pr.title,
        state: pr.state.toLowerCase(),
        htmlUrl: pr.html_url,
        reviewStatus,
        ciStatus,
        checks: checks.map((check: any) => ({
          name: check.name,
          status: check.status,
          conclusion: check.conclusion,
          htmlUrl: check.html_url,
        })),
        reviews: reviews.map((review: any) => ({
          state: review.state,
          user: review.user.login,
          submittedAt: review.submitted_at,
        })),
      };
    } catch (error) {
      throw new HttpException('Failed to fetch pull request details', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async parseIssueIdFromText(text: string): Promise<string | null> {
    // Look for patterns like DEV-123, ISSUE-456, etc.
    const issueIdPattern = /([A-Z]+)-(\d+)/i;
    const match = text.match(issueIdPattern);
    return match ? match[0] : null;
  }

  async linkIssueToBranch(issueId: number, branchName: string, repositoryId: number) {
    const issue = await (this.prisma as any).issue.findUnique({
      where: { id: issueId },
    });

    if (!issue) {
      throw new HttpException('Issue not found', HttpStatus.NOT_FOUND);
    }

    // Check if branch already exists
    const existingBranch = await (this.prisma as any).branch.findFirst({
      where: {
        repositoryId,
        name: branchName,
      },
    });

    if (existingBranch) {
      // Update existing branch to link to issue
      return (this.prisma as any).branch.update({
        where: { id: existingBranch.id },
        data: {
          issueId,
        },
        include: {
          issue: true,
          repository: true,
        },
      });
    } else {
      // Create new branch record
      return (this.prisma as any).branch.create({
        data: {
          name: branchName,
          sha: '', // Will be updated via webhook
          repositoryId,
          issueId,
        },
        include: {
          issue: true,
          repository: true,
        },
      });
    }
  }

  async linkIssueToPullRequest(issueId: number, prNumber: number, repositoryId: number, prData: any) {
    const issue = await (this.prisma as any).issue.findUnique({
      where: { id: issueId },
    });

    if (!issue) {
      throw new HttpException('Issue not found', HttpStatus.NOT_FOUND);
    }

    // Check if PR already exists
    const existingPR = await (this.prisma as any).pullRequest.findFirst({
      where: {
        repositoryId,
        number: prNumber,
      },
    });

    if (existingPR) {
      // Update existing PR
      return (this.prisma as any).pullRequest.update({
        where: { id: existingPR.id },
        data: {
          title: prData.title,
          state: prData.state.toUpperCase(),
          htmlUrl: prData.html_url,
          issueId,
        },
        include: {
          issue: true,
          repository: true,
        },
      });
    } else {
      // Create new PR record
      return (this.prisma as any).pullRequest.create({
        data: {
          number: prNumber,
          title: prData.title,
          state: prData.state.toUpperCase(),
          htmlUrl: prData.html_url,
          repositoryId,
          issueId,
        },
        include: {
          issue: true,
          repository: true,
        },
      });
    }
  }

  async handleWebhookEvent(eventType: string, payload: any) {
    switch (eventType) {
      case 'push':
        return this.handlePushEvent(payload);
      case 'pull_request':
        return this.handlePullRequestEvent(payload);
      case 'create':
        return this.handleCreateEvent(payload);
      default:
        console.log(`Unhandled webhook event: ${eventType}`);
        return null;
    }
  }

  private async handlePushEvent(payload: any) {
    const { repository, ref, commits } = payload;
    
    // Find repository in our database
    const repo = await (this.prisma as any).gitHubRepository.findFirst({
      where: {
        fullName: repository.full_name,
      },
    });

    if (!repo) {
      return null;
    }

    // Check if this is a new branch
    if (ref.startsWith('refs/heads/')) {
      const branchName = ref.replace('refs/heads/', '');
      
      // Look for issue ID in branch name
      const issueId = await this.parseIssueIdFromText(branchName);
      
      if (issueId) {
        // Find issue by parsing the ID
        const issueNumber = parseInt(issueId.split('-')[1]);
        const issue = await (this.prisma as any).issue.findFirst({
          where: {
            projectId: repo.projectId,
            // We'll need to add a field to store the issue number or use a different approach
          },
        });

        if (issue) {
          await this.linkIssueToBranch(issue.id, branchName, repo.id);
          
          // Move issue to IN_PROGRESS if it's currently TODO
          if (issue.status === 'TODO') {
            await (this.prisma as any).issue.update({
              where: { id: issue.id },
              data: { status: 'IN_PROGRESS' },
            });
          }
        }
      }
    }

    return { success: true };
  }

  private async handlePullRequestEvent(payload: any) {
    const { action, pull_request, repository } = payload;
    
    // Find repository in our database
    const repo = await (this.prisma as any).gitHubRepository.findFirst({
      where: {
        fullName: repository.full_name,
      },
    });

    if (!repo) {
      return null;
    }

    // Look for issue ID in PR title
    const issueId = await this.parseIssueIdFromText(pull_request.title);
    
    if (issueId) {
      // Find issue by parsing the ID
      const issueNumber = parseInt(issueId.split('-')[1]);
        const issue = await (this.prisma as any).issue.findFirst({
        where: {
          projectId: repo.projectId,
          // We'll need to add a field to store the issue number or use a different approach
        },
      });

      if (issue) {
        await this.linkIssueToPullRequest(issue.id, pull_request.number, repo.id, pull_request);
        
        // Update issue status based on PR action
        switch (action) {
          case 'opened':
            if (issue.status === 'IN_PROGRESS') {
              await (this.prisma as any).issue.update({
                where: { id: issue.id },
                data: { status: 'IN_REVIEW' },
              });
            }
            break;
          case 'closed':
            if (pull_request.merged) {
              await (this.prisma as any).issue.update({
                where: { id: issue.id },
                data: { status: 'DONE' },
              });
            }
            break;
        }
      }
    }

    return { success: true };
  }

  private async handleCreateEvent(payload: any) {
    const { ref_type, ref, repository } = payload;
    
    if (ref_type === 'branch') {
      return this.handlePushEvent({
        repository,
        ref: `refs/heads/${ref}`,
        commits: [],
      });
    }

    return null;
  }
}
