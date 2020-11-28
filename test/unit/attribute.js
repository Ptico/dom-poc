import { JSDOM } from 'jsdom';
import 'mocha';
import { expect, use } from 'chai';
import chaiDom from 'chai-dom'

use(chaiDom);

import template from '../../lib/template';
import el from '../../lib/nodes/element';
import ref from '../../lib/ref';

let dom = new JSDOM(`<div id="example"></div>`);

global.window = dom.window;
global.document = dom.window.document;

describe('Attributes', function() {
  beforeEach(function() {
    dom = new JSDOM(`<div id="example"></div>`);

    global.window = dom.window;
    global.document = dom.window.document;
  });

  context('Simple value', function() {
    it('renders values', function() {
      let attrTest = template([
        el('a', { id: 'testing', href: 'https://example1.com/' })
      ]);

      let widget = attrTest({}, document.getElementById('example'));
      let node = document.getElementById('testing');

      expect(node).to.have.attribute('href', 'https://example1.com/');
    });
  });

  context('One-time render function', function() {
    it('renders values', function() {
      let attrTest = template([
        el('a', { id: 'testing', href: (data) => { return data.url } })
      ]);

      let data = { url: 'https://example2.com/' };

      let widget = attrTest(data, document.getElementById('example'));
      let node = document.getElementById('testing');

      expect(node).to.have.attribute('href', 'https://example2.com/');
    });

    it('does not update node', function() {
      let attrTest = template([
        el('a', { id: 'testing', href: (data) => { return data.url } })
      ]);

      let data = { url: 'https://example2.com/' };

      let widget = attrTest(data, document.getElementById('example'));
      let node = document.getElementById('testing');

      widget.set('url', 'https://test.com/');

      expect(node).to.have.attribute('href', 'https://example2.com/');
    });
  });

  context('Reference', function() {
    it('renders string values', function() {
      let attrTest = template([
        el('a', { id: 'testing', href: ref(['url'], (data) => { return data.url } )})
      ]);

      let data = { url: 'https://example3.com/' };

      let widget = attrTest(data, document.getElementById('example'));
      let node = document.getElementById('testing');

      expect(node).to.have.attribute('href', 'https://example3.com/');
    });

    it('does update node', function() {
      let attrTest = template([
        el('a', { id: 'testing', href: ref(['url'], (data) => { return data.url } )})
      ]);

      let data = { url: 'https://example3.com/' };

      let widget = attrTest(data, document.getElementById('example'));
      let node = document.getElementById('testing');

      widget.set('url', 'https://test.com/');

      expect(node).to.have.attribute('href', 'https://test.com/');
    });
  });
});
