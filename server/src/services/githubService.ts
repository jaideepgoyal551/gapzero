import { GitHubPortfolioAnalysis } from '@shared/types';
import { config } from '../config/env';
import { v4 as uuidv4 } from 'uuid';

export class GitHubService {
  /**
   * Extract username from URL or handle
   */
  static extractUsername(input: string): string {
    const cleaned = input.trim();
    if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
      const match = cleaned.match(/github\.com\/([a-zA-Z0-9-]+)/i);
      if (match) return match[1];
    }
    return cleaned.replace(/^@/, '');
  }

  /**
   * Fetch and analyze public profile & repositories
   */
  static async analyzeProfile(userId: string, usernameInput: string, targetRole: string): Promise<GitHubPortfolioAnalysis> {
    const username = this.extractUsername(usernameInput);
    if (!username) {
      throw new Error('Please provide a valid GitHub username or URL.');
    }

    const headers: Record<string, string> = {
      'User-Agent': 'GapZero-Career-Coach',
      'Accept': 'application/vnd.github.v3+json',
    };

    if (config.githubToken) {
      headers['Authorization'] = `token ${config.githubToken}`;
    }

    let userResponse: Response;
    let reposResponse: Response;

    try {
      [userResponse, reposResponse] = await Promise.all([
        fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, { headers }),
        fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=12`, { headers }),
      ]);
    } catch (err: any) {
      throw new Error(`Failed to connect to GitHub API: ${err.message}`);
    }

    if (userResponse.status === 404) {
      throw new Error(`GitHub user "${username}" was not found.`);
    }

    if (userResponse.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please try again later or configure a GITHUB_TOKEN.');
    }

    if (!userResponse.ok) {
      throw new Error(`GitHub API returned status ${userResponse.status}.`);
    }

    const userData: any = await userResponse.json();
    const reposData: any = reposResponse.ok ? await reposResponse.json() : [];

    // Analyze repositories and languages
    const languagesDistribution: Record<string, number> = {};
    const analyzedRepos = [];

    for (const repo of (Array.isArray(reposData) ? reposData : [])) {
      if (repo.fork) continue; // skip forks for original code analysis

      if (repo.language) {
        languagesDistribution[repo.language] = (languagesDistribution[repo.language] || 0) + 1;
      }

      // Check if README exists
      let hasReadme = false;
      let readmeSnippet = '';
      try {
        const readmeRes = await fetch(`https://api.github.com/repos/${username}/${repo.name}/readme`, { headers });
        if (readmeRes.ok) {
          hasReadme = true;
          const readmeJson: any = await readmeRes.json();
          if (readmeJson.content) {
            const decoded = Buffer.from(readmeJson.content, 'base64').toString('utf8');
            readmeSnippet = decoded.slice(0, 300);
          }
        }
      } catch (e) {
        // Continue gracefully
      }

      analyzedRepos.push({
        name: repo.name,
        description: repo.description || 'No description provided.',
        language: repo.language || 'Unknown',
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        has_readme: hasReadme,
        readme_snippet: readmeSnippet,
        updated_at: repo.updated_at,
      });
    }

    // Determine strengths, gaps and suggestions
    const portfolioStrengths: string[] = [];
    const documentationGaps: string[] = [];
    const projectImprovementSuggestions: string[] = [];

    if (analyzedRepos.length > 0) {
      portfolioStrengths.push(`Active public portfolio with ${analyzedRepos.length} original non-forked repositories.`);
    }

    const topLanguages = Object.keys(languagesDistribution).sort((a, b) => languagesDistribution[b] - languagesDistribution[a]);
    if (topLanguages.length > 0) {
      portfolioStrengths.push(`Demonstrated proficiency across languages: ${topLanguages.join(', ')}.`);
    }

    const reposWithoutReadme = analyzedRepos.filter(r => !r.has_readme);
    if (reposWithoutReadme.length > 0) {
      documentationGaps.push(`${reposWithoutReadme.length} repositories are missing README documentation (${reposWithoutReadme.map(r => r.name).slice(0, 3).join(', ')}).`);
    } else if (analyzedRepos.length > 0) {
      portfolioStrengths.push('Consistent README documentation across recent repositories.');
    }

    projectImprovementSuggestions.push('Add architectural diagrams, demo GIFs, and clear setup commands (docker-compose, npm start) to repository READMEs.');
    projectImprovementSuggestions.push('Include automated GitHub Actions CI workflows for linting and test coverage to signal engineering rigor.');

    const roleAlignmentScore = Math.min(
      95,
      Math.max(45, 50 + (topLanguages.includes('TypeScript') || topLanguages.includes('JavaScript') ? 15 : 0) + (analyzedRepos.length >= 3 ? 15 : 5))
    );

    const analysis: GitHubPortfolioAnalysis = {
      id: uuidv4(),
      user_id: userId,
      username,
      profile_summary: {
        name: userData.name || username,
        bio: userData.bio || 'No public bio provided.',
        public_repos: userData.public_repos || 0,
        followers: userData.followers || 0,
        avatar_url: userData.avatar_url,
        created_at: userData.created_at,
      },
      analyzed_repositories: analyzedRepos.slice(0, 8),
      language_distribution: languagesDistribution,
      portfolio_strengths: portfolioStrengths,
      documentation_gaps: documentationGaps,
      project_improvement_suggestions: projectImprovementSuggestions,
      recommended_next_projects: [
        {
          title: `Full-Stack ${targetRole} Showcase with CI/CD`,
          tech_stack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker'],
          description: 'A production-ready application featuring robust error handling, database migrations, and automated GitHub Action tests.',
          aligns_with_role: targetRole,
        },
        {
          title: 'Open-Source Developer CLI / Utility Tool',
          tech_stack: ['Node.js', 'TypeScript', 'npm package'],
          description: 'A published command-line tool solving a developer workflow friction, demonstrating package publishing and documentation clarity.',
          aligns_with_role: targetRole,
        }
      ],
      role_alignment_score: roleAlignmentScore,
      created_at: new Date().toISOString(),
    };

    return analysis;
  }
}
