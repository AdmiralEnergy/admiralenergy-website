export function webhookClaimIsEligible(input: {
  existingStatus: "processing" | "processed" | "failed" | null;
  receivedAt?: Date | null;
  now?: Date;
}) {
  if (input.existingStatus === null || input.existingStatus === "failed") return true;
  if (input.existingStatus === "processed") return false;
  const now = input.now ?? new Date();
  return Boolean(input.receivedAt && now.getTime() - input.receivedAt.getTime() > 10 * 60 * 1000);
}
