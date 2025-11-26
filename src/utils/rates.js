export function findRateForLane({
  origin,
  destination,
  containerId,
  containerType,
  portPairs = [],
  quotes = [],
  containers = [],
} = {}) {
  if (!origin || !destination) return empty();

  const pair = portPairs.find(
    (p) => String(p?.load) === String(origin) && String(p?.destination) === String(destination),
  );
  if (!pair) return empty();

  const quote = quotes.find((q) => toNum(q?.portPairId) === toNum(pair?.id));
  if (!quote) return empty();

  const resolvedId =
    containerId != null && containerId !== ''
      ? toNum(containerId)
      : findContainerId(containerType, containers);

  if (resolvedId == null) {
    return {
      rate: null,
      transitTime: quote.transitTime || '',
      resolvedContainerId: null,
    };
  }

  const rate = Array.isArray(quote.rates)
    ? quote.rates.find((r) => toNum(r?.containerId) === toNum(resolvedId)) || null
    : null;

  return {
    rate,
    transitTime: quote.transitTime || '',
    resolvedContainerId: toNum(resolvedId),
  };
}

function empty() {
  return { rate: null, transitTime: '', resolvedContainerId: null };
}

function toNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
}

function findContainerId(type, containers) {
  if (!type) return null;
  const wanted = String(type).toLowerCase().trim();
  const match = (containers || []).find((c) => String(c?.type).toLowerCase().trim() === wanted);
  return match ? toNum(match.id) : null;
}
