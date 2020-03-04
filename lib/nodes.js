export function el(tag, attributes, childs) {
  return {
    tag: tag,
    attrs: attributes,
    childs: childs,
    type: 'element'
  };
};

export function text(content) {
  return {
    content: content,
    type: 'text'
  };
}
