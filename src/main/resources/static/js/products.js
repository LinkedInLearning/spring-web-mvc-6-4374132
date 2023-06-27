/*
 *  products section
 */
if (document.querySelector('#products'))
{
  // Filter by
  const clearFiltersButton = document.querySelector('#wrapper-in-prod-header section header > a');
  const clearFilters = function ()
  {
    if (event.type === 'keyup')
    {
      if (event.key !== ' ' && event.key !== 'Enter')
      {
        return;
      }
    }

    for (const checkboxEl of document.querySelectorAll('#wrapper-in-prod-header details input'))
    {
      checkboxEl.checked = false;
    }
  };
  clearFiltersButton.addEventListener('click', clearFilters);
  clearFiltersButton.addEventListener('keyup', clearFilters);
  clearFiltersButton.addEventListener('keydown', textButtonKeydownHandler);

  const toggleProdFilterDetails = function ()
  {
    if (event.type === 'keydown' && event.key !== ' ') // Fix a Firefox bug that the browser does not prevent default on Space keydown on <summary>.
    {
      return;
    }

    event.preventDefault();
    const content = this.nextElementSibling;
    if (this.parentElement.open)
    {
      this.parentElement.classList.remove('open');
      content.style['height'] = content.querySelector('ul').clientHeight + 'px';
      getComputedStyle(content)['height']; // force a calculation of the value of this CSS property to make CSS transition work
      content.style['overflow'] = 'hidden';
      content.style['height'] = 0;
    }
    else
    {
      this.parentElement.open = true;
      this.parentElement.classList.add('open');
      content.style['height'] = content.querySelector('ul').clientHeight + 'px';
    }
  };
  const blurFilterOptOnTouchend = function ()
  {
    const label = event.target.closest('label');
    if (label)
    {
      setTimeout(() => label.previousElementSibling.blur(), 10);
    }
  };
  const prodFilterContTransitionendHandler = function ()
  {
    if (event.target !== this || event.propertyName !== 'height')
    {
      return;
    }

    if (this.clientHeight === 0)
    {
      this.parentElement.open = false;
    }
    else
    {
      this.style['height'] = '';
      this.style['overflow'] = '';
    }
  };
  for (const list of document.querySelectorAll('#products details ul'))
  {
    list.parentElement.classList.toggle('open', list.parentElement.open);
    list.previousElementSibling.addEventListener('click', toggleProdFilterDetails);
    if (isMoz)
    {
      list.previousElementSibling.addEventListener('keydown', toggleProdFilterDetails);
    }
    list.addEventListener('touchend', blurFilterOptOnTouchend);
    list.insertAdjacentHTML('beforebegin', '<div class="content"' + (list.parentElement.open === false ? ' style="height: 0; overflow: hidden;"' : '') + '></div>');
    list.previousElementSibling.addEventListener('transitionend', prodFilterContTransitionendHandler);
    list.previousElementSibling.append(list);
  }


  // mobile Filter by
  const wrapperInProdHeader = document.querySelector('#wrapper-in-prod-header');
  wrapperInProdHeader.insertAdjacentHTML('beforebegin', '<div id="filter-by-backdrop" class="dialog-backdrop"></div>');
  const filterByBackdrop = wrapperInProdHeader.previousElementSibling;
  filterByBackdrop.addEventListener('transitionend', dialogBackdropTransitionendHandler);
  const filterByResponsiveChange = function (mq)
  {
    if (mq.matches)
    {
      filterByBackdrop.append(wrapperInProdHeader);
      wrapperInProdHeader.setAttribute('role', 'dialog');
      wrapperInProdHeader.setAttribute('aria-modal', 'true');
      wrapperInProdHeader.setAttribute('aria-labelledby', 'label-filter-by');
      wrapperInProdHeader.style['display'] = 'none';
    }
    else
    {
      filterByBackdrop.after(wrapperInProdHeader);
      wrapperInProdHeader.removeAttribute('role');
      wrapperInProdHeader.removeAttribute('aria-modal');
      wrapperInProdHeader.removeAttribute('aria-labelledby');
      wrapperInProdHeader.style['display'] = '';
    }
  };
  mobileBreakpointMq.addListener(filterByResponsiveChange);
  filterByResponsiveChange(mobileBreakpointMq);

  document.querySelector('#products header .radio-menu-widget + button').addEventListener('click', function ()
  {
    wrapperInProdHeader.style['display'] = '';
    openDialogPlus('wrapper-in-prod-header', this);
  });
  const closeWrapperInProdHeaderHandler = function ()
  {
    if (event.type === 'click')
    {
      // if the backgroup receives a click event which was triggered by a child element
      if (this.matches('.dialog-backdrop') && event.target !== this)
      {
        return;
      }
    }

    closeDialog(wrapperInProdHeader.firstElementChild);
  };
  for (const closer of document.querySelectorAll('#filter-by-backdrop, #wrapper-in-prod-header > button'))
  {
    closer.addEventListener('click', closeWrapperInProdHeaderHandler);
  }


  // Sort by
  const sortByRadioMenuButton = document.querySelector('#btn-sort-by');
  sortByRadioMenuButton.nextElementSibling.style['display'] = 'none';
  sortByRadioMenuButton.nextElementSibling.addEventListener('transitionend', function ()
  {
    if (event.target !== this || event.propertyName !== 'opacity' || getComputedStyle(this)['opacity'] !== '0')
    {
      return;
    }

    this.style['display'] = 'none';
    this.style['right'] = '';
  });
  new FontMenuButton(sortByRadioMenuButton).init();
}
