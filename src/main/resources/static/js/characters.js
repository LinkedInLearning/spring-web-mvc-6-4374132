/*
 *  character list
 */
if (document.querySelector('.char-list'))
{
  for (const moreLink of document.querySelectorAll('.char-list dd > a'))
  {
    moreLink.insertAdjacentHTML('afterend', '<button type="button" class="button bordered grape modal-opener">Quick view</button>');
  }
  const quickView = document.querySelector('#quick-view');
  quickView.style['display'] = 'none';
  quickView.insertAdjacentHTML('beforebegin', '<div id="quick-view-backdrop" class="dialog-backdrop"></div>');
  quickView.previousElementSibling.append(quickView);
  quickView.parentElement.addEventListener('transitionend', dialogBackdropTransitionendHandler);
  document.querySelector('main').addEventListener('click', function ()
  {
    if (!event.target.matches('.modal-opener'))
    {
      return;
    }

    const character = event.target.closest('div');
    quickView.style['display'] = '';
    quickView.querySelector('h1').textContent = character.querySelector('dt').textContent;
    quickView.querySelector('h1 + p').textContent = character.querySelector('dt + dd').textContent; /* job title */
    quickView.querySelector('header + p').innerHTML = character.querySelector('dt + dd + dd + dd').innerHTML; /* description */
    quickView.querySelector('header ~ a').href = character.querySelector('dd > a').href;
    quickView.querySelector('.wrapper > img').alt = 'Full image of ' + character.querySelector('dt').textContent;
    openDialogPlus('quick-view', event.target);
  });
  const closeQuickViewHandler = function ()
  {
    if (this.matches('.dialog-backdrop') && event.target !== this)
    {
      return;
    }

    closeDialog(quickView.firstElementChild);
  };
  for (const closer of document.querySelectorAll('#quick-view-backdrop, #quick-view > button'))
  {
    closer.addEventListener('click', closeQuickViewHandler);
  }

  // if not being preloaded, the character image sometimes has a delay in changing (when opening Quck View of a different character) on Chrome
  const preloadCharFullImage = function ()
  {
    const character = event.target.closest('.char-list > div');
    if (character && getComputedStyle(quickView.parentElement)['opacity'] === '0')
    {
      quickView.querySelector('.wrapper > img').src = character.getAttribute('data-full-img');
    }
  }
  document.querySelector('main').addEventListener('mouseover', preloadCharFullImage);
  document.querySelector('main').addEventListener('focusin'  , preloadCharFullImage);
}
