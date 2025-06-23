export function parseDuration(durationStr: string) {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);
  if (!match) {
    return;
  }

  const num = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case "h":
      return num * 60 * 60 * 1000;
    case "m":
      return num * 60 * 1000;
    case "s":
      return num * 1000;
    case "ms":
      return num;
    default:
      return;
  }
}
