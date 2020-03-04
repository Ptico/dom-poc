class TemplateInstance {
  constructor(root, refs, data) {
    this.root = root;
    this.refs = refs;
    this.currentData = data;
    this.listenAttr = {};

    for (var i = 0; i < refs.length; i++) {
      let ref = refs[i],
          vars = ref.vars;

      for (var j = 0; j < vars.length; j++) {
        let attr = vars[j];

        if (!this.listenAttr[attr]) {
          this.listenAttr[attr] = [];
        }

        this.listenAttr[vars[j]].push(i);
      }
    }
  }

  set(attr, value) {
    this.currentData[attr] = value;

    let refs = this.listenAttr[attr];

    refs.forEach((refIndex) => this.refs[refIndex].update(this.currentData));
  }

  update(data) {
    let updates = Object.keys(data),
        refIndexes = [];

    for (let i = 0; i < updates.length; i++) {
      refIndexes.push(...this.listenAttr[updates[i]]);
    }

    this.currentData = Object.assign(this.currentData, data);

    new Set(refIndexes).forEach((index) => this.refs[index].update(this.currentData));
  }
}

export default function template(tmpl) {
  return function(data, root) {
    let refs = [];

    root = root || document.createDocumentFragment();

    for (var i = 0; i < tmpl.length; i++) {
      visit(root, tmpl[i], data, refs);
    }

    return (new TemplateInstance(root, refs, data));
  }
}

function visit(parentNode, node, data, refs) {
  switch (node.type) {
  case 'element':
    return visitElement(parentNode, node, data, refs);
  case 'text':
    return visitText(parentNode, node, data, refs);
  default:
    // Raise error
  }
}

function visitElement(parentNode, node, data, refs) {
  let element = document.createElement(node.tag);

  for (let attr in node.attrs) {
    if (node.attrs.hasOwnProperty(attr)) {
      let value = node.attrs[attr];

      if ('class' === attr) {
        for (let i = 0; i < value.length; i++) {
          let val = value[i];
          if (val.isRef) {
            let ref = val(element, 'class', i);

            val = ref.assign(data);

            refs.push(ref);
          }
          element.classList.add(val)
        }
      } else if ('style' == attr) {
        element.style.cssText = attr; // TODO: refs
      } else if ('on' == attr) {
        // TODO: handle events
      } else {
        if (value.isRef) {
          refs.push({
            ref: value,
            op: 'attr',
            el: element
          });

          let ref = value(element, 'attr');

          value = ref.assign(data);

          refs.push(ref);
        }
        element.setAttribute(attr, value);
      }
    }
  }

  for (var i = 0; i < node.childs.length; i++) {
    let child = node.childs[i];
    visit(element, child, data, refs);
  }

  parentNode.appendChild(element);

  return element;
}

function visitText(parentNode, node, data, refs) {
  let content = node.content,
      element;

  if (content.isRef) {
    let ref = content(element, 'text');
    let val = ref.assign(data);
    element = document.createTextNode(val);
    ref.element = element; // Hack :(
    refs.push(ref);
  } else {
    element = document.createTextNode(content);
  }

  parentNode.append(element);

  return element;
}
