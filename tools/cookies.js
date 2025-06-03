let gActiveContentPageNode = null;
let gMouseHeldAboveThreshold = false;

function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  let expires = "; expires=" + date.toUTCString();
  document.cookie = name + "=" + encodeURIComponent(value) + expires + ";path=/";
}

function getCookie(name) {
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length + 1, c.length);
    }
  }
  return null;
}

function toggleInlineLinkTag(contentPageName, targetCategoryPageName, targetTagName) {
  if (true || targetCategoryPageName === "spells.md" || targetCategoryPageName === "conditions.md") {
    let resultCookie;
    let pageCookie = getCookie(contentPageName);
    let categories = pageCookie?.split('|') ?? [];

    let foundExistingCategory = false;
    let foundExistingEntry = false;
    for (let i = 0; i < categories.length; ++i) {
      let categoryEntries = categories[i].split(':');
      if (categoryEntries.length > 0 && categoryEntries[0] === targetCategoryPageName) {
        for (let j = 1; j < categoryEntries.length; ++j) {
          if (categoryEntries[j] === targetTagName) {
            [categoryEntries[j], categoryEntries[categoryEntries.length - 1]] = [categoryEntries[categoryEntries.length - 1], categoryEntries[j]];
            categoryEntries.length--;
            console.log(`REMOVE tag from inline-link:\nContent Page '${contentPageName}'\nCategory '${targetCategoryPageName}'\nTag Name '${targetTagName}'`);
            foundExistingEntry = true;
            break;
          }
        }
        if (!foundExistingEntry) {
          categoryEntries.push(targetTagName);
        }
        categories[i] = categoryEntries.join(':');
        foundExistingCategory = true;
        break;
      }
    }

    if (!foundExistingCategory) {
      categories.push(`${targetCategoryPageName}:${targetTagName}`);
    }
    if (!foundExistingEntry) {
      console.log(`ADD tag to inline-link:\nContent Page '${contentPageName}'\nCategory '${targetCategoryPageName}'\nTag Name '${targetTagName}'`);
    }
    resultCookie = categories.join('|');
    setCookie(contentPageName, resultCookie, 365);
  }
  else {
    console.log(`Attempted to tag inline-link:\nContent Page '${contentPageName}'\nCategory '${targetCategoryPageName}'\nTag Name '${targetTagName}'`);
  }
  //TODO optional: sort the list?
}

function getCustomTrackerCookieValue(contentPageName, targetElementName) {
  let pageCookie = getCookie(contentPageName);
  let categories = pageCookie?.split('|') ?? [];
  let uriEscapedName = encodeURIComponent(targetElementName);
  for (let i = 0; i < categories.length; ++i) {
    if (categories.startsWith("custom-tracker-cookie:")) {
      let categoryEntries = categories[i].split(':');
      for (let j = 1; j < categoryEntries.length; ++j) {
        let customTracker = categoryEntries[j].split('=');
        if (customTracker.length === 2 && customTracker[0] === uriEscapedName) {
          return decodeURIComponent(customTracker[1]);
        }
      }
      break;
    }
  }
  return null;
}

function getCategoryPageNameFromUrl(url) {
  return url.slice(0, url.indexOf('#')).replace(/(:?\.\/)|(?:\.\.\/)/gm, "");
}
function getTagNameFromUrl(url) {
  return url.slice(url.indexOf('#') + 1);
}

function applyCookieTagsToInlineLinks(contentPageName) {
  //TODO optimize this for single element changes, for now this loops through all inline-link and cookies
  let pageCookie = getCookie(contentPageName);
  if (pageCookie) {
    let categoryMap = new Map();
    let categories = pageCookie?.split('|') ?? [];
    for (let i = 0; i < categories.length; ++i) {
      let split = categories[i].split(':');
      if (split.length > 0) {
        categoryMap.set(split[0], split.length > 1 ? split.slice(1) : []);
      }
    }

    const inlineLinks = document.querySelectorAll('.inline-link');
    for (let i = 0; i < inlineLinks.length; ++i) {
      const url = inlineLinks[i].dataset.url;
      const categoryPageName = getCategoryPageNameFromUrl(url);
      let category = categoryMap.get(categoryPageName);
      if (category) {
        const targetTagName = getTagNameFromUrl(url);
        if (category.find(tagName => tagName === targetTagName)) {
          inlineLinks[i].classList.add('inline-link-tagged');
        }
        else {
          inlineLinks[i].classList.remove('inline-link-tagged');
        }
      }
    }
  }
}

function isValidCssColor(color) {
  const s = new Option().style;
  s.color = color;
  return s.color !== '';
}

function applyCookieValueToCustomTracker_DiscreteCounter(discreteCounter, value) {
  discreteCounter.dataset.value = value;
  //console.log(`Setting UI Custom Tracker Element:\n'${discreteCounter.dataset.name}' set to '${value}'`);
  let child = discreteCounter.firstElementChild;

  let validColor = isValidCssColor(discreteCounter.dataset.color) ? discreteCounter.dataset.color : '';

  while (child) {
    if (child.dataset.value <= value) {
      child.classList.add('active');
//      child.style.backgroundColor = validColor;
    }
    else {
// TODO setting custom colors is a little awkward
      //      child.style.backgroundColor = '';
      child.classList.remove('active');
    }
    child = child.nextElementSibling;
  }
}

