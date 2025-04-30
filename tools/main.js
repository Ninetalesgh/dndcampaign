
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
/// INDEXING
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////

class TreeNode {
  constructor(value) {
    this.name = value ? value.innerText : '';
    this.element = value;
    this.parent = null;
    this.children = [];
  }
  addChild(childNode) {
    this.children.push(childNode);
    childNode.parent = this;
  }
}
var rootNode = new TreeNode(null);

function addTreeNodeToIndexViewRecursive(treeNode, parentElement) {
  parentElement.innerHTML = (treeNode.children.length > 0 ? '- ' : '') + treeNode.name;//.replace(/^.*(\/[a-zA-Z0-9_]+.md)$/g,'$1');
  if (treeNode.children.length > 0) {
    const unorderedList = document.createElement('ul');

    unorderedList.onclick = function (e) {
      e.target.classList.toggle('collapsed');
      if (e.target.innerHTML[0] === '+' || e.target.innerHTML[0] === '-') {
        let char = e.target.innerHTML[0] === '+' ? '-' : '+';
        e.target.innerHTML = char + e.target.innerHTML.slice(1);

        e.stopPropagation();
      }
    };

    treeNode.children.forEach(childNode => {
      const listItem = document.createElement('li');

      // Set Link
      if (childNode.children.length === 0) {
        const a = document.createElement('a');
        a.href = `#${filterSectionSpecialCharacters(childNode.name)}`;
        listItem.appendChild(a);
        addTreeNodeToIndexViewRecursive(childNode, a);
      }
      else {
        addTreeNodeToIndexViewRecursive(childNode, listItem);
      }

      unorderedList.appendChild(listItem);
    });
    parentElement.appendChild(unorderedList);
    //unorderedList.style.zIndex = parentElement.style.zIndex + 1;
  }
}

function getHeaderElementDepth(element) {
  return element && element.localName && element.localName.startsWith('h') && element.localName <= 'h6' ? element.localName : '';
}

function generateIndexTree(rootTreeNode, content) {
  let element = content.firstChild;
  let previousDepth = '';
  let parentNode = rootTreeNode;

  while (element) {
    let currentDepth = getHeaderElementDepth(element);

    if (currentDepth !== '') {
      // backtrack until we find a lower numbered header          
      while (currentDepth <= getHeaderElementDepth(parentNode.element)) {
        parentNode = parentNode.parent;
      }

      let childNode = new TreeNode(element);
      parentNode.addChild(childNode);
      parentNode = childNode;
      previousDepth = currentDepth;
    }
    element = element.nextElementSibling;
  }
}

//Only finds top level page nodes
function getIndexedContentPage(name) { return rootNode.children.find(node => node.name === name); }


function findIndexedContentNodeRecursive(parentNode, name) {
  if (!parentNode) { return null; }
  let resultNode = null;
  let queue = new Array();
  for (let childNode of parentNode.children) {
    if (filterSectionSpecialCharacters(childNode.name) === name) {
      return childNode;
    }
    else if (childNode.children.length > 0) {
      queue.push(childNode);
    }
  }

  for (let childNode of queue) {
    const childResultNode = findIndexedContentNodeRecursive(childNode, name);
    if (childResultNode) {
      return childResultNode;
    }
  }

  return null;
}

