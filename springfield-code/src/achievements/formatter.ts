/**
 * Achievement Formatter
 * Celebration messages and display formatting for achievements
 *
 * @module achievements/formatter
 */

import type { Achievement, AchievementProgress, AchievementState } from "./types.js";
import { getAchievementById, getVisibleAchievements } from "./definitions.js";
import { getUnlockedIds, getCloseToCompletion, getProgress } from "./storage.js";

/**
 * Character celebration messages when unlocking achievements
 */
const CHARACTER_CELEBRATIONS: Record<string, string[]> = {
  "troy-mcclure": [
    'Hi, I\'m Troy McClure! You may remember me from such achievements as "First Steps"!',
    "And scene! That's a wrap on your first achievement!",
    "Congratulations! This achievement brought to you by: doing things!",
  ],
  homer: [
    "Woohoo! Achievement unlocked! This calls for a donut!",
    "D'oh-n't mind if I do! Another achievement in the bag!",
    "Mmmm... achievements... *drools*",
  ],
  marge: [
    "*approving murmur* Well done, dear! That's quite an achievement!",
    "Oh my! Look at you, achieving things! I'm so proud!",
    "Hmm, another achievement. Very responsible of you!",
  ],
  bart: [
    "Ay caramba! Achievement unlocked!",
    "Eat my shorts, other achievement hunters!",
    "Don't have a cow, man! You just got an achievement!",
  ],
  lisa: [
    "Statistically speaking, this achievement was inevitable. Well done!",
    "Achievement unlocked! Now let's analyze what made this possible...",
    "Your dedication to excellence has been recognized!",
  ],
  maggie: ["*suck suck* (achievement unlocked!)"],
  grampa: [
    "Back in my day, we didn't have fancy 'achievements'... and we liked it!",
    "I used to be an achievement hunter like you, then I took a nap.",
    "Achievement? In MY day, that just meant surviving another winter!",
  ],
  burns: [
    "Excellent... Another achievement for the collection.",
    "Yes, yes, achievement unlocked. Smithers, note this in my ledger.",
    "Release the hounds! ...of celebration! Achievement earned!",
  ],
  moe: [
    "Hey, an achievement! This calls for a drink! ...of success!",
    "Well whaddya know, an achievement. Don't let it go to your head.",
    "Achievement unlocked! The first one's on the house.",
  ],
  wiggum: [
    "Bake 'em away, toys! You got an achievement!",
    "That's some good police—I mean, achievement work there.",
    "Book 'em for... excellence! Achievement unlocked!",
  ],
  skinner: [
    "Achievement unlocked! Mother will be so proud. ...Mother?",
    "Seymour! You got an achievement! ...I mean, YOU got an achievement!",
    "This achievement is a triumph of the human spirit!",
  ],
  apu: [
    "Thank you, come again! Achievement unlocked!",
    "This achievement is as fresh as today's Squishee!",
    "By Ganesh, an achievement! Most auspicious!",
  ],
  ensemble: [
    "*The whole town celebrates!* You've achieved something great!",
    "Springfield salutes you! Achievement unlocked!",
    "From all of us in Springfield: Congratulations!",
  ],
  "lyle-lanley": [
    "Well, sir, there's nothing on earth like a genuine achievement!",
    "ACHIEVEMENT! ACHIEVEMENT! ACHIEVEMENT!",
    "Is there a chance the achievement could bend? Not on your life, my friend!",
  ],
  default: [
    "Achievement Unlocked!",
    "Congratulations! You've earned an achievement!",
    "Well done! Achievement complete!",
  ],
};

/**
 * Get a celebration message for an achievement unlock
 * @param achievement - The achievement that was unlocked
 * @returns Celebration message string
 */
export function getCelebrationMessage(achievement: Achievement): string {
  const character = achievement.character || "default";
  const messages =
    CHARACTER_CELEBRATIONS[character] || CHARACTER_CELEBRATIONS.default;

  // Pick a random message
  const message = messages[Math.floor(Math.random() * messages.length)];

  return `
${"=".repeat(50)}
${achievement.icon} ACHIEVEMENT UNLOCKED: ${achievement.name} ${achievement.icon}
${"=".repeat(50)}

${message}

"${achievement.description}"
${"=".repeat(50)}
`;
}

/**
 * Format achievement for display in a list
 * @param achievement - Achievement to format
 * @param progress - Progress data (optional)
 * @param showHidden - Show hidden achievements even if not unlocked
 * @returns Formatted string
 */
