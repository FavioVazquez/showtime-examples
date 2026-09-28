/* Episode 01 · Capture a note in seconds.
 * The narration sets the clock: every cue below is a word of the voice-over (vo.js, generated
 * from the voice script's timeline), so each click, key and camera move lands on the word that names it, and one
 * table drives picture and sound (KIT.episode places every click, key and step sound at these times). */
'use strict';

var VO = KIT.voice(VO_DATA), A = KIT.act;
var at = VO.at, line = VO.line;

var CUE = {
  intro: 4.1,
  s1: line('new').start - 0.2,             // Start a note
  keyN: at('new', 'N.'),                   // "press N"
  s2: line('title').start - 0.2,           // Name it
  typeTitle: at('title', 'type.') + 0.3,
  enter1: at('enter', 'Enter'),            // title -> body
  s3: line('body').start - 0.2,            // Write in Markdown
  typeItem1: at('body', 'dash'),
  enter2: at('continue', 'Enter,'),        // the checklist continues
  typeItem2: line('continue').speech_end + 0.1,
  s4: line('preview').start - 0.2,         // See it rendered
  cmdE1: at('flip', 'E'),
  cmdE2: at('flip', 'again'),
  s5: line('tag').start - 0.2,             // Tag it and file it
  clickTag: at('tag', 'Click'),
  typeTag: at('tag', 'type'),
  enter4: at('tag', 'Enter.'),
  clickNb: at('notebook', 'choose'),
  clickWork: at('notebook', 'Work.'),
  s6: line('saved').start - 0.2,           // Saved on this device
  sync: line('sync').start,
  s7: line('pin').start - 0.2,             // Pin it
  esc: at('pin', 'Escape'),
  keyP: at('pin', 'P'),
  pinned: line('pinned').start,
  recap: line('recap').start - 0.25,
  outro: line('outro').start - 0.4,
  duration: +(VO.data.duration + 2.9).toFixed(2),
};
CUE.enter3 = CUE.typeItem2 + 11 / 12 + 0.3;          // after "Pick a date"
CUE.typeItem3 = CUE.enter3 + 0.25;

