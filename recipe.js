/* injected after any files from css, but before any other DOM is 
constructed or any other script is run. at this point we only
need the url of the window to check storage */
var [slug, ...preslug] = window.location.pathname.substring(1).split('/').reverse();
console.log(`this is a recipe for ${slug}`);

// TODO: Preload notes for this recipe

const note_svg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-sticky" viewBox="0 0 16 16">
  <path d="M2.5 1A1.5 1.5 0 0 0 1 2.5v11A1.5 1.5 0 0 0 2.5 15h6.086a1.5 1.5 0 0 0 1.06-.44l4.915-4.914A1.5 1.5 0 0 0 15 8.586V2.5A1.5 1.5 0 0 0 13.5 1h-11zM2 2.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5V8H9.5A1.5 1.5 0 0 0 8 9.5V14H2.5a.5.5 0 0 1-.5-.5v-11zm7 11.293V9.5a.5.5 0 0 1 .5-.5h4.293L9 13.793z"/>
</svg>`;
const note_svg_filled = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="bi bi-sticky-fill" viewBox="0 0 16 16">
  <path d="M2.5 1A1.5 1.5 0 0 0 1 2.5v11A1.5 1.5 0 0 0 2.5 15h6.086a1.5 1.5 0 0 0 1.06-.44l4.915-4.914A1.5 1.5 0 0 0 15 8.586V2.5A1.5 1.5 0 0 0 13.5 1h-11zm6 8.5a1 1 0 0 1 1-1h4.396a.25.25 0 0 1 .177.427l-5.146 5.146a.25.25 0 0 1-.427-.177V9.5z"/>
</svg>`;
const add_note_color = `rgb(201, 201, 201)`;
const view_note_color = `rgb(51, 51, 51)`;
const classnames = '.social-icons__list-item--bookmarkactivated,'
  + ' .social-icons__list-item--bookmark';
const viewport_rect = window.visualViewport;
const notebox = document.createElement('textarea');
notebox.classList.add('notebox');
notebox.hidden = true;

notebox.onchange = e => {
  let data = { [slug]: e.target.value };
  chrome.storage.sync.set(data)
    .then(console.log('fufilled'))
    .catch(err => console.log(err));
};

document.addEventListener('DOMContentLoaded', () => {
  // Can't add buttons till the dom is constructed obv
  console.log('DOM fully loaded and parsed');
  document.querySelectorAll(classnames).forEach(createNoteButton);
});

function createNoteButton(node) {
  // This is hacky but that's ok
  console.log('cloning button');
  let tmp = node.cloneNode(true);
  tmp.style.position = "relative";
  let link = tmp.firstChild;
  delete link.dataset.eventClick;
  link.href = link.target = '';
  link.title = link.ariaLabel = "Notes";
  link.innerHTML = note_svg;
  link.onclick = noteButtonClickHandler;
  tmp.appendChild(notebox);
  node.parentNode.insertBefore(tmp, node.nextSibling)
}

function noteButtonClickHandler(e) {
  e.preventDefault();
  let button_rect = e.target.getBoundingClientRect();
  let xp = e.clientX / viewport_rect.width;
  let yp = e.clientY / viewport_rect.height;
  console.log(xp, yp);
  // TODO: Show or hide the textarea, use `appendChild` to move it under the button then show it
  // Mobile: take up the whole screen either above or below the button
  // Smaller laptop or tablet: same thing just leave more margin on the sides
  // Normal sized screen (1024px+): Take space to the right above or below the button or in the middle
}