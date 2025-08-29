# Transition-Group Webcomponent

> Standards-based, framework-agnostic utility for animating DOM elements as they enter a page, change position, or are removed from a page, using CSS transitions. 

For a version of this README with live demos of the examples, visit: https://zaceno.github.io/projects/transition-group

## How to get it

Just drop this tag in the `<head>...</head>` of your html page:

```html
<script type="module" src="https://unpkg.com/webcomponent-transition-group"></script>
```

Now you can use `<transition-group>...</transition-group>` as a regular html-tag, anywhere in your html. 

Alternatively, if you're using a bundler, you can install this package as a dependency:

```sh
> npm install webcomponent-transition-group
```

And then import it in any module where you want to be sure `<transition-group>...</transition-group>` is usable.

```js
import 'webcomponent-transition-group'
```

## Sliding transitions

When you have a list of elements on a page, they will skip to new positions when you insert or remove elements. Often, you'll want the elements to slide to their new positions in a smooth, animated motion, so that users more easily understand what happened.

You can achieve by wrapping the list of elements in a `<transition-group>` tag, with a `slide="..."` attribute.

```jsx
//puzzle-grid.jsx
import 'webcomponent-transition-group'

export function PuzzleGrid ({order, images}) {
  return (
    <transition-group class="puzzle-grid" slide="slide-transition">
      {order.map(id => 
        !id
          ? <div key={id} class="blank"></div>
          : <img key={id} src={images[id]} onclick={[Move, id]} />
      )}
    </transition-group>
  )
}
```

It's up to you what value you choose for the slide-attribute (in this example "slide-transition"). Whatever you chose, the value will be added to the class-list of each moving element, *just before* a `transform` rule is applied to them to move them into their new positions. This way, you can define the motion using a `transition:` rule for the slide class

```css
.slide-transition {
  /* makes motion linear with 200ms duration: */
  transition: 0.2 linear;
}

.puzzle-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr;
}
```

## Exit Transitions

Normally when elements are removed from the DOM, they just blink out of existence. If you'd like them to go out with some flair, add an `exit="..."` attribute to a `<transition-group>` tag around them.

```jsx
import 'webcomponent-transition-group'

export function ColoredBoxes ({colors}) {
  return (
    <transition-group
      class="boxrow"
      slide="slide-transition"
      exit="poof"
    >
      {colors.map(color => (
        <div
          class="box"
          style={{backgroundColor: color}}
          onclick={[Remove, color]}
        /> 
      ))}
    </transition-group>
  )
}
```

Within a `<transition-group>` with an `exit=` attribute specified, elements that are removed from the DOM will be intercepted just before, and have the value of the exit attribute added to their class list. It is expected that your CSS will define some transition for this class, because it is only once a transition ends that the element will be properly removed. 


```css
.poof {
  /* Makes elements disappear by growing and fading */
  opacity: 0;
  transform: scale(3, 3);
  transition: 0.4s ease-out;
}
```
 
## Entry Transitions

Just as with elements that are removed, you might want _new_ elements to _enter_ the DOM with some flair. For that you can add an `entry="..."` attribute to your `<transition-group>` tag. 

```jsx
import 'webcomponent-transition-group'

export function MessageBoxes ({messages}) {
  return (
    <ul class="messages">
      <transition-group
        entry="enter-up" // <-------
        exit="poof"
        slide="slide-transition"
      >
      {messages.map(msg => (
        <li>{msg}</li>
      ))}
      </transition-group>
    </ul>
  )
}
```

When a new element is created as a direct child of the transition-group, it will get two classes added to its class-list immediately on creation: one named as the value you provided ("enter-up", in this example), and the other is the same value *suffixed with "-pre"* (in this example "enter-up-pre"). 

In your css for the -pre class, you can define transforms and other rules for how the element should appear before it starts entering, relative to how it will end up finally:


```css

.enter-up-pre {
  transform: translateY(100%);
  opacity: 0;
}
```

Immediately after painting the DOM with the element in its pre-entry-state, the "-pre" class is removed leaving only the plain entry class. By defining a transition in the plain entry class, the element will begin to transition from it's pre-state to it's final state.

```css
.enter-up {
  transition: 0.3s ease-in;
}
```

Once the transition is complete, the entry class is also removed.


## Dynamic Transitions

You can change the `entry=`, `exit=` and `slide=` attributes dynamically, and the `<transition-group>` webcomponent will adapt its behavior. An example where this is useful might be a slide-show, where you want different transitions depending on if the user is navigating forward or backward in the deck.

```jsx
export function SlideshowScreen({ slideID, slideContent, direction }) {
  return (
    <div class="slideshow__screen">
      <transition-group
        entry={"slideshow--entry-" + direction}
        exit={"slideshow--exit-" + direction}
      >
        <Slide key={slideID}>{slideContent}</Slide>
      </transition-group>
    </div>
  )
}
```

In this example, when the slide element is replaced, the old element will dissapear with an exit transitioin, and a new element will appear with an entry transition. But *which* transition applies, depends on the `direction` variable.

The following CSS would make the previous slide fly off to the left, and the new slide fly in from the right, when the navigation `direction` is `"right"`. And vice versa when the navigation `direction` is `"left"`. 

```css
.slideshow--entry-left-pre,
.slideshow--exit-right {
  transform: translateX(-100%);
  opacity: 0;
}
.slideshow--exit-left,
.slideshow--entry-right-pre {
  transform: translateX(100%);
  opacity: 0;
}
.slideshow--entry-left,
.slideshow--exit-left,
.slideshow--entry-right,
.slideshow--exit-right {
  transition: 0.4s;
}
```

## Please Note: ##

- When using frameworks that do dom-diffing, make sure to use keys for elements in transition-groups. This will ensure that the right DOM-elements are added/removed/moved

- When you use `entry=` or `exit=` attributes, the transition-group element expects the classes it applies to cause transitions (so it can react to transitions ending). If that doesn't happen, there will be odd behavior.

