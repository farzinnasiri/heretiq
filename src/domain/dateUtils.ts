/**
 * Formats a date with ordinal suffix for official card verification timestamps.
 * Example: Aug 20th 2026, Sep 16th 2026
 */
export function formatVerifiedDate(date: Date = new Date()): string {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  const remainder10 = day % 10;
  const remainder100 = day % 100;

  let suffix = 'th';
  if (remainder10 === 1 && remainder100 !== 11) {
    suffix = 'st';
  } else if (remainder10 === 2 && remainder100 !== 12) {
    suffix = 'nd';
  } else if (remainder10 === 3 && remainder100 !== 13) {
    suffix = 'rd';
  }

  return `${month} ${day}${suffix} ${year}`;
}
