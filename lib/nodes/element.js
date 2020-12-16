class ElementNode {
  constructor(tag, attributes, childs) {
    this.tag = tag;
    this.attrs = attributes;
    this.childs = childs;
  }

  visit(parentNode, data, refs) {
    let element = document.createElement(this.tag);

    for (let attrName in this.attrs) {
      if (this.attrs.hasOwnProperty(attrName)) {
        let attrValue = this.attrs[attrName];

        if ('class' === attrName) {
          // class is always an array, so we iterate
          // over it's values
          for (let i = 0; i < attrValue.length; i++) {
            let val = attrValue[i];

            if (val.isRef) {
              let ref = val(element, 'class', i);

              val = ref.assign(data);

              refs.push(ref);
            } else if (typeof attrValue === 'function') {
              val = val(data);
            }

            element.classList.add(val)
          }
        } else if ('style' === attrName) {
          element.style.cssText = attrValue; // TODO: refs
        } else if ('on' === attrName) {
          // TODO: handle events
        } else {
          if (attrValue.isRef) {
            let ref = attrValue(element, 'attr', attrName);

            attrValue = ref.assign(data);

            refs.push(ref);
          } else if (typeof attrValue === 'function') {
            attrValue = attrValue(data);
          }

          element.setAttribute(attrName, attrValue);
        }
      }
    }

    if (this.childs) {
      for (var i = 0; i < this.childs.length; i++) {
        let child = this.childs[i];
        child.visit(element, data, refs);
      }
    }

    parentNode.appendChild(element);

    return element;
  }
}

function el(tag, attributes, childs) {
  return new ElementNode(tag, attributes, childs);
};

export default el;
