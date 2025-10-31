import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts a date to a human-readable "time ago" format
 * Examples: "2 days ago", "1 month ago", "3 years ago"
 */
export function timeAgo(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return diffInMinutes === 1 ? '1 minute ago' : `${diffInMinutes} minutes ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return diffInWeeks === 1 ? 'last week' : `${diffInWeeks} weeks ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return diffInMonths === 1 ? 'last month' : `${diffInMonths} months ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return diffInYears === 1 ? 'last year' : `${diffInYears} years ago`;
}

/**
 * Finds the most recent push date from an array of repositories
 * Returns the most recent pushedAt date or null if no repos
 */
export function getMostRecentPushDate(repos: Array<{ pushedAt?: string }> | null | undefined): string | null {
  // Check if repos exists and is actually an array
  if (!repos || !Array.isArray(repos) || repos.length === 0) {
    return null;
  }

  // Filter out repos without pushedAt property
  const reposWithPushDate = repos.filter(repo => repo.pushedAt);

  if (reposWithPushDate.length === 0) {
    return null;
  }

  return reposWithPushDate.reduce((mostRecent, repo) => {
    const repoDate = new Date(repo.pushedAt!);
    const mostRecentDate = new Date(mostRecent);
    return repoDate > mostRecentDate ? repo.pushedAt! : mostRecent;
  }, reposWithPushDate[0].pushedAt!);
}
