/* Episode 02 · Find anything with search and tags.
 * The narration sets the clock: every cue below is a word of the voice-over (vo.js, generated
 * from the voice script's timeline). One table drives picture and sound. */
'use strict';

var VO = KIT.voice(VO_DATA), A = KIT.act;
var at = VO.at, line = VO.line;

var CUE = {
  intro: 4.1,
  s1: line('open').start - 0.2,            // Open search
  cmdK1: at('open', 'K,'),
  s2: line('type').start - 0.2,            // Search every note
  typeQuery: at('type', 'Type') + 0.25,
  s3: line('pick').start - 0.2,            // Open a result
  down: at('pick', 'arrow'),
  enter1: at('pick', 'Enter'),
  s4: line('tags').start - 0.2,            // Jump to a tag
  cmdK2: at('tags', 'Start'),
  typeHash: at('tags', 'hash'),
  enter2: at('filter', 'Enter,'),
  s5: line('jk').start - 0.2,              // Step through notes
  j1: at('jk', 'J'),
  s6: line('narrow').start - 0.2,          // Narrow the list
  clickFilter: at('narrow', 'type') - 0.1,
  esc: at('narrow', 'again.') + 0.3,
  s7: line('sidebar').start - 0.2,         // Filter from the sidebar
  clickNb: at('sidebar', 'notebook'),
  clickAll: line('sidebar').speech_end + 0.9,
  s8: line('commands').start - 0.2,        // Run a command
  cmdK3: at('commands', 'Finally,'),
  typeCmd: at('commands', 'greater-than'),
  enter3: at('commands', 'mode.') + 0.4,
  recap: line('recap').start - 0.28,
  outro: line('outro').start - 0.4,
  duration: +(VO.data.duration + 3.4).toFixed(2),
};
CUE.j2 = CUE.j1 + 1.25;
CUE.k1 = CUE.j2 + 1.3;

// what episode 01 left behind: the note it captured, pinned, tagged and filed in Work
var OFFSITE = { id: 'offsite', title: 'Offsite ideas', notebook: 'work', tags: ['planning'], pinned: true, date: 'Sep 26', upd: 2609.0914,
  body: '- [ ] Book the venue\n- [ ] Pick a date\n- [ ] Draft the agenda' };

