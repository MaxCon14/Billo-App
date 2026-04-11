/**
 * Direct cancellation URLs for the top 50 common subscription services.
 * Keys are lowercase service names for fuzzy matching.
 */
export const cancellationLinks: Record<string, string> = {
  // Streaming
  netflix: "https://www.netflix.com/cancelplan",
  "disney+": "https://www.disneyplus.com/account",
  "disney plus": "https://www.disneyplus.com/account",
  hulu: "https://secure.hulu.com/account",
  "hbo max": "https://www.max.com/account",
  max: "https://www.max.com/account",
  "amazon prime": "https://www.amazon.com/mc/pipelines/cancel",
  "prime video": "https://www.amazon.com/mc/pipelines/cancel",
  "apple tv+": "https://support.apple.com/en-us/HT202039",
  "apple tv": "https://support.apple.com/en-us/HT202039",
  peacock: "https://www.peacocktv.com/account/subscription",
  paramount: "https://www.paramountplus.com/account/",
  "paramount+": "https://www.paramountplus.com/account/",
  crunchyroll: "https://www.crunchyroll.com/account/subscription",
  funimation: "https://www.funimation.com/account",

  // Music
  spotify: "https://www.spotify.com/account/subscription/",
  "apple music": "https://support.apple.com/en-us/HT202039",
  tidal: "https://account.tidal.com/subscription",
  deezer: "https://www.deezer.com/account/subscription",
  "youtube music": "https://myaccount.google.com/subscriptions",
  "youtube premium": "https://myaccount.google.com/subscriptions",
  pandora: "https://www.pandora.com/account/settings",
  soundcloud: "https://soundcloud.com/settings/account",
  "amazon music": "https://www.amazon.com/mc/pipelines/cancel",

  // Gaming
  "xbox game pass": "https://account.microsoft.com/services",
  "game pass": "https://account.microsoft.com/services",
  "playstation plus": "https://store.playstation.com/subscriptions/manage",
  "ps plus": "https://store.playstation.com/subscriptions/manage",
  "nintendo switch online": "https://ec.nintendo.com/my/membership",
  "ea play": "https://myaccount.ea.com/cp-ui/management",
  "geforce now": "https://www.nvidia.com/en-us/account/geforce-now/",

  // Productivity
  "microsoft 365": "https://account.microsoft.com/services",
  "office 365": "https://account.microsoft.com/services",
  "google one": "https://one.google.com/settings",
  "google workspace": "https://admin.google.com/ac/billing",
  notion: "https://www.notion.so/my-account",
  slack: "https://slack.com/account/settings",
  zoom: "https://zoom.us/account",
  canva: "https://www.canva.com/settings/billing-and-teams",
  evernote: "https://www.evernote.com/Settings.action",
  todoist: "https://todoist.com/app/settings/subscription",
  grammarly: "https://account.grammarly.com/subscription",
  "1password": "https://my.1password.com/settings/billing",
  lastpass: "https://lastpass.com/update_account.php",
  dashlane: "https://app.dashlane.com/account/subscriptions",

  // Cloud Storage
  dropbox: "https://www.dropbox.com/account/plan",
  "icloud+": "https://support.apple.com/en-us/HT202039",
  icloud: "https://support.apple.com/en-us/HT202039",

  // Fitness
  peloton: "https://members.onepeloton.com/preferences/subscription",
  strava: "https://www.strava.com/account",
  headspace: "https://www.headspace.com/settings/subscription",
  calm: "https://app.calm.com/account",
  fitbit: "https://www.fitbit.com/settings/subscription",
  "nike training": "https://www.nike.com/member/settings",
  myfitnesspal: "https://www.myfitnesspal.com/account/subscriptions",

  // News & Reading
  "new york times": "https://myaccount.nytimes.com/seg/subscription",
  nytimes: "https://myaccount.nytimes.com/seg/subscription",
  "wall street journal": "https://customercenter.wsj.com/subscription-cancel",
  wsj: "https://customercenter.wsj.com/subscription-cancel",
  "washington post": "https://www.washingtonpost.com/my-post/subscriptions/",
  "the athletic": "https://theathletic.com/account/",
  medium: "https://medium.com/me/settings/membership",
  substack: "https://substack.com/account/payments",
  audible: "https://www.audible.com/account/cancel-membership",
  "kindle unlimited": "https://www.amazon.com/mc/pipelines/cancel",
  scribd: "https://www.scribd.com/account-settings",

  // VPN & Security
  nordvpn: "https://my.nordaccount.com/dashboard/nordvpn/",
  expressvpn: "https://www.expressvpn.com/subscriptions",
  surfshark: "https://my.surfshark.com/account/subscription",

  // Other
  chatgpt: "https://chat.openai.com/account/manage",
  "chatgpt plus": "https://chat.openai.com/account/manage",
  openai: "https://platform.openai.com/account/billing",
  claude: "https://claude.ai/settings",
  github: "https://github.com/settings/billing",
  "github copilot": "https://github.com/settings/billing",
  linkedin: "https://www.linkedin.com/mypreferences/d/manage-premium",
  "linkedin premium": "https://www.linkedin.com/mypreferences/d/manage-premium",
};

/**
 * Find a cancellation URL by fuzzy-matching a subscription name.
 * Returns the URL if found, null otherwise.
 */
export function findCancellationUrl(subscriptionName: string): string | null {
  const lower = subscriptionName.toLowerCase().trim();

  // Exact match first
  if (cancellationLinks[lower]) return cancellationLinks[lower];

  // Fuzzy match: check if any key is included in the name, or vice versa
  for (const [key, url] of Object.entries(cancellationLinks)) {
    if (lower.includes(key) || key.includes(lower)) {
      return url;
    }
  }

  return null;
}
