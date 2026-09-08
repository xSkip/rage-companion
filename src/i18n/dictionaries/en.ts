import type de from './de'

const en = {
  setup: {
    title: 'New Game',
    subtitle: 'RAGE Companion — score sheet replacement',
    playersLegend: 'Players ({{count}}/{{max}})',
    playerPlaceholder: 'Player {{index}}',
    playerNameLabel: 'Name player {{index}}',
    removePlayerLabel: 'Remove player {{index}}',
    addPlayer: '+ Add player',
    variantsLegend: 'Rule variants',
    variantPlusMinusOneLabel: 'Plus/minus one',
    variantPlusMinusOneDescription: 'The sum of all predictions may not equal the number of cards dealt this round.',
    variantVerdeckterTippLabel: 'Hidden guess',
    variantVerdeckterTippDescription: 'Predictions are written down secretly and revealed at the same time.',
    variantGeheimeVorhersageLabel: 'Secret prediction',
    variantGeheimeVorhersageDescription: 'Predictions stay secret until the end of the round.',
    variantDurchmarschLabel: 'Clean sweep',
    variantDurchmarschDescription: 'Double trick points for winning every trick in a round (except round 10).',
    errorMissingName: 'Please enter a name for every player.',
    submit: 'Start game',
  },
  round: {
    titleNew: 'Round {{round}} of {{total}}',
    titleEdit: 'Editing round {{round}}',
    titleFinished: 'All {{total}} rounds played',
    cardsInfo: '{{count}} cards per player',
    columnPlayer: 'Player',
    columnPrediction: 'Prediction',
    columnTricks: 'Tricks',
    columnSpecial: 'Special points',
    columnPoints: 'Points',
    predictionLabel: 'Prediction {{name}}',
    tricksLabel: 'Tricks {{name}}',
    specialLabel: 'Special points {{name}}',
    submitNew: 'Finish round {{round}}',
    submitEdit: 'Save round {{round}}',
    cancel: 'Cancel',
    finalStandingsLabel: 'Final standings:',
    standingsTitle: 'Standings',
    standingsTitleAfterRound: 'Standings after round {{round}}',
    historyTitle: 'Rounds so far',
    historyEntry: 'Round {{round}}:',
    edit: 'Edit',
  },
  newGame: {
    trigger: 'New game',
    confirmWarning: 'Progress will be lost.',
    confirmYes: 'Yes, new game',
    cancel: 'Cancel',
  },
  validation: {
    predictionOutOfRange: 'Prediction should be between 0 and {{cards}} ({{cards}} cards this round).',
    tricksSumMismatch: 'The sum of tricks won ({{sum}}) does not match the cards dealt this round ({{cards}}).',
    plusMinusOneViolation:
      'With "Plus/minus one" active, the sum of predictions ({{sum}}) may not equal the cards dealt ({{cards}}).',
  },
  winner: {
    single: 'Winner: {{name}}',
    shared: 'Shared win: {{names}}',
  },
  language: {
    label: 'Language',
  },
} satisfies typeof de

export default en