KIT.episode({
  number: 2,
  title: 'Find anything with search and tags',
  subtitle: 'The command palette, tags, filters and commands',
  duration: CUE.duration,
  vo: VO,
  app: { notes: [OFFSITE], activeId: 'offsite' },
  intro: [0, CUE.intro],
  steps: [[CUE.s1, 'Open search'], [CUE.s2, 'Search every note'], [CUE.s3, 'Open a result'], [CUE.s4, 'Jump to a tag'],
          [CUE.s5, 'Step through the list'], [CUE.s6, 'Narrow the list'], [CUE.s7, 'Filter from the sidebar'], [CUE.s8, 'Run a command']],
  stepsEnd: CUE.recap,
  recap: { t0: CUE.recap, items: [[['⌘', 'K'], 'Search everything'], [['↑', '↓'], 'Choose a result'], [['#'], 'Jump to a tag'],
    [['J', 'K'], 'Next and previous note'], [['>'], 'Run a command'], [['Esc'], 'Close or clear']] },
  outro: { t0: CUE.outro, next: '' },

  state: [
    [CUE.cmdK1, A.openPalette('')],
    [CUE.down, A.paletteMove(1)],
    [CUE.enter1, A.paletteRun()],
    [CUE.cmdK2, A.openPalette('')],
    [CUE.enter2, A.paletteRun()],
    [CUE.j1, A.move(1)],
    [CUE.j2, A.move(1)],
    [CUE.k1, A.move(-1)],
    [CUE.clickFilter, A.focus('filter')],
    [CUE.esc, A.clearListFilter()],
    [CUE.clickNb, A.setFilter({ kind: 'notebook', value: 'reading' })],
    [CUE.clickAll, A.setFilter({ kind: 'all' })],
    [CUE.cmdK3, A.openPalette('')],
    [CUE.enter3, A.paletteRun()],
  ],
  typing: [
    [CUE.typeQuery, 'export', 9, 'palette'],
    [CUE.typeHash, '#pl', 7, 'palette'],
    [CUE.clickFilter + 0.35, 'week', 9, 'filter'],
    [CUE.typeCmd, '>dark', 9, 'palette'],
  ],
  keys: [
    [CUE.cmdK1, ['⌘', 'K'], 'Search'],
    [CUE.down, ['↓'], 'Choose'],
    [CUE.enter1, ['↵'], 'Open it'],
    [CUE.cmdK2, ['⌘', 'K'], 'Search'],
    [CUE.enter2, ['↵'], 'Filter by the tag'],
    [CUE.j1, ['J'], 'Next note'],
    [CUE.j2, ['J'], 'Next note'],
    [CUE.k1, ['K'], 'Previous note'],
    [CUE.esc, ['Esc'], 'Clear the filter'],
    [CUE.cmdK3, ['⌘', 'K'], 'Search'],
    [CUE.enter3, ['↵'], 'Dark theme on'],
  ],
  snaps: [CUE.enter2 + 0.02, CUE.clickNb + 0.05],
  success: [CUE.enter3 + 0.1],

  cursor: [
    [0, 'editor', { at: [0.62, 0.62] }],
    [at('open', 'click'), 'search', { at: [0.62, 0.55] }],
    [CUE.s1 + 3.9, 'editor', { at: [0.7, 0.8] }],   // out of the way, but inside the zoomed frame
    [CUE.clickFilter, 'filter', { click: true, at: [0.45, 0.5] }],
    [CUE.clickFilter + 1.0, 'filter', { at: [0.8, 1.6] }],
    [CUE.clickNb, 'nb:reading', { click: true, at: [0.3, 0.5] }],
    [CUE.clickAll, 'nb:all', { click: true, at: [0.3, 0.5] }],
    [CUE.s8 + 0.2, 'editor', { at: [0.9, 0.78] }],
  ],
  camera: [
    [CUE.intro, [960, 540], 1],
    [CUE.s1 + 3.4, [960, 540], 1],
    [CUE.s1 + 4.4, [1060, 480], 1.45],
    [CUE.enter1 + 0.8, [1060, 480], 1.45],
    [CUE.enter1 + 1.8, [960, 540], 1],
    [CUE.cmdK2 + 0.1, [960, 540], 1],
    [CUE.cmdK2 + 0.9, [1060, 470], 1.5],
    [CUE.enter2 + 0.2, [1060, 470], 1.5],
    [CUE.enter2 + 1.0, [620, 525], 1.3, { whoosh: true }],
    [CUE.esc + 0.8, [620, 525], 1.3],
    [CUE.s7 + 0.6, [560, 520], 1.35],
    [CUE.clickAll + 0.4, [560, 520], 1.35],
    [CUE.cmdK3 + 0.5, [1060, 470], 1.5],
    [CUE.enter3 + 0.2, [1060, 470], 1.5],
    [CUE.enter3 + 1.0, [960, 540], 1, { whoosh: true }],
  ],
  spots: [
    [CUE.enter2 + 0.6, CUE.s5 - 0.1, 'list', 0],
  ],
  callouts: [
    [at('open', 'or'), line('open').end, 'search', 'Or click Search', 'right', null, [120, -95]],   // above the palette's input
    [at('recent', 'lists'), line('recent').end, 'pitem:0', 'Your most recent notes', 'right', null, [40, -80]],   // right of the palette (a left card left the frame)
    [at('match', 'Matches'), line('match').end, 'pitem:0', 'Best match first', 'right', 'Titles, text and tags', [50, -130], 21],
    [at('tags', 'palette'), CUE.enter2 - 0.2, 'pitem:0', 'Every tag, with its count', 'right', null, [40, -110], 21],
    [CUE.enter2 + 0.9, CUE.s5 - 0.2, 'list', 'Only #planning notes', 'right', null, [150, 0]],   // beside the lit list, in the editor's empty half
    [CUE.clickNb + 0.3, CUE.clickAll - 0.2, 'nb:reading', 'One click filters', 'right', null, [250, 110]],   // in the list's empty space
  ],
});
