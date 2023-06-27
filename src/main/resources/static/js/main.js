/*-----------------------------------------------------

    Title :  Big Star Collectibles
    Usage :  main JS
    Edited:  2022-09-30

-------------------------------------------------------*/



/*  utilities
-------------------------------------------------------*/

const mobileBreakpointMq = matchMedia('(max-width: 991px)'),
      isMoz = 'mozInnerScreenX' in window;

function openDialogPlus(dialogId, focusAfterClosed, focusFirst)
{
	setTimeout(function () // add a small delay for smoother transition effect
	{
		// if the vertical scrollbar is present
		if (document.body.scrollHeight > window.innerHeight)
		{
			// set body's right padding as the width of a vertical scrollbar
			document.body.style['padding-right'] = window.innerWidth - document.documentElement.clientWidth + 'px';
		}
		document.body.style['overflow'] = 'hidden';
		openDialog(dialogId, focusAfterClosed, focusFirst)
	}, mobileBreakpointMq.matches ? 50 : 10);
};

function dialogBackdropTransitionendHandler()
{
	if (event.target !== this || event.propertyName !== 'opacity' || getComputedStyle(this)['opacity'] !== '0')
	{
		return;
	}
	document.body.style['padding-right'] = '';
	document.body.style['overflow'] = '';
	this.querySelector('[role="dialog"]').style['display'] = 'none';
};

function textButtonKeydownHandler()
{
	if (event.key === ' ')
	{
		event.preventDefault();
	}
};


/*  common
-------------------------------------------------------*/

/*
 *  disable outline for mouse clicks
 */
let isInteractedWithMouse = false;
document.documentElement.addEventListener('mousedown', () => isInteractedWithMouse = true, true);
document.documentElement.addEventListener('keydown', () => isInteractedWithMouse = false, true);
document.documentElement.addEventListener('focus', () => isInteractedWithMouse && event.target.classList.add('no-outline'), true);
document.documentElement.addEventListener('blur', () => event.target.classList.remove('no-outline'), true);



/*
 *  blur a certain focused elements
 */
document.body.addEventListener('mouseleave', function ()
{
	const targetedEl = event.target.closest('label, button, a, summary');
	if (targetedEl)
	{
		if (targetedEl.matches('label'))
		{
			for (const sibling of targetedEl.parentElement.children)
			{
				if (sibling.matches('[type="checkbox"], [type="radio"]'))
				{
					sibling.blur();
				}
			}
		}
		else
		{
			targetedEl.blur();
		}
	}
}, true);



/*
 *  form elements
 */

// select
function selectChangeHandler()
{
	this.classList.toggle('placeholder-shown', this.value === '');
};
for (const selectEl of document.querySelectorAll('select'))
{
	selectEl.classList.toggle('placeholder-shown', selectEl.value === '');
	selectEl.addEventListener('change', selectChangeHandler);
}

// required checkboxes
function changeCheckboxesRequiredStatus()
{
	const relatedCheckboxes = document.querySelectorAll('input[type="checkbox"][name="' + this.name + '"]');
	if ([...relatedCheckboxes].find(checkboxEl => checkboxEl.checked === true) !== undefined)
	{
		for (const checkboxEl of relatedCheckboxes)
		{
			if (checkboxEl.classList.contains('originally-required'))
			{
				checkboxEl.required = false;
			}
		}
	}
	else
	{
		if (relatedCheckboxes[0].closest('.validation-triggered'))
		{
			relatedCheckboxes[0].closest('fieldset').classList.add('invalid-inside');
		}
		for (const checkboxEl of relatedCheckboxes)
		{
			if (checkboxEl.classList.contains('originally-required'))
			{
				checkboxEl.required = true;
			}
		}
	}
};
for (const checkboxEl of document.querySelectorAll('input[type="checkbox"][name$="[]"][required]'))
{
	if (checkboxEl.classList.contains('changeCheckboxesRequiredStatus-bound'))
	{
		continue;
	}

	const relatedCheckboxes = document.querySelectorAll('input[type="checkbox"][name="' + checkboxEl.name + '"]');
	for (const checkboxMember of relatedCheckboxes)
	{
		checkboxMember.addEventListener('click', changeCheckboxesRequiredStatus);
		checkboxMember.classList.add('changeCheckboxesRequiredStatus-bound', 'in-a-required-group');
		if (checkboxMember.required)
		{
			checkboxMember.classList.add('originally-required');
		}
	}
}



/*
 *  site navigation
 */
const siteNav = document.querySelector('#banner nav'),
      desktopSiteNavCategWrappers = document.querySelectorAll('#banner nav li > .wrapper'),
      desktopSiteNavCategWrappersTransDelay = 200;


// increase rows for desktop nav categories which have more than 10 items
for (const category of document.querySelectorAll('#banner nav:not(.clone) .wrapper > figure > ul'))
{
	if (category.querySelector(':scope > li:nth-child(11)'))
	{
		const newNumOfRows = Math.ceil(category.children.length / 2);
		category.style['grid-template-rows'] = 'repeat(' + newNumOfRows + ', 1fr)';
	}
}

