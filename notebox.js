/* injected after any files from css, but before any other DOM is 
constructed or any other script is run. at this point we only
need the url of the window to check storage */
var [slug, ...preslug] = window.location.pathname.substring(1).split('/').reverse();
console.log(`this is a recipe for ${slug}`);

/* TODO:
  - preload notes for recipe
  - add an appropriately positioned and styled div next to each button
  - add a note box wrapper inside each note div
    - make them slide open in the correct way
    - add `noteboxOnChange` to each
*/
document.addEventListener('DOMContentLoaded', () => {
  // Can't add buttons till the dom is constructed obv
  console.log('DOM fully loaded and parsed');
  document.querySelectorAll(classnames).forEach(node => {
    let nbtn = createNoteButton(node);
    let nbox = createNoteBox(node);
    attachNoteButtonClickHandler(nbtn, nbox);
  });
});

const note_svg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-sticky" viewBox="0 0 16 16">
  <path d="M2.5 1A1.5 1.5 0 0 0 1 2.5v11A1.5 1.5 0 0 0 2.5 15h6.086a1.5 1.5 0 0 0 1.06-.44l4.915-4.914A1.5 1.5 0 0 0 15 8.586V2.5A1.5 1.5 0 0 0 13.5 1h-11zM2 2.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5V8H9.5A1.5 1.5 0 0 0 8 9.5V14H2.5a.5.5 0 0 1-.5-.5v-11zm7 11.293V9.5a.5.5 0 0 1 .5-.5h4.293L9 13.793z"/>
</svg>`;
const note_svg_filled = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="bi bi-sticky-fill" viewBox="0 0 16 16">
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
const sticky_box_classname = `stick-box__primary`;
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
    clickhander: noteDeleteHandler
  }
];
const viewport_rect = window.visualViewport;

/**
 * Simply store the value of the box in sync when it loses focus
 */
function noteboxOnChange(e) {
  let data = { [slug]: e.target.value };
  chrome.storage.sync.set(data)
    .then(console.log('fufilled'))
    .catch(err => console.log(err));
};

/**
 * Show the note box associated with the button
 */
function attachNoteButtonClickHandler(btn, box) {
  btn.onclick = e => {
    e.preventDefault();
    box.hidden = !box.hidden;
  }
}

function noteDeleteHandler(e) { /* TODO: */ }
function noteEditHandler(e) { /* TODO: */ }

/**
 * Create a note box which unfolds down from mid & small screen buttons
 * @param {Node} reference_node element which contains social list wrapper
 */
function createHorizontal(reference_node) {
  let notebox = document.createElement('div');
  notebox.classList.add('nb-container__horizontal');
  notebox.hidden = true;
  notebox.appendChild(createNoteBoxWrapper(notebox_options));
  reference_node.insertBefore(notebox, reference_node.firstChild.nextSibling);
  return notebox;
}
/**
 * Create a note box
 * @param {Node} parent_node element which contains social list wrapper
 */
function createVertical(parent_node) { /* TODO: */ }

function createNoteBox(node) {
  let p = node.parentNode.parentNode.parentNode;
  if (p.classList.contains(recipe_main_classname)) {
    return createHorizontal(p);
  }
  else if (p.classList.contains(sticky_box_classname)) {
    return createVertical(p);
  }
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
  nb_textarea.placeholder = "Enter your note here!"
  nb_textarea.classList.add('nb-textarea');
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
  console.log('cloning button');
  let tmp = node.cloneNode(true);
  tmp.style.position = "relative";
  let link = tmp.firstChild;
  delete link.dataset.eventClick;
  link.href = link.target = '';
  link.title = link.ariaLabel = "My Notes";
  link.innerHTML = note_svg.trim();
  link.firstChild.setAttribute('currentScale', 1.25);
  node.parentNode.insertBefore(tmp, node.nextSibling)
  return tmp;
}