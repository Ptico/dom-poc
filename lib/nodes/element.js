class ElementNode {
  constructor(tag, attributes, childs) {
    this.tag = tag;
    this.attrs = attributes;
    this.childs = childs;
  }

  visit(parentNode, data, refs) {
    let element = document.createElement(this.tag);

    for (let attr in this.attrs) {
      if (this.attrs.hasOwnProperty(attr)) {
        let value = this.attrs[attr];

        if ('class' === attr) {
          for (let i = 0; i < value.length; i++) {
            let val = value[i];
            if (val.isRef) {
              let ref = val(element, 'class', i);

              val = ref.assign(data);

              refs.push(ref);
            } else if (isFunction(val)) {
              val = val(data);
            }

            element.classList.add(val)
          }
        } else if ('style' === attr) {
          element.style.cssText = attr; // TODO: refs
        } else if ('on' === attr) {
          // TODO: handle events
        } else {
          if (value.isRef) {
            let ref = value(element, 'attr', attr);

            value = ref.assign(data);

            refs.push(ref);
          } else if (typeof value === 'function') {
            value = value(data);
          }

          element.setAttribute(attr, value);
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