export function formatAchievement(
  achievement: Achievement,
  progress?: AchievementProgress,
  showHidden: boolean = false
): string {
  // Hidden achievements show as ??? unless unlocked or showHidden
  if (achievement.hidden && !progress?.unlocked && !showHidden) {
    return `[ ] ??? - Hidden Achievement`;
  }

  const icon = achievement.icon;
  const status = progress?.unlocked ? "[x]" : "[ ]";
  const name = achievement.name;
  const desc = achievement.description;

  if (progress?.unlocked) {
    const date = progress.unlockedAt
      ? new Date(progress.unlockedAt).toLocaleDateString()
      : "Unknown";
    return `${status} ${icon} ${name}\n    "${desc}"\n    Unlocked: ${date}`;
  }

  // Show progress for in-progress achievements
  if (progress && progress.target > 1 && progress.current > 0) {
    const percent = Math.round((progress.current / progress.target) * 100);
    const bar = formatProgressBar(progress.current, progress.target, 10);
    return `${status} ${icon} ${name}\n    "${desc}"\n    Progress: ${bar} ${progress.current}/${progress.target} (${percent}%)`;
  }

  return `${status} ${icon} ${name}\n    "${desc}"`;
}

/**
 * Format a progress bar
 * @param current - Current value
 * @param target - Target value
 * @param width - Bar width in characters
 * @returns ASCII progress bar
 */
export function formatProgressBar(
  current: number,
  target: number,
  width: number = 10
): string {
  const filled = Math.round((current / target) * width);
  const empty = width - filled;
  return `[${"█".repeat(filled)}${"░".repeat(empty)}]`;
}

/**
 * Format complete achievement summary
 * @param state - Achievement state
 * @returns Formatted summary string
 */
export function formatAchievementSummary(state: AchievementState): string {
  const lines: string[] = [];
  const unlockedIds = getUnlockedIds(state);

  lines.push("## Achievement Progress");
  lines.push("");
  lines.push(`**Total:** ${state.totalUnlocked} / ${state.totalPossible}`);
  lines.push(
    `**Progress:** ${formatProgressBar(state.totalUnlocked, state.totalPossible, 20)} ${Math.round((state.totalUnlocked / state.totalPossible) * 100)}%`
  );
  lines.push("");

  // Show achievements by category
  const visible = getVisibleAchievements(unlockedIds);
  const categories = ["milestone", "mastery", "completion", "special"] as const;
  const categoryNames = {
    milestone: "Milestones",
    mastery: "Mastery",
    completion: "Completion",
    special: "Special",
  };

  for (const category of categories) {
    const categoryAchievements = visible.filter((a) => a.category === category);
    if (categoryAchievements.length === 0) continue;

    lines.push(`### ${categoryNames[category]}`);
    lines.push("");

    for (const achievement of categoryAchievements) {
      const progress = getProgress(state, achievement.id);
      lines.push(formatAchievement(achievement, progress));
      lines.push("");
    }
  }

  // Show close to completion
  const close = getCloseToCompletion(state);
  if (close.length > 0) {
    lines.push("### Almost There!");
    lines.push("");
    for (const [id, percent] of close.slice(0, 3)) {
      const achievement = getAchievementById(id);
      if (achievement) {
        lines.push(`- ${achievement.icon} ${achievement.name}: ${Math.round(percent)}%`);
      }
    }
    lines.push("");
  }

  return lines.join("\n");
}

/**
 * Format a compact achievement list (for stats display)
 * @param state - Achievement state
 * @param maxItems - Maximum items to show
 * @returns Compact formatted string
 */
export function formatCompactAchievements(
  state: AchievementState,
  maxItems: number = 5
): string {
  const lines: string[] = [];
  const unlockedIds = getUnlockedIds(state);

  lines.push(
    `Achievements: ${state.totalUnlocked}/${state.totalPossible}`
  );

  // Show recent unlocks
  const recentUnlocks: Array<{ id: string; date: string }> = [];
  for (const [id, progress] of Object.entries(state.progress)) {
    if (progress.unlocked && progress.unlockedAt) {
      recentUnlocks.push({ id, date: progress.unlockedAt });
    }
  }

  recentUnlocks.sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (recentUnlocks.length > 0) {
    lines.push("Recent:");
    for (const { id } of recentUnlocks.slice(0, maxItems)) {
      const achievement = getAchievementById(id);
      if (achievement) {
        lines.push(`  ${achievement.icon} ${achievement.name}`);
      }
    }
  }

  // Show close to completion
  const close = getCloseToCompletion(state);
  if (close.length > 0) {
    lines.push("In Progress:");
    for (const [id, percent] of close.slice(0, 2)) {
      const achievement = getAchievementById(id);
      if (achievement) {
        lines.push(`  ${achievement.icon} ${achievement.name}: ${Math.round(percent)}%`);
      }
    }
  }

  return lines.join("\n");
}

/**
 * Format newly unlocked achievements notification
 * @param achievementIds - IDs of newly unlocked achievements
 * @returns Notification string (empty if none)
 */
export function formatNewUnlocks(achievementIds: string[]): string {
  if (achievementIds.length === 0) return "";

  const lines: string[] = [];
  lines.push("");
  lines.push("=".repeat(40));

  for (const id of achievementIds) {
    const achievement = getAchievementById(id);
    if (achievement) {
      lines.push(getCelebrationMessage(achievement));
    }
  }

  return lines.join("\n");
}