//Searches all indexed pages
async function getIndexedContentNode(link) {
  let resultNode = null;
  //get link node
  const linkFileName = link.match(/([^(#]+)#([^)\s]+)/);
  if (linkFileName) {
    await fetchMd(`${linkFileName[1]}`).then(node => {
      if (!node) { return null; }
      let split = linkFileName[2].split('#');

      if (split.length === 1) {
        if (linkFileName[1] === 'dm/monsters.md') {
          split = [`monsters-${split[0][0]}`, ...split];
        }
        else if (linkFileName[1] === 'dm/spells.md') {
          split = [`spells-${split[0][0]}`, ...split];
        }
        else if (linkFileName[1] === 'dm/items.md') {
          split = [`items-${split[0][0]}`, ...split];
        }
      }

      let narrowSearchNode = node;
      for (let id of split) {
        narrowSearchNode = findIndexedContentNodeRecursive(narrowSearchNode, id);
      }

      if (narrowSearchNode !== node) {
        console.log(`Looking for '${split.join(', ')}' in '${node.name}'.\nFound '${narrowSearchNode ? narrowSearchNode.name : 'null'}'.`);
        resultNode = narrowSearchNode;
      }
      else {
        console.log(`Looking for '${split.join(', ')}' in '${node.name}'.\nERROR: node doesn't exist.`);
      }
    });
  }

  return resultNode;
}

function indexContent(parentNode, name, content) {
  let node = getIndexedContentPage(name);
  if (!node) {
    node = new TreeNode(null);
    node.parent = parentNode;
    node.name = name;
    node.element = content;
    parentNode.addChild(node);
    generateIndexTree(node, content);
  }
  return node;
}

async function fetchMd(mdUrl) {
  //TODO this is a temporary fix for this function here being bad. the links pointing to the repo root is good overall outside here
  mdUrl = mdUrl.replace(/vault\/database\//gi, '')
  mdUrl = mdUrl.replace(/vault\/dm\//gi, 'dm/')

  const nodeName = mdUrl.replace(/^.*(\/dm.*\/[-_a-zA-Z0-9]+\.md)$/i, '$1');
  let contentNode = getIndexedContentPage(nodeName);

  let absoluteUrl = '';
  if (mdUrl.startsWith('https://')) { absoluteUrl = mdUrl; }
  else if (mdUrl.match(/dm\//)) { absoluteUrl = `https://raw.githubusercontent.com/Ninetalesgh/dndcampaign/dm/vault/${mdUrl}` }
  else { absoluteUrl = `https://ninetalesgh.github.io/dndcampaign/vault/database/${mdUrl}` };

  
  if (!contentNode) {
    console.log('Fetching and caching: ' + mdUrl);
    await fetchMdAsHtml(absoluteUrl)
      .then(data => {
        if (data) {
          let div = document.createElement('div');
          div.innerHTML = data;
          contentNode = indexContent(rootNode, nodeName, div);
        }
      });
  }
  return contentNode;
}

function applyNodeToView(node) {
  if (node) {
    const contentHolder = document.querySelector('.dndcontent');
    contentHolder.innerHTML = node.element.outerHTML;

    let index = document.querySelector('.dndindex');
    index.innerHTML = '';
    addTreeNodeToIndexViewRecursive(node, index);
    gActiveContentPageNode = node; // in cookies.js
    applyStyleToTaggedInlineLinks(node.name); // in cookies.js
  }
  else {
    console.error("Attempted to show null node in dndcontent page.");
  }
}

function applyCustomDivToView(div) {
  let dummyNode = new TreeNode(null);
  dummyNode.element = div;
  generateIndexTree(dummyNode, div);
  applyNodeToView(dummyNode);
}

let gContentPageController = null;
function setContentPage(mdUrl) {
  fetchMd(mdUrl).then((node) => {
    if (node) {
      if (gContentPageController) {
        gContentPageController.abort();
      }
      gContentPageController = new AbortController();

      applyNodeToView(node);

      addIconsToInlineLinks(gContentPageController.signal).then(() => { gContentPageController = null; });
    }
  });
}

function toggleInlineLinkContent(inlineLink) {
  if (gMouseHeldAboveThreshold) // from cookies.js, ignore click if the click was held longer
  { return; }
  let ulElement = inlineLink.parentElement;
  while (ulElement && ulElement.tagName !== "P") {
    ulElement = ulElement.parentElement;
  }
  ulElement = ulElement.nextElementSibling;
  if (ulElement.dataset.link && ulElement.dataset.link === inlineLink.dataset.url) {
    ulElement.classList.toggle('collapsed');
  }
  else {
    getIndexedContentNode(inlineLink.dataset.url).then((node) => {
      if (node) {
        ulElement.setAttribute('data-link', inlineLink.dataset.url);
        let li = document.createElement('li');
        li.innerHTML = node.element.nextElementSibling.outerHTML;
        ulElement.innerHTML = li.outerHTML;
        ulElement.classList.toggle('collapsed', false);
      }
    });
  }
}

function addIconToInlineLink(link, contentNode) {
  const children = contentNode.element.nextElementSibling.children;
  let existingImg = null;

  for (let i = children.length - 1; i >= 0; --i) {
    const child = children[i];

    if (child.children.length > 0 && child.children[0] instanceof HTMLImageElement) {
      existingImg = child.children[0];
      break;
    }
  }

  if (existingImg) {
    let img = document.createElement('img');
    img.src = existingImg.src;
    img.classList.add(...existingImg.classList);
    img.style.height = '40px';
    link.style.display = 'flex';
    link.style.gap = '5px';
    link.style.paddingLeft = '0px';
    link.style.alignItems = 'center';
    link.prepend(img);
  }
}

function addIconsToInlineLinks(signal) {
  //Go through inline links of current page, if it's the only child of its parent <p>, add the image to the button?
  return new Promise(async (resolve, reject) => {
    try {
      const interval = setInterval(() => {
        if (signal.aborted) {
          console.log('Aborting current inline icon rendering and starting again for the new page.');
          clearInterval(interval);
          reject();
        }
      });

      const inlineLinks = document.querySelectorAll('.inline-link');
      for (let link of inlineLinks) {
        if (link.parentElement && link.parentElement.innerHTML.trim() === link.outerHTML.trim()) {
          const node = await getIndexedContentNode(link.dataset.url);
          if (node) {
            addIconToInlineLink(link, node);
          }
        }
      }

      resolve();
    } catch (error) {
      console.log(error);
      reject();
    }
  });
}

async function addTemporaryEquipmentToCharacterPage(query) {
  console.log(`Attempting to add '${query}' as temporary equipment.`);
  const link = `(dm/items.md#${filterSectionSpecialCharacters(query)})`;
  const node = await getIndexedContentNode(link);
  if (node) {
    const name = node.name;
    const equipmentNode = document.getElementById('equipment');
    if (equipmentNode) {
      const div = equipmentNode.nextElementSibling;

      const newInlineLink = document.createElement('button');
      newInlineLink.classList.add('inline-link');
      newInlineLink.onclick = function () { toggleInlineLinkContent(this); };
      newInlineLink.setAttribute('data-url', link);
      newInlineLink.innerHTML = node.name;

      const newP = document.createElement('p');
      newP.style.marginLeft = 0;
      newP.appendChild(newInlineLink);

      const newPlaceholder = document.createElement('ul');
      newPlaceholder.classList.add('collapsed');
      newPlaceholder.classList.add('inline-link-placeholder');
      addIconToInlineLink(newInlineLink, node);

      div.appendChild(newP);
      div.appendChild(newPlaceholder);
      return true;
    }
  }
  return false;
}

async function onPageInputFieldConfirmed() {
  const tempInput = document.querySelector('.temp-input');
  const query = tempInput.value;

  sendMessageToServer(`${query}`);
  if (await addTemporaryEquipmentToCharacterPage(`${query}`)) {
    tempInput.value = '';
  }
}

function connectToLocalServer(clientName, ip) {
  console.log(`Attempting to WebSocket connect to '${ip}' with name '${clientName}'.`);
  connectWebsocket(clientName, ip,
    () => {
      webSocket.send(`'${clientName}' handshake!`);
      console.log(`WebSocket connection established with '${ip}'`);
    },
    (event) => {
      if (event.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = function () {
          const message = reader.result;
          console.log(`Received WebSocket message '${message}'`);
          addTemporaryEquipmentToCharacterPage(message);
        };
        reader.onerror = function () {
          console.error('Error reading the Blob as text');
          console.log(event);
        };
        reader.readAsText(event.data);
      }
      else {
        const message = event.data;
        console.log(`Received WebSocket message '${message}'`);
        addTemporaryEquipmentToCharacterPage(message);
      }
    });
}


// EXECUTION
window.addEventListener('paste', (event) => {
  try {
    const clipboardData = event.clipboardData.getData('text');
    if (clipboardData) {
      let result = null;
      if (clipboardData.startsWith('{')) {
        result = convert5EJsonToHtml(JSON.parse(clipboardData));
      }
      else if (clipboardData.trimStart().startsWith('#')) {
        result = parseMd(sortMdContentPageHeaders(clipboardData));
      }
      else {
        result = convertCsvToHtml(clipboardData);
      }
      if (result) {
        let div = document.createElement('div');
        div.innerHTML = result;
        applyCustomDivToView(div);
      }
      else {
        console.log(`No parsing for: ${clipboardData}`);
      }
    }
  }
  catch (error) {
    console.log(error);
    return;
  }

  event.preventDefault();
}); 
