console.log('hello from handy ingredients!');

const layout_sidebar_svg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-layout-sidebar-inset-reverse" viewBox="0 0 16 16">
  <path d="M2 2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2zm12-1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h12z"/>
  <path d="M13 4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V4z"/>
</svg>`;
const x_lg_svg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"/>
  <path fill-rule="evenodd" d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"/>
</svg>`;

const ingredient_list = document.querySelector(`[data-testid='IngredientList']`);
const instructions = document.querySelector(`[data-testid='InstructionsWrapper']`);
const aside = document.querySelector(`[data-testid='RecipePageAside']`);
const handy_ingredients = ingredient_list.cloneNode(true);
const split_view_button = document.createElement('div');
const split_view_cancel = document.createElement('div');

ingredient_list.hidden = true;

split_view_button.classList.add('split-view-button');
split_view_button.title = "Split view ingredients";
split_view_button.innerHTML = layout_sidebar_svg;
ingredient_list.firstChild.appendChild(split_view_button);

split_view_cancel.classList.add('split-view-cancel');
split_view_cancel.title = "Close split view";
split_view_cancel.innerHTML = x_lg_svg;
handy_ingredients.firstChild.appendChild(split_view_cancel);

handy_ingredients.classList.add('handy-ingredients');
aside.hidden = true;
aside.parentNode.appendChild(handy_ingredients);


split_view_button.onclick = () => {
  ingredient_list.hidden = true;
  aside.hidden = true;
  handy_ingredients.hidden = false;
};
split_view_cancel.onclick = () => {
  ingredient_list.hidden = false;
  handy_ingredients.hidden = true;
  aside.hidden = false;
};