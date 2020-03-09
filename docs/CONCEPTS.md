# Concepts

The main idea is to use as much knowledge of the template as we can, to avoid unnecessary computations and operations.

There is 3 types of optimizations:

1. User optimizations - giving a users (programmers) possibility to optimize their templates knowing the non-parsable context. (See **"One-time rendering value"** for example)
2. Compile optimizations - giving a compiler possibility to produce optimized code based on parsable context (See **"Reference object"** for example)
3. Runtime optimizations - choosing the different update strategies based on received data, as well as caching and other runtime techniques

## Implemented

### One-time rendering value

Lets say we have a template, which can be reused

```html
<section>
  <h2>{{title}}</h2>
  <p>{{body}}</p>
</section>
```

where `title` will not be chanded during component life, but depends on the parent component. However `body` will change (f.e. Markdown preview).

Given this knowledge, user (implementor) may optimize the rendering the next way:

```html
<section>
  <h2>{title}</h2>
  <p>{{body}}</p>
</section>
```

telling the compiler to not store references (see below) and don't listen for the changes.

### Reference object

One of the core concepts of this engines is the `Reference` object. Lets say we have next:

```html
<div id="example">
  <h2>Form</h2>
  <form action="{{url}}" method="get">
    <p>
      <label>
        Enter the value
        <input type="text" name="value">
      </label>
    </p>
    <p>
      <input type="submit" value="Continue &rarr;">
    </p>
  </form>
</div>
```

This template have 8 elements, but only one will change (depends on entered value for example). Let's take a look at this element:

```html
<form action="{{url}}" method="get">
```

We (as well as compiler) can see that we use a variable `url`, which applies to the *attribute* `action` of the element `form`. So, the most naive and effective implementation for update, given all this knowledge, can be something like:

```javascript
let element = document.createElement('form');
element.setAttribute('method', 'get');
element.setAttribute('action', data.url);

data.onChange('url', function(data) {
  element.setAttribute('action', data.url);
});
```

Actual implementation will be more complex, because in case if we will add another variable

```html
<form action="{{host}}/{{path}}" method="get">
```

we don't want to update the element twice when both `host` and `path` changed simultaniousely. So the final strategy is to create a `Reference` object which defines data keys which it depends on and update the element only once:

```javascript
el('form', {
  action: ref(
    ['host', 'path'],
    (data) => { `${data.host}/${data.path}`}
  )
})
```

Note, that we don't store the references for other elements because they will never change.

### Reference computed value caching (should be benchmarked and improved)

We store the last computed value in the Reference object to compare with new computed value and not update the node when values are the same. However, it might have a significant memory impact, especially for InnerTextReferences, so consider to measure the length of the resulting string before enforcing this optimization.

## Planned

This optimizations should be checked for their effectiveness in a real-word use-cases

### Rendered DOM caching

This could be useful for `if/else` statements. Instead of destroying rendered DOM and it's references when condition is changed, we just detach its nodes to append them later if needed.

### Static nodes caching

In some cases, nodes which doesn't have any references, can be cached to use them with `document.cloneNode()`. This is especially useful for partials/components which is used more than once in one page. Can be user or compile or runtime optimization

### Collection DOM cloning and Reference path

Instead of iterating over collection and building the DOM nodes one-by-one, we could build the template once and then use `document.cloneNode()` for each collection member. In this case, instead of saving the reference to each element, we can build the path to this elements, pseudocode:

```javascript
for (var i = 0; i < collection.length; i++) {
  let template = document.cloneNode(preBuiltNode);

  template.querySelector(refPath).setAttribute('action', collection[i].url);
}

// Then, when the member changed:

this.root.querySelector(`${refPath}:nth-child(${index})`).setAttribute('action', collection[index].url);
```

However, it might be more effective to use regular builder for collections with less than n (1-4) elements.

### Reconcile/reuse strategies chooser

Different reconciliation algorithms could be applied depends on size and type of the collection. Keyed, non-keyed, memory hungry but faster for small collections, slower but memory efficient for large collections.