// toggle desktop site nav category wrappers
let desktopSiteNavCategWrapperBgTimeout;
function desktopSiteNavCategWrappersTransitionendHanlder()
{
	if (event.target !== this || event.propertyName !== 'opacity' || getComputedStyle(this)['opacity'] !== '0')
	{
		return;
	}

	this.style['pointer-events'] = '';
	// if none of the wrappers is displaying
	if ([...desktopSiteNavCategWrappers].find(wrapper => getComputedStyle(wrapper)['opacity'] !== '0') === undefined)
	{
		siteNav.style.setProperty('--height-wrapper-bg', '');
	}
};
function showDesktopSiteNavCategWrapper()
{
	clearTimeout(desktopSiteNavCategWrapperBgTimeout);
	for (const wrapper of desktopSiteNavCategWrappers)
	{
		if (wrapper.parentElement === this)
		{
			this.classList.add('active');
		}
		else
		{
			wrapper.parentElement.classList.remove('active');
		}
	}

	if (event.type === 'mouseenter')
	{
		this.classList.add('mouseentered');
	}

	this.querySelector('.wrapper').style['pointer-events'] = 'auto';
	siteNav.style.setProperty('--opacity-wrapper-bg', 1);
	siteNav.style.setProperty('--height-wrapper-bg', this.querySelector('.wrapper').offsetHeight + 'px');
};
function hideDesktopSiteNavCategWrapper()
{
	if (event.type === 'focusout')
	{
		if (this.classList.contains('mouseentered'))
		{
			return;
		}
	}

	this.classList.remove('mouseentered');
	this.querySelector(':focus')?.blur();
	// if none of the other nav items is active
	if ([...desktopSiteNavCategWrappers].find(wrapper => !this.contains(wrapper) && wrapper.parentElement.classList.contains('active')) === undefined)
	{
		desktopSiteNavCategWrapperBgTimeout = setTimeout(() =>
		{
			this.classList.remove('active');
			siteNav.style.setProperty('--opacity-wrapper-bg', '');
		}, desktopSiteNavCategWrappersTransDelay);
	}
};
for (const wrapper of desktopSiteNavCategWrappers)
{
	wrapper.addEventListener('transitionend', desktopSiteNavCategWrappersTransitionendHanlder);
	wrapper.parentElement.addEventListener('mouseenter', showDesktopSiteNavCategWrapper);
	wrapper.parentElement.addEventListener('focusin'   , showDesktopSiteNavCategWrapper);
	wrapper.parentElement.addEventListener('mouseleave', hideDesktopSiteNavCategWrapper);
	wrapper.parentElement.addEventListener('focusout'  , hideDesktopSiteNavCategWrapper);
}



/*
 *  toggle search popup
 */
function closeSearchPopup()
{
	const activeSearchPopup = document.querySelector('[id^="search-popup"].active'),
	      activeSearchPopupToggler = activeSearchPopup.previousElementSibling;

	if (event.type === 'click')
	{
		// if the event was triggered by clicking inside the form or while the popup is already hidden
		if (event.target.closest('[role="search"]') || getComputedStyle(activeSearchPopup)['opacity'] !== '1')
		{
			return;
		}
	}
	else // event.type === 'keyup'
	{
		if (event.key !== 'Escape')
		{
			return;
		}
	}

	document.removeEventListener('click', closeSearchPopup);
	activeSearchPopupToggler.setAttribute('aria-expanded', 'false');
	activeSearchPopup.setAttribute('aria-hidden', 'true'); // hide the popup and its focusable children with `aria-hidden` and `tabindex`, respectively, due to a Javascript bug (not exclusive to jQuery): https://github.com/jquery/jquery/issues/4950
	for (const focusable of activeSearchPopup.querySelectorAll('input, button'))
	{
		focusable.setAttribute('tabindex', -1);
	}
	if (event.type === 'keyup' || event.target.closest('[id^="search-popup"].active > button'))
	{
		activeSearchPopupToggler.focus();
	}
	activeSearchPopup.classList.remove('active');
};

function toggleSearchPopup()
{
	const searchPopupToggler = this,
	      searchPopup = searchPopupToggler.nextElementSibling;
	if (searchPopupToggler.getAttribute('aria-expanded') === 'false')
	{
		document.addEventListener('click', closeSearchPopup);
		searchPopupToggler.setAttribute('aria-expanded', 'true');
		searchPopup.removeAttribute('aria-hidden');
		for (const focusable of searchPopup.querySelectorAll('input, button'))
		{
			focusable.removeAttribute('tabindex');
		}
		searchPopup.querySelector('input').focus();
		searchPopup.classList.add('active');
	}
	else
	{
		closeSearchPopup();
	}
};

function initSearchWidget(searchPopupToggler)
{
	const searchPopup = searchPopupToggler.nextElementSibling;
	searchPopupToggler.addEventListener('click', toggleSearchPopup);
	searchPopup.addEventListener('keyup', closeSearchPopup);
	searchPopup.querySelector('form + button')?.addEventListener('click', closeSearchPopup);
};

initSearchWidget(document.querySelector('#search-widget > button'));
