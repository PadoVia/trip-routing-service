function nodeAnalyzer(positionMatch) {
  // Controlla se l'oggetto positionMatch è nullo, non è un oggetto, o è vuoto
  if (
    !positionMatch ||
    typeof positionMatch !== 'object' ||
    Object.keys(positionMatch).length === 0
  ) {
    throw('Invalid position match data');
  }

  // Accede in modo sicuro ai nodi nella struttura dati.
  // Se una delle proprietà è assente, restituisce un array vuoto.
  return (
    positionMatch?.matchings?.[0]?.legs?.[0]?.annotation?.nodes || []
  );
}

module.exports = nodeAnalyzer;
