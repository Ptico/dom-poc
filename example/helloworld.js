// This is supposed to be result of parsing

import template from '../lib/template';
import el from '../lib/nodes/element';
import text from '../lib/nodes/text';
import ref from '../lib/ref';

window.hello = template([
  el('h2', { id: 'widget', 'class': ['foo', 'bar'] }, [
    text(
      ref(
        ['firstName', 'lastName'],
        (data) => { return `Hello ${data.firstName} ${data.lastName}!`}
      )
    )
  ]),
  el('p', {}, [
    text(
      ref(['lastName'], (data) => { return `Your last name is ${data.lastName}` })
    )
  ])
]);
