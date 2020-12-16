class Reference {
  constructor(vars, renderFn, element, meta) {
    this.vars = vars;
    this.fn = renderFn;
    this.element = element;
    this.currentValue = void 0;
    this.meta = meta;
  }

  assign(data) {
    this.currentValue = this.fn(data);
    return this.currentValue;
  }

  update(data) {
    let newValue = this.fn(data);

    let oldValue = this.currentValue;

    if (oldValue !== newValue) {
      this.currentValue = newValue;
      this.updateElement(newValue, oldValue);
    }
  }
}

class InnerTextReference extends Reference {
  updateElement(value) {
    let newNode = document.createTextNode(value);
    this.element.replaceWith(newNode);
    this.element = newNode;
  }
}

class AttributeReference extends Reference {
  updateElement(value) {
    this.element.setAttribute(this.meta, value);
  }
}

class ClassNameReference extends Reference {
  updateElement(value, oldValue) {
    this.element.replace(oldValue, value);
  }
}

class StyleTextReference extends Reference {

}

const REFS = {
  'text': InnerTextReference,
  'attr': AttributeReference,
  'class': ClassNameReference,
  'style': StyleTextReference
};

export default function ref(vars, renderFn) {
  let prebuilder = function(element, operation, meta) {
    return new REFS[operation](vars, renderFn, element, meta);
  };

  prebuilder.isRef = true;

  return prebuilder;
}
