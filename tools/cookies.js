let gActiveContentPageNode = null;
let gMouseHeldAboveThreshold = false;

function setCookie(name, value, days) {

  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  let expires = "; expires=" + date.toUTCString();
  document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
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

  if (targetCategoryPageName === "spells.md" || targetCategoryPageName === "conditions.md") {
    let resultCookie;
    let pageCookie = getCookie(contentPageName);
    let categories = pageCookie?.split('|') ?? [];

    let foundExistingCategory = false;
    for (let i = 0; i < categories.length; ++i) {
      let categoryEntries = categories[i].split(':');
      if (categoryEntries.length > 0 && categoryEntries[0] === targetCategoryPageName) {
        let foundExistingEntry = false;
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
          console.log(`ADD tag to inline-link:\nContent Page '${contentPageName}'\nCategory '${targetCategoryPageName}'\nTag Name '${targetTagName}'`);
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

    resultCookie = categories.join('|');

    setCookie(contentPageName, resultCookie, 30);
  }
  else {
    console.log(`Attempted to tag inline-link:\nContent Page '${contentPageName}'\nCategory '${targetCategoryPageName}'\nTag Name '${targetTagName}'`);
  }

  //optional: sort the list? 
}

function getCategoryPageNameFromUrl(url) {
  return url.slice(0, url.indexOf('#')).replace(/(:?\.\/)|(?:\.\.\/)/gm, "");
}
function getTagNameFromUrl(url) {
  return url.slice(url.indexOf('#') + 1);
}

function applyStyleToTaggedInlineLinks(contentPageName) {
  //TODO optimize this for single element changes
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

// EXECUTION
{

  let gMouseDownTimer = null;
  window.addEventListener("mousedown", (event) => {
    gMouseDownTimer = setTimeout(() => {
      gMouseHeldAboveThreshold = true;
    }, 500);
  });
  window.addEventListener("mouseup", (event) => {
    clearTimeout(gMouseDownTimer);
  });

  document.body.addEventListener("click", (event) => {
    if (gMouseHeldAboveThreshold) {
      gMouseHeldAboveThreshold = false;
      if (event.target.classList.contains("inline-link")) {
        if (event.target.dataset.url && gActiveContentPageNode) {
          const categoryPageName = getCategoryPageNameFromUrl(event.target.dataset.url);
          const tagName = getTagNameFromUrl(event.target.dataset.url);
          toggleInlineLinkTag(gActiveContentPageNode.name, categoryPageName, tagName);
          //TODO make this a single element change
          applyStyleToTaggedInlineLinks(gActiveContentPageNode.name);
        }
      }
    }
  });

}