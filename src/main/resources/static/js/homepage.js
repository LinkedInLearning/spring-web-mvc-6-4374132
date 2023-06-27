/*  homepage
-------------------------------------------------------*/

if (document.querySelector('#hero'))
{
  /*
   *  hero carousel
   */
  const heroSlides = document.querySelectorAll('#hero .splide__slide');
  const heroSlidesTransitionednHandler = function ()
  {
    if (event.target !== this || event.propertyName !== 'opacity' || getComputedStyle(this)['opacity'] !== '1')
    {
      return;
    }

    for (const slide of heroSlides)
    {
      slide.classList.remove('opaque');
    }
  };
  const heroCarousel = new Splide('#hero',
    {
      autoplay: true,
      interval: 4000,
      type: 'fade',
      speed: 250,
      easing: 'ease',
      rewind: true
    });

  heroCarousel.on('arrows:mounted', function (prev, next)
  {
    prev.removeAttribute('aria-label');
    next.removeAttribute('aria-label');
  });

  // force the previous slide to be opaque during transition so that the transition looks better
  heroCarousel.on('move', function (newIndex, prevIndex, destIndex)
  {
    heroSlides[prevIndex].classList.add('opaque');
  });
  for (const slide of heroSlides)
  {
    slide.addEventListener('transitionend', heroSlidesTransitionednHandler);
  }

  heroCarousel.mount();
}



/*  product detail page
-------------------------------------------------------*/

else if (document.querySelector('#product'))
{
  // Colors
  document.querySelector('#product fieldset').addEventListener('change', function ()
  {
    const label = event.target.nextElementSibling,
      fullImage = document.querySelector('#product header .wrapper > img');
    fullImage.src = label.querySelector('img').src;
    fullImage.alt = label.getAttribute('data-full-img-alt')
  });
}



/*  Contact us page
-------------------------------------------------------*/

