class TextNode {
  constructor(content) {
    this.content = content;
  }

  visit(parentNode, data, refs) {
    let content = this.content,
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
}

function text(content) {
  return new TextNode(content);
}

export default text;
