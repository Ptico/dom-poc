class Reference {
  constructor(vars, renderFn, element) {
    this.vars = vars;
    this.fn = renderFn;
    this.element = element;
    this.currentValue = void 0;
  }

  assign(data) {
    this.currentValue = this.fn(data);
    return this.currentValue;
  }

  update(data) {
    let newValue = this.fn(data);

    let oldValue = this.value;

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
    this.element.setAttribute(attr, value);
  }
}

class ClassNameReference extends Reference {
  constructor(vars, renderFn, element, index) {
    super(vars, renderFn, element);
    this.index = index;
  }

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
  let prebuilder = function(element, operation, index) {
    return new REFS[operation](vars, renderFn, element, index);
  };

  prebuilder.isRef = true;

  return prebuilder;
}
