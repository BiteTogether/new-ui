export function isValidUsername(username: string): boolean {
  // Username validation: 6-20 chars, letters, numbers, _ and . only
  const usernameRegex = /^[a-zA-Z0-9_.]{6,20}$/;
  return usernameRegex.test(username);
}

export const formatDate = (
  dateString: string,
  t?: (key: string, options?: Record<string, any>) => string,
): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) {
    return t ? t("just_now") : "Just now";
  } else if (diffInMinutes < 60) {
    return t
      ? t("minutes_ago", { count: diffInMinutes })
      : `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return t ? t("hours_ago", { count: diffInHours }) : `${diffInHours}h ago`;
  } else if (diffInDays < 7) {
    return t ? t("days_ago", { count: diffInDays }) : `${diffInDays}d ago`;
  } else {
    // If the message is from a same year, show "day/month", otherwise show "day/month/year"
    if (date.getFullYear() === now.getFullYear()) {
      return t
        ? t("date_month", { day: date.getDate(), month: date.getMonth() + 1 })
        : `${date.getDate()}/${date.getMonth() + 1}`;
    } else {
      return t
        ? t("date_month_year", {
            day: date.getDate(),
            month: date.getMonth() + 1,
            year: date.getFullYear(),
          })
        : `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }
  }
};

export function truncateText(text: string, maxLength: number): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}
