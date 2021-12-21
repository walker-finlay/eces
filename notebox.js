/* injected after any files from css, but before any other DOM is 
constructed or any other script is run. at this point we only
need the url of the window to check storage */
var [slug, ...preslug] = window.location.pathname.substring(1).split('/').reverse();

var existing_note = undefined;
var note_exists = false;

chrome.storage.sync.get(slug)
  .then(res => {
    window.existing_note = res[slug];
    window.note_exists = typeof window.existing_note !== 'undefined';
  })
  .catch(err => console.log(err));

/* TODO:
  - include feedback button w auto margin
  - add window resize handler to switch which box to sync
  - fix the sticky box!!
*/
document.addEventListener('DOMContentLoaded', () => {
  // Can't add buttons till the dom is constructed obv
  document.querySelectorAll(classnames).forEach(node => {
    let nbtn = createNoteButton(node);
    let nbox = createNoteBox(node);
    attachNoteButtonClickHandler(nbtn, nbox);
  });
});

const note_svg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-sticky" viewBox="0 0 16 16">
  <path d="M2.5 1A1.5 1.5 0 0 0 1 2.5v11A1.5 1.5 0 0 0 2.5 15h6.086a1.5 1.5 0 0 0 1.06-.44l4.915-4.914A1.5 1.5 0 0 0 15 8.586V2.5A1.5 1.5 0 0 0 13.5 1h-11zM2 2.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5V8H9.5A1.5 1.5 0 0 0 8 9.5V14H2.5a.5.5 0 0 1-.5-.5v-11zm7 11.293V9.5a.5.5 0 0 1 .5-.5h4.293L9 13.793z"/>
</svg>`;
const note_svg_filled = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-sticky-fill" viewBox="0 0 16 16">
  <path d="M2.5 1A1.5 1.5 0 0 0 1 2.5v11A1.5 1.5 0 0 0 2.5 15h6.086a1.5 1.5 0 0 0 1.06-.44l4.915-4.914A1.5 1.5 0 0 0 15 8.586V2.5A1.5 1.5 0 0 0 13.5 1h-11zm6 8.5a1 1 0 0 1 1-1h4.396a.25.25 0 0 1 .177.427l-5.146 5.146a.25.25 0 0 1-.427-.177V9.5z"/>
</svg>`;
const edit_svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
</svg>`;
const delete_svg_filled = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
</svg>`;
const add_note_color = `rgb(201, 201, 201)`;
const view_note_color = `rgb(51, 51, 51)`;
const section_delimiter_color = `rgb(226, 221, 204)`;
const classnames = '.social-icons__list-item--bookmarkactivated,'
  + ' .social-icons__list-item--bookmark';
const recipe_main_classname = `recipe__main-content`;
const sticky_box_classname = `sticky-box__primary`;
const note_placeholder = "Enter your note here! Click anywhere outside the note box to save!";
const notebox_options = [
  {
    title: 'Edit note',
    classname: 'nb-edit',
    icon: edit_svg,
    clickhandler: noteEditHandler
  },
  {
    title: 'Delete note',
    classname: 'nb-delete',
    icon: delete_svg_filled,
    clickhandler: noteDeleteHandler
  }
];
const viewport_rect = window.visualViewport;

// TODO: make these DRY
/**
 * Simply store the value of the box in sync when it loses focus
 */
function noteboxOnChange(e) {
  let data = { [window.slug]: e.target.value };
  chrome.storage.sync.set(data)
    .then(() => { /* FIXME: maybe just keep a list of these to avoid walking the dom */
      console.log('set fufilled');
      document.querySelectorAll('.nb-menubar').forEach(el => {
        el.hidden = false
      });
      document.querySelectorAll('.nb-textarea').forEach(el => {
        el.readOnly = true;
        el.value = e.target.value;
      });
      document.querySelectorAll('.nb-button').forEach(el => {
        el.classList.add('nb-note-exists');
      });
    })
    .catch(err => console.log(err));
};

function noteDeleteHandler(e) {
  /* TODO: prompt for confirmation with an emoji */
  chrome.storage.sync.remove(slug)
    .then(() => {
      console.log('remove fulfilled');
      document.querySelectorAll('.nb-menubar').forEach(el => {
        el.hidden = true;
      });
      document.querySelectorAll('.nb-textarea').forEach(el => {
        el.readOnly = false;
        el.value = '';
      });
      document.querySelectorAll('.nb-button').forEach(el => {
        el.classList.remove('nb-note-exists');
      });
    })
    .catch(err => console.log(err));
  e.currentTarget.parentNode.nextSibling.focus();
}

function noteEditHandler(e) {
  let cur_textarea = e.currentTarget.parentNode.nextSibling;
  cur_textarea.readOnly = false;
  cur_textarea.focus();
  cur_textarea.setSelectionRange(cur_textarea.value.length,
    cur_textarea.value.length);
}

/**
 * Show the note box associated with the button
 */
function attachNoteButtonClickHandler(btn, box) {
  if (typeof box == 'undefined') return;
  btn.onclick = e => {
    e.preventDefault();
    box.hidden = !box.hidden;
    box.focus();
  }
}

function createNoteBox(node) {
  let notebox = document.createElement('div');
  notebox.hidden = true;
  notebox.appendChild(createNoteBoxWrapper(notebox_options));

  let p = node.parentNode.parentNode.parentNode;
  if (p.classList.contains(recipe_main_classname)) {
    notebox.classList.add('nb-container__horizontal');
    p.insertBefore(notebox, p.firstChild.nextSibling);
  }
  else if (p.classList.contains(sticky_box_classname)) {
    notebox.classList.add('nb-container__vertical');
    p.appendChild(notebox);
  }
  return notebox;
}

/**
 * nb wrapper{
 *   nb menu {
 *     ...nb options}, 
 *   nb textarea}
 * @param {object} options includes id, icon, click handler
 */
function createNoteBoxWrapper(options) {
  let nb_wrapper = document.createElement('div');
  nb_wrapper.classList.add('nb-wrapper');
  let nb_menubar = nb_wrapper.appendChild(document.createElement('div'));
  nb_menubar.classList.add('nb-menubar');
  let nb_textarea = nb_wrapper.appendChild(document.createElement('textarea'));
  if (window.note_exists) {
    nb_textarea.readOnly = true;
    nb_textarea.value = window.existing_note;
  } else {
    nb_menubar.hidden = true;
  }
  nb_textarea.placeholder = note_placeholder;
  nb_textarea.classList.add('nb-textarea');
  nb_textarea.onchange = noteboxOnChange;
  for (option of options) {
    let tmp = nb_menubar.appendChild(document.createElement('div'))
    tmp.classList.add(option.classname, 'nb-menubar-option');
    tmp.innerHTML = option.icon;
    tmp.onclick = option.clickhandler;
    tmp.title = option.title;
  }
  return nb_wrapper;
}

/**
 * Duplicate the style and structure of the boookmark button and 
 * add note functionality
 */
function createNoteButton(node) {
  // This is hacky but that's ok
  let tmp = node.cloneNode(true);
  let link = tmp.firstChild;
  delete link.dataset.eventClick;
  link.href = link.target = '';
  link.title = link.ariaLabel = "My Notes";
  link.classList.add('nb-button');
  if (window.note_exists) {
    link.classList.add('nb-note-exists');
    link.innerHTML = note_svg_filled.trim();
  }
  else {
    link.innerHTML = note_svg.trim();
  }
  link.firstChild.setAttribute('currentScale', 1.25);
  node.parentNode.insertBefore(tmp, node.nextSibling);
  return tmp;
}
