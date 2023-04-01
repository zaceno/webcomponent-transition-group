# A Transition-Group Web Component

Using css transitions to manage elegant and smooth appearances and dissapearances
of elements on ones pages can be difficult. In particular when using virtual-dom based
frameworks, as they expect full control of the DOM, so one needs to keep track of the
transition state alongside the business logic of one's application.

But this custom element alleviates that.

## Install

Either install locally

```
>npm install webcomponent-transition-group
```

and import in your app:

```js
import "webcomponent-transition-group"
```

or import directly in script files that need it:

```js
import "https://unpkg.com/webcomponent-transition-group"
```

or add it to the head of your html file:

```html
<html>
  <head>
    <script
      type="module"
      src="https://unpkg.com/webcomponent-transition-group"
    ></script>
    ...</head
  ></html
>
```

## Usage

However you imported it, once imported, the `<transition-group>` html element is available to use.

By default it does nothing

```html
<transition-group>
  <div class="popup">
    <p>Hello!</p>
  </div>
  <transition-group></transition-group
></transition-group>
```

## Entry

... but if you set the `entry` attribute to a class-name:

```html
<transition-group entry="popup-entry">
  <div class="popup">
    <p>Hello!</p>
  </div>
  <transition-group></transition-group
></transition-group>
```

Then every child of the transition-group, when it is first added, will first be given the class "popup-entry-pre" (the given class-name, with "-pre" as a suffix). For this class you will define how the element is hidden:

```css
.popup-entry-pre {
  opacity: 0;
  transform: translateY(-100%);
}
```

The transition-group will on the next frame cause the "popup-entry-pre" class to be replaced with just "popup-entry", where you define how the transition should behave:

```css
.popup-entry {
  transition: 0.3s ease-in;
}
```

One the transition completes, the "popup-entry" class will be removed from the child element.

## Exit

If you set the `exit` attribute to a class name (e.g "popup-exit"), then once a child is _removed_ from the transition-group element, it will remain visible (actually moved in to the shadow-dom of the transition-group) but have the "popup-exit" class name added so you can define the transition for how it exits:

```css
.popup-exit {
  transition: all 0.2s;
  opacity: 0;
  transform: scale(2, 2);
}
```

Once the transition completes, the element will be really removed.

## Layout

When there are multiple children, their order typically affects how they are laid out, and if you change the order, you may want them to slide smoothly to their new position. The transition-group element allows you to achieve this by adding a class name to the `slide` attribute:

```html
<transition-group slide="gallery-slide">
  <img class="thumbnail" ... />
  <img class="thumbnail" ... />
  <img class="thumbnail" ...
/></transition-group>
```

The classname set allows you to define the timing of the sliding in css:

```css
.gallery-slide {
  transition: 0.4s linear;
}
```

## Important tips

When using a virtual-dom based framework, make sure you are really adding, removing and reordering the same elements by using keys (or your framework's equivalent) on every child of transition-group.

If you notice strange behavior, or some elements are not being removed/positioned properly, it could be because you have made a mistake in your css and you are not actually causing transitions to happen.
