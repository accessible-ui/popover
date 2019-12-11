<hr>
<div align="center">
  <h1 align="center">
    &lt;Popover&gt;
  </h1>
</div>

<p align="center">
  <a href="https://bundlephobia.com/result?p=@accessible/popover">
    <img alt="Bundlephobia" src="https://img.shields.io/bundlephobia/minzip/@accessible/popover?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="Types" href="https://www.npmjs.com/package/@accessible/popover">
    <img alt="Types" src="https://img.shields.io/npm/types/@accessible/popover?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="Code coverage report" href="https://codecov.io/gh/accessible-ui/popover">
    <img alt="Code coverage" src="https://img.shields.io/codecov/c/gh/accessible-ui/popover?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="Build status" href="https://travis-ci.org/accessible-ui/popover">
    <img alt="Build status" src="https://img.shields.io/travis/accessible-ui/popover?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="NPM version" href="https://www.npmjs.com/package/@accessible/popover">
    <img alt="NPM Version" src="https://img.shields.io/npm/v/@accessible/popover?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="License" href="https://jaredlunde.mit-license.org/">
    <img alt="MIT License" src="https://img.shields.io/npm/l/@accessible/popover?style=for-the-badge&labelColor=24292e">
  </a>
</p>

<pre align="center">npm i @accessible/popover</pre>
<hr>

An accessible, "batteries included", popover component for React.

## Features

- **Several placement options** You can render the popover anywhere! Top, top-left, bottom, center, inside, outside,
  literally anywhere!
- **Containment policies** The popover is configured to contain itself inside the window using
  a containment policy. It's also optional, so you can turn it off.
- **Auto-repositioning** Use the props `repositionOnScroll` or `repositionOnResize` to reposition
  the popover automatically when the scroll position or size of the window changes.
- **Style-agnostic** You can use this component with the styling library of your choice. It
  works with CSS-in-JS, SASS, plain CSS, plain `style` objects, anything!
- **Portal-friendly** The popover will render into React portals of your choice when configured
  to do so.
- **a11y/aria-compliant** This component works with screen readers out of the box and manages
  focus for you.

## Quick Start

[Check out the example on CodeSandbox](https://codesandbox.io/s/accessiblepopover-example-6l3u0)

```jsx harmony
import {Popover, PopoverBox, PopoverMe} from '@accessible/popover'

const Component = () => (
  <Popover repositionOnScroll repositionOnResize>
    <PopoverBox placement="bottomLeft">
      <div className="my-popover">Hello world</div>
    </PopoverBox>

    <PopoverMe on="hover">
      <a href="/profile/me">
        <img src="avatar.jpg" />
      </a>
    </PopoverMe>
  </Popover>
)
```

## API

### `<Popover>`

This component creates the context for your popover box and trigger and contains some
configuration options.

#### Props

| Prop               | Type            | Default     | Required? | Description                                                                                                                                                                                                                                                               |
| ------------------ | --------------- | ----------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| defaultOpen        | `boolean`       | `true`      | No        | This sets the default open state of the popover. By default the popover is closed.                                                                                                                                                                                        |
| open               | `boolean`       | `undefined` | No        | You can control the open/closed state of the popover with this prop. When it isn't undefined, this value will take precedence over any calls to `open()`, `close()`, or `toggle()`.                                                                                       |
| repositionOnResize | `boolean`       | `false`     | No        | Setting this to `true` will update the position of the popover when the window's dimensions change and the popover is currently open.                                                                                                                                     |
| repositionOnScroll | `boolean`       | `false`     | No        | Setting this to `true` will update the position of the popover when the window's scroll position changes and the popover is currently open.                                                                                                                               |
| id                 | `string`        | `undefined` | No        | By default this component creates a unique id for you, as it is required for certain aria attributes. Supplying an id here overrides the auto id feature.                                                                                                                 |
| containPolicy      | `ContainPolicy` | `flip`      | No        | This tells the popover what to do when it overflows outside the dimensions of the window. By default it will flip its position on both the `x` and `y` axis to attempt to remain within the bounds of the window. See [`ContainPolicy`](#containpolicy) for more options. |

#### `ContainPolicy`

| Policy     | Description                                                                                                                                                                                                                                                                                                                                                                        |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `flip`     | This will attempt to flip its position on both the `x` and `y` axis to attempt to remain within the bounds of the window.                                                                                                                                                                                                                                                          |
| `flipX`    | This will attempt to flip its position on only the `x` axis to attempt to remain within the bounds of the window.                                                                                                                                                                                                                                                                  |
| `flipY`    | This will attempt to flip its position on only the `y` axis to attempt to remain within the bounds of the window.                                                                                                                                                                                                                                                                  |
| `function` | You can decide what to do with the popover on your own by providing a callback with the signature <code>(placement: string, triggerRect: ClientRect, popoverRect: ClientRect) => Placement &#124; PlacementResult</code> where `Placement` is a string returning an alternative placement and `PlacementResult` is an object shaped `{placement: Placement, style: CSSProperties}` |

### `<PopoverBox>`

This component wraps any React element and turns it into a popover box.

#### Props

| Prop | Type | Default | Required? | Description |
| ---- | ---- | ------- | --------- | ----------- |
|      |      |         |           |             |

### `<PopoverMe>`

This component wraps any React element and turns it into a popover trigger.

#### Props

| Prop     | Type                                                | Default     | Required? | Description                                                                                                                                                                                                                                                     |
| -------- | --------------------------------------------------- | ----------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| on       | <code>"hover" &#124; "click" &#124; "focus" </code> | `undefined` | Yes       | `"hover"` causes the popover to open on `mouseenter` and close on `mouseleave`. `"click"` causes the popover to toggle its visibility each `click` event. `"focus"` causes the popover to open when the child element is focused while nothing happens on blur. |
| children | `React.ReactElement`                                | `undefined` | Yes       | The child is cloned by this component and has aria attributes injected into its props as well as the events defined above.                                                                                                                                      |

#### Example
```jsx harmony
<PopoverMe on='click'>
  <button className='my-button'>Popover me!</button>
</PopoverMe>

// <button 
//   class="my-button" 
//   aria-controls="popover--12" 
//   aria-haspopup="dialog" 
//   aria-expanded="false"
// >
//   Popover me!
// </button>
```

### `usePopover()`

This hook provides access to the popover's context object

### `usePlacement()`

This hook provides access to the popover's rendered placement

### `useControls()`

This hook provides access to the popover's `open`, `close`, and `toggle` functions

### `useIsOpen()`

This hook provides access to the popover's `isOpen` value

## LICENSE

MIT
