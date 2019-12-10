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

| Prop | Type | Default | Required? | Description |
| ---- | ---- | ------- | --------- | ----------- |
|      |      |         |           |             |

### `<PopoverBox>`

This component wraps any React element and turns it into a popover box.

#### Props

| Prop | Type | Default | Required? | Description |
| ---- | ---- | ------- | --------- | ----------- |
|      |      |         |           |             |

### `<PopoverMe>`

This component wraps any React element and turns it into a popover trigger.

#### Props

| Prop | Type | Default | Required? | Description |
| ---- | ---- | ------- | --------- | ----------- |
|      |      |         |           |             |

### `usePopover()`

This hook gives you access to the popover's context object

## LICENSE

MIT