function applyCookieValuesToCustomTrackers(contentPageName) {
  let pageCookie = getCookie(contentPageName);
  if (pageCookie) {
    let trackerMap = new Map();
    let categories = pageCookie?.split('|') ?? [];
    for (let i = 0; i < categories.length; ++i) {
      if (categories[i].startsWith("custom-tracker-cookie:")) {
        let categoryEntries = categories[i].split(':');
        for (let j = 1; j < categoryEntries.length; ++j) {
          let customTracker = categoryEntries[j].split('=');
          if (customTracker.length === 2) {
            trackerMap.set(customTracker[0], decodeURIComponent(customTracker[1]));
          }
        }
        break;
      }
    }

    const customTrackers = document.querySelectorAll('.custom-tracker');
    for (let i = 0; i < customTrackers.length; ++i) {
      const trackerName = encodeURIComponent(customTrackers[i].dataset.name);
      let cookieValue = trackerMap.get(trackerName);
      if (cookieValue) {
        if (customTrackers[i].classList.contains("discrete-counter")) {
          applyCookieValueToCustomTracker_DiscreteCounter(customTrackers[i], cookieValue);
        }
      }
    }
  }
}

function setCustomTrackerCookieValue(contentPageName, customTrackerName, value) {
  let resultCookie;
  let pageCookie = getCookie(contentPageName);
  let categories = pageCookie?.split('|') ?? [];
  let uriEscapedName = encodeURIComponent(customTrackerName);
  const customTrackerValueString = `${uriEscapedName}=${encodeURIComponent(value)}`;
  let foundExistingCategory = false;
  let foundExistingEntry = false;
  for (let i = 0; i < categories.length; ++i) {
    if (categories[i].startsWith("custom-tracker-cookie:")) {
      let categoryEntries = categories[i].split(':');
      for (let j = 1; j < categoryEntries.length; ++j) {
        let customTrackers = categoryEntries[j].split('=');
        if (customTrackers[0] === uriEscapedName) {

          categoryEntries[j] = customTrackerValueString;
          foundExistingEntry = true;
          break;
        }
      }
      if (!foundExistingEntry) {
        categoryEntries.push(customTrackerValueString);
      }
      categories[i] = categoryEntries.join(':');
      foundExistingCategory = true;
      break;
    }
  }
  if (!foundExistingCategory) {
    categories.push(`custom-tracker-cookie:${customTrackerValueString}`);
  }
  console.log(`SETTING value of custom-tracker-cookie:\nContent Page '${contentPageName}'\nTracker '${customTrackerName}'\nValue '${value}'`);
  resultCookie = categories.join('|');
  setCookie(contentPageName, resultCookie, 365);
  // TODO make this a single element change
  applyCookieValuesToCustomTrackers(gActiveContentPageNode.name);
}

function processTagHold(event) {
  let target = event.target;
  while (target && !target.classList.contains("inline-link")) {
    target = target.parentElement;
  }

  if (target) {
    if (target.dataset.url && gActiveContentPageNode) {
      const categoryPageName = getCategoryPageNameFromUrl(target.dataset.url);
      const tagName = getTagNameFromUrl(target.dataset.url);
      toggleInlineLinkTag(gActiveContentPageNode.name, categoryPageName, tagName);
      //TODO make this a single element change
      applyCookieTagsToInlineLinks(gActiveContentPageNode.name);
    }
  }
}

// This is just for debugging the android emergencies
function androidLog(text) {
  let androidLogNode = document.getElementById('android-log');
  if (!androidLogNode) {
    const equipmentNode = document.getElementById('equipment');
    androidLogNode = document.createElement('p');
    newP.id = 'android-log';
    equipmentNode.appendChild(androidLogNode);
  }
  androidLogNode.innerHTML = text;
}

// EXECUTION
{
  let gMouseDownTimer = null;
  window.addEventListener("mousedown", (event) => {
    gMouseHeldAboveThreshold = false;
    gMouseDownTimer = setTimeout(() => {
      processTagHold(event);
      gMouseHeldAboveThreshold = true;
    }, 500);
  });
  window.addEventListener("mouseup", (event) => {
    clearTimeout(gMouseDownTimer);
  });

  let gStartTouchLocation = { x: 0, y: 0 };
  let gCurrentTouchLocation = { x: 0, y: 0 };
  window.addEventListener("touchstart", (event) => {
    gStartTouchLocation.x = event.touches[0].clientX;
    gStartTouchLocation.y = event.touches[0].clientY;
    gCurrentTouchLocation = { ...gStartTouchLocation };

    gMouseHeldAboveThreshold = false;
    gMouseDownTimer = setTimeout(() => {
      const deltaX = gCurrentTouchLocation.x - gStartTouchLocation.x;
      const deltaY = gCurrentTouchLocation.y - gStartTouchLocation.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      if (distance < 100) {
        processTagHold(event);
      }
      gMouseHeldAboveThreshold = true;
    }, 500);
  });

  window.addEventListener("touchmove", (event) => {
    gCurrentTouchLocation.x = event.touches[0].clientX;
    gCurrentTouchLocation.y = event.touches[0].clientY;
  });
  window.addEventListener("touchend", (event) => {
    clearTimeout(gMouseDownTimer);
  });
  window.addEventListener("touchcancel", (event) => {
    clearTimeout(gMouseDownTimer);
  });
}
