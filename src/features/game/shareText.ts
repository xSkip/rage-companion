interface BuildShareTextParams {
  title: string
  standings: { name: string; totalScore: number }[]
  winnerLine: string
}

export function buildShareText({ title, standings, winnerLine }: BuildShareTextParams): string {
  const lines = [title, '']
  standings.forEach((s, i) => lines.push(`${i + 1}. ${s.name}: ${s.totalScore}`))
  lines.push('', winnerLine)
  return lines.join('\n')
}
