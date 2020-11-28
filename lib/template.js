class Template {
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

        this.listenAttr[attr].push(i);
      }
    }
  }

  set(attr, value) {
    this.currentData[attr] = value;

    let refs = this.listenAttr[attr];

    if (refs) {
      refs.forEach((refIndex) => this.refs[refIndex].update(this.currentData));
    }
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
      tmpl[i].visit(root, data, refs);
    }

    return (new Template(root, refs, data));
  }
}