KIT.episode({
  number: 1,
  title: 'Capture a note in seconds',
  subtitle: 'Title, checklist, tags: all from the keyboard',
  duration: CUE.duration,
  vo: VO,
  intro: [0, CUE.intro],
  steps: [[CUE.s1, 'Start a note'], [CUE.s2, 'Give it a title'], [CUE.s3, 'Write in Markdown'], [CUE.s4, 'See it rendered'],
          [CUE.s5, 'Tag it and file it'], [CUE.s6, 'It saves on this device'], [CUE.s7, 'Pin it to the top']],
  stepsEnd: CUE.recap,
  recap: { t0: CUE.recap, items: [[['N'], 'Start a note'], [['↵'], 'Title to body, next list item'], [['⌘', 'E'], 'Full preview and back'],
    ['', 'Tags and notebook under the title'], [['Esc'], 'Leave the editor'], [['P'], 'Pin to the top']] },
  outro: { t0: CUE.outro, next: '02 · Find anything with search and tags' },

  // what the app does, in order (Film.fold over KIT.state())
  state: [
    [CUE.keyN, A.newNote('offsite')],
    [CUE.enter1, A.focus('body')],
    [CUE.enter2, A.listEnter()],
    [CUE.enter3, A.listEnter()],
    [CUE.cmdE1, A.toggleMode()],
    [CUE.cmdE2, A.toggleMode()],
    [CUE.clickTag, A.focus('tag')],
    [CUE.enter4, A.addTag()],
    [CUE.clickNb, A.menu('notebook')],
    [CUE.clickWork, A.setNotebook('work')],
    [CUE.esc, A.blur()],
    [CUE.keyP, A.togglePin()],
  ],
  typing: [
    [CUE.typeTitle, 'Offsite ideas', 11, 'title'],
    [CUE.typeItem1, '- [ ] Book the venue', 13, 'body'],
    [CUE.typeItem2, 'Pick a date', 12, 'body'],
    [CUE.typeItem3, 'Draft the agenda', 13, 'body'],
    [CUE.typeTag, 'planning', 12, 'tag'],
  ],
  keys: [
    [CUE.keyN, ['N'], 'New note'],
    [CUE.enter1, ['↵'], 'Down to the body'],
    [CUE.enter2, ['↵'], 'The list continues'],
    [CUE.enter3, ['↵'], ''],
    [CUE.cmdE1, ['⌘', 'E'], 'Full preview'],
    [CUE.cmdE2, ['⌘', 'E'], 'Back to writing'],
    [CUE.enter4, ['↵'], 'Add the tag'],
    [CUE.esc, ['Esc'], 'Leave the editor'],
    [CUE.keyP, ['P'], 'Pin'],
  ],
  snaps: [CUE.enter4 + 0.02, CUE.clickWork + 0.05, CUE.keyP + 0.02],
  success: [CUE.typeItem3 + 16 / 13 + 0.2],

  // the pointer targets the UI by name, resolved with the app as it is at each moment
  cursor: [
    [0, 'editor', { at: [0.62, 0.62] }],
    [CUE.keyN + 0.7, 'newNote', { at: [0.72, 0.55] }],
    [CUE.s2 + 0.6, 'editor', { at: [0.9, 0.2] }],
    [CUE.clickTag, 'tagInput', { click: true, at: [0.3, 0.5] }],
    [CUE.clickNb, 'nbSelect', { click: true, at: [0.4, 0.5] }],
    [CUE.clickWork, 'menuItem:work', { click: true, at: [0.35, 0.5] }],
    [CUE.clickWork + 1.2, 'editor', { at: [0.72, 0.58] }],
    [CUE.s7 + 0.4, 'editor', { at: [0.62, 0.7] }],
  ],
  camera: [
    [CUE.intro, [960, 540], 1],
    [CUE.s1 + 0.3, [960, 540], 1],
    [CUE.keyN - 0.3, [760, 470], 1.2],
    [CUE.s2 + 0.2, [760, 470], 1.2],
    [CUE.typeTitle - 0.4, 'title', 1.9, { whoosh: true }],
    [CUE.enter1 + 0.4, 'title', 1.9],
    [CUE.typeItem1 - 0.4, [1300, 520], 1.6],
    [CUE.s4 + 0.1, [1300, 520], 1.6],
    [CUE.s4 + 0.9, [1180, 580], 1.25],
    [CUE.s5 - 0.2, [1180, 580], 1.25],
    [CUE.clickTag - 0.6, 'tagInput', 2.0, { whoosh: true }],
    [CUE.clickWork + 1.0, 'tagInput', 2.0],
    [CUE.s6 + 0.8, [1400, 700], 1.5],
    [CUE.sync - 0.3, [1400, 700], 1.5],
    [CUE.sync + 0.6, 'sync', 1.9, { whoosh: true }],
    [CUE.s7 + 0.1, 'sync', 1.9],
    [CUE.s7 + 1.0, [650, 500], 1.45],
    [CUE.recap - 0.6, [650, 500], 1.45],
    [CUE.recap, [960, 540], 1],
  ],
  pulses: [[CUE.keyN + 0.8, CUE.s2 - 0.3, 'newNote']],
  spots: [
    // the tour of the window: one region lit at a time while its callout names it
    [at('hello', 'notes') - 0.15, at('hello', "Let's") + 0.2, 'list', 0],
    [at('hello', "Let's") + 0.3, line('hello').end, 'preview', 0],
    [line('preview').start + 0.8, CUE.cmdE1 - 0.2, 'preview', 4],
    [CUE.s6 + 1.0, CUE.sync - 0.3, 'saveState', 6],
    [CUE.sync + 1.2, CUE.s7 - 0.1, 'sync', 6],
  ],
  callouts: [
    [at('hello', 'notes'), at('hello', "Let's") + 0.2, 'item:welcome', 'Your notes, newest first', 'right', null, [150, 150]],
    [at('hello', "Let's") + 0.3, line('hello').end, 'preview', 'Markdown, rendered live', 'left', null, [-150, 70]],
    [CUE.s6 + 1.4, CUE.sync - 0.3, 'saveState', 'Saved as you type', 'above', 'Nothing is uploaded', [-120, -130], 22],
    [CUE.sync + 1.6, CUE.s7 - 0.1, 'sync', 'Stored in this browser', 'right', 'No account, no server', [120, -80], 22],
    [CUE.pinned + 0.2, CUE.recap - 0.3, 'item:offsite', 'Pinned to the top', 'right', null, [40, 220]],   // below the checklist, clear of the title
  ],
});