else if (document.querySelector('#contact'))
{
  const formEl = document.querySelector('#contact form'),
    dropZone = formEl.querySelector('.drop-zone');
  let errorMessageCount = 0,
    isScrolling = false;

  formEl.addEventListener('invalid', function ()
  {
    event.preventDefault();

    const formControl = event.target,
      isInRadioOrCheckboxGroup = formControl.matches('[type="radio"], [type="checkbox"]') && formEl.querySelectorAll(':scope [name="' + formControl.name + '"]').length > 1,
      formControlMasterWrapper = formControl.closest(isInRadioOrCheckboxGroup ? 'fieldset' : 'div');
    let errorMessage;

    formEl.classList.add('validation-triggered');

    if (isInRadioOrCheckboxGroup)
    {
      switch (formControl.name)
      {
        case 'newsletter':
          errorMessage = 'Would you like to sign up for Big Star newsletter?';
          break;

        case 'favorite[]':
          errorMessage = 'Please select your favorite Big Star Collections';
          break;
      }
    }
    else
    {
      switch (formControl.id)
      {
        case 'contact-email':
          errorMessage = 'Valid email required';
          break;

        case 'contact-name':
          errorMessage = 'Name is required';
          break;

        case 'contact-topic':
          errorMessage = 'Please select a topic';
          break;

        case 'contact-message':
          errorMessage = 'Please write a message';
          break;
      }
    }

    if (formControl.hasAttribute('aria-describedby'))
    {
      document.getElementById(formControl.getAttribute('aria-describedby')).firstChild.textContent = errorMessage + ' ';
    }
    else
    {
      ++errorMessageCount;
      formControl.setAttribute('aria-invalid', 'true');
      formControl.setAttribute('aria-describedby', 'error-message-' + errorMessageCount);
      formControlMasterWrapper.insertAdjacentHTML('beforeend', '<div id="error-message-' + errorMessageCount + '" class="error-message" role="alert">' + errorMessage + ' <span aria-hidden="true">*</span></div>');
      formControlMasterWrapper.classList.add('invalid-inside');
    }

    if (!isScrolling)
    {
      // scroll to the invalid form control wrapper if its top or bottom edge is not in view
      const firstInvalidFormControlWrapper = formEl.querySelector('.invalid-inside');
      if (firstInvalidFormControlWrapper.getBoundingClientRect().top < 0 || firstInvalidFormControlWrapper.getBoundingClientRect().bottom > window.innerHeight)
      {
        isScrolling = true;
        const scrollOffset = pageYOffset + firstInvalidFormControlWrapper.getBoundingClientRect().top,
          fixedScrollOffset = scrollOffset.toFixed();
        const detectScrollCompletion = function ()
        {
          if (pageYOffset.toFixed() === fixedScrollOffset)
          {
            isScrolling = false;
            window.removeEventListener('scroll', detectScrollCompletion);
            // focus the first invalid field for desktop devices
            if (!mobileBreakpointMq.matches)
            {
              firstInvalidFormControlWrapper.querySelector('[aria-invalid="true"]').focus();
            }
          }
        };
        window.addEventListener('scroll', detectScrollCompletion);
        window.scrollTo(
          {
            top: scrollOffset,
            behavior: 'smooth'
          });
      }
    }
  }, true);

  const revalidate = function ()
  {
    const formControl = event.target,
      relatedRadiosOrCheckboxes = formControl.matches('[type="radio"], [type="checkbox"]') && formControl.name && formEl.querySelectorAll(':scope [name="' + formControl.name + '"]'),
      isInRadioOrCheckboxGroup = relatedRadiosOrCheckboxes.length > 1,
      formControlMasterWrapper = formControl.closest(isInRadioOrCheckboxGroup ? 'fieldset' : 'div');

    if (!formEl.classList.contains('validation-triggered'))
    {
      return;
    }

    if (isInRadioOrCheckboxGroup)
    {
      // if already handled when one of the group members became valid
      if (!formControlMasterWrapper.classList.contains('invalid-inside'))
      {
        return;
      }

      if ([...relatedRadiosOrCheckboxes].find(radioOrCheckbox => radioOrCheckbox.checked === true) !== undefined)
      {
        for (const radioOrCheckbox of relatedRadiosOrCheckboxes)
        {
          radioOrCheckbox.removeAttribute('aria-invalid');
          radioOrCheckbox.removeAttribute('aria-describedby');
        }
        for (const radioOrCheckboxErrorMessage of formControlMasterWrapper.querySelectorAll('.error-message'))
        {
          radioOrCheckboxErrorMessage.remove();
        }
        formControlMasterWrapper.classList.remove('invalid-inside');
      }
      else
      {
        [...relatedRadiosOrCheckboxes].find(radioOrCheckbox => radioOrCheckbox.classList.contains('originally-required')).checkValidity();
      }
    }
    else
    {
      if (formControl.checkValidity())
      {
        formControl.removeAttribute('aria-invalid');
        formControl.removeAttribute('aria-describedby');
        formControlMasterWrapper.querySelector('.error-message')?.remove();
        formControlMasterWrapper.classList.remove('invalid-inside');
      }
    }
  };
  formEl.addEventListener('input', revalidate);
  formEl.addEventListener('blur', revalidate);
  formEl.addEventListener('change', revalidate);
  formEl.addEventListener('click', function ()
  {
    const errorMessage = event.target.closest('.error-message');
    if (errorMessage)
    {
      errorMessage.closest('.invalid-inside').querySelector('[aria-invalid="true"]:not([type="radio"]):not([type="checkbox"])').focus();
    }
  });

  formEl.addEventListener('submit', function ()
  {
    event.preventDefault();
    this.reportValidity();
  });

  // drag and drop
  dropZone.addEventListener('dragover', () =>
  {
    event.preventDefault();
    dropZone.classList.add('dragged-over');
  });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragged-over'));
  dropZone.addEventListener('drop', () =>
  {
    event.preventDefault();
    dropZone.classList.remove('dragged-over');
  });
}
