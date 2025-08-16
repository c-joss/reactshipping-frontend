export function findRateForLane({
  origin,
  destination,
  containerId,
  containerType,
  portPairs,
  quotes,
  containers,
}) {
  const pair = portPairs.find(
    (p) => p.load === origin && p.destination === destination
  );
  if (!pair) return { rate: null, transitTime: "", resolvedContainerId: null };
  const quote = quotes.find((q) => Number(q.portPairId) === Number(pair.id));
  if (!quote) return { rate: null, transitTime: "", resolvedContainerId: null };

  let cid = containerId;
  if (cid == null && containerType) {
    const c = containers.find(
      (x) =>
        String(x.type).toLowerCase() === String(containerType).toLowerCase()
    );
    cid = c ? Number(c.id) : null;
  }
  if (cid == null)
    return {
      rate: null,
      transitTime: quote.transitTime || "",
      resolvedContainerId: null,
    };

  const rate = Array.isArray(quote.rates)
    ? quote.rates.find((r) => Number(r.containerId) === Number(cid))
    : null;
  return {
    rate: rate || null,
    transitTime: quote.transitTime || "",
    resolvedContainerId: cid,
  };
}
