import * as React from 'react'
import {useWindowSize} from '@react-hook/window-size/throttled'
import useLayoutEffect from '@react-hook/passive-layout-effect'
import useSwitch from '@react-hook/switch'
import useMergedRef from '@react-hook/merged-ref'
import useWindowScroll from '@react-hook/window-scroll'
import useId from '@accessible/use-id'
import {useKey} from '@accessible/use-key'
import useConditionalFocus from '@accessible/use-conditional-focus'
import {Button} from '@accessible/button'
import Portalize from 'react-portalize'
import type {PortalizeProps} from 'react-portalize'
import clsx from 'clsx'

const __DEV__ =
  typeof process !== 'undefined' && process.env.NODE_ENV !== 'production'

const windowWidth = (): number =>
  window.innerWidth || document.documentElement.clientWidth

const windowHeight = (): number =>
  window.innerHeight || document.documentElement.clientHeight

interface StyleRectX {
  right: number | 'auto'
  left: number | 'auto'
}

interface StyleRectY {
  top: number | 'auto'
  bottom: number | 'auto'
}

interface StyleRect extends StyleRectX, StyleRectY {}

const auto = 'auto'

const centerXPos = (
  triggerRect: ClientRect,
  popoverRect: ClientRect
): StyleRectX => ({
  right:
    windowWidth() -
    triggerRect.right -
    (popoverRect.width - triggerRect.width) / 2,
  left: auto,
})

const centerYPos = (
  triggerRect: ClientRect,
  popoverRect: ClientRect
): StyleRectY => ({
  top: auto,
  bottom:
    windowHeight() -
    triggerRect.bottom -
    (popoverRect.height - triggerRect.height) / 2,
})

const startXInnerPos = (triggerRect: ClientRect): StyleRectX => ({
  right: auto,
  left: triggerRect.left,
})

const startXOuterPos = (triggerRect: ClientRect): StyleRectX => ({
  right: windowWidth() - triggerRect.left,
  left: auto,
})

const endXOuterPos = (triggerRect: ClientRect): StyleRectX => ({
  right: auto,
  left: triggerRect.right,
})

const endXInnerPos = (triggerRect: ClientRect): StyleRectX => ({
  right: windowWidth() - triggerRect.right,
  left: auto,
})

const startYInnerPos = (triggerRect: ClientRect): StyleRectY => ({
  top: triggerRect.top,
  bottom: auto,
})

const startYOuterPos = (triggerRect: ClientRect): StyleRectY => ({
  top: auto,
  bottom: windowHeight() - triggerRect.top,
})

const endYInnerPos = (triggerRect: ClientRect): StyleRectY => ({
  top: auto,
  bottom: windowHeight() - triggerRect.bottom,
})

const endYOuterPos = (triggerRect: ClientRect): StyleRectY => ({
  top: triggerRect.bottom,
  bottom: auto,
})

const centerXRect = (
  triggerRect: ClientRect,
  popoverRect: ClientRect
): StyleRectX => {
  const right =
    popoverRect.width / 2 - triggerRect.width / 2 + triggerRect.right
  return {
    right,
    left: right - popoverRect.width,
  }
}

const startXOuterRect = (
  triggerRect: ClientRect,
  popoverRect: ClientRect
): StyleRectX => ({
  right: triggerRect.left,
  left: triggerRect.left - popoverRect.width,
})

const endXOuterRect = (
  triggerRect: ClientRect,
  popoverRect: ClientRect
): StyleRectX => ({
  right: triggerRect.right + popoverRect.width,
  left: triggerRect.right,
})

const centerYRect = (
  triggerRect: ClientRect,
  popoverRect: ClientRect
): StyleRectY => {
  const bottom =
    popoverRect.height / 2 - triggerRect.height / 2 + triggerRect.bottom
  return {
    top: bottom - popoverRect.height,
    bottom,
  }
}

const startYOuterRect = (
  triggerRect: ClientRect,
  popoverRect: ClientRect
): StyleRectY => ({
  top: triggerRect.top - popoverRect.height,
  bottom: triggerRect.top,
})

const endYOuterRect = (
  triggerRect: ClientRect,
  popoverRect: ClientRect
): StyleRectY => ({
  top: triggerRect.bottom,
  bottom: triggerRect.bottom + popoverRect.height,
})

const startXInnerRect = (
  triggerRect: ClientRect,
  popoverRect: ClientRect
): StyleRectX => ({
  right: triggerRect.left + popoverRect.width,
  left: triggerRect.left,
})

const endXInnerRect = (
  triggerRect: ClientRect,
  popoverRect: ClientRect
): StyleRectX => ({
  right: triggerRect.right,
  left: triggerRect.right - popoverRect.width,
})

const startYInnerRect = (
  triggerRect: ClientRect,
  popoverRect: ClientRect
): StyleRectY => ({
  top: triggerRect.top,
  bottom: triggerRect.top + popoverRect.height,
})

const endYInnerRect = (
  triggerRect: ClientRect,
  popoverRect: ClientRect
): StyleRectY => ({
  top: triggerRect.bottom - popoverRect.height,
  bottom: triggerRect.bottom,
})

const assignY = (x: StyleRectX, y: StyleRectY): StyleRect => Object.assign(x, y)

const idealFn = (
  placement: string,
  xFn: typeof centerXRect,
  yFn: typeof centerYRect
) => {
  idealRects[placement.toLowerCase()] = (
    triggerRect: ClientRect,
    popoverRect: ClientRect
  ) => assignY(xFn(triggerRect, popoverRect), yFn(triggerRect, popoverRect))
}
const idealRects: Record<
  string,
  (triggerRect: ClientRect, popoverRect: ClientRect) => StyleRect
> = {}

const inner = 'inner'
const top = 'top'
const right = 'right'
const bottom = 'bottom'
const left = 'left'
const Top = 'Top'
const Right = 'Right'
const Bottom = 'Bottom'
const Left = 'Left'
idealFn(top, centerXRect, startYOuterRect)
idealFn(top + Left, startXInnerRect, startYOuterRect)
idealFn(top + Right, endXInnerRect, startYOuterRect)
idealFn(right, endXOuterRect, centerYRect)
idealFn(right + Top, endXOuterRect, startYInnerRect)
idealFn(right + Bottom, endXOuterRect, endYInnerRect)
idealFn(bottom, centerXRect, endYOuterRect)
idealFn(bottom + Left, startXInnerRect, endYOuterRect)
idealFn(bottom + Right, endXInnerRect, endYOuterRect)
idealFn(left, startXOuterRect, centerYRect)
idealFn(left + Top, startXOuterRect, startYInnerRect)
idealFn(left + Bottom, startXOuterRect, endYInnerRect)
idealFn(inner + Left, startXInnerRect, centerYRect)
idealFn(inner + Right, endXInnerRect, centerYRect)
idealFn(inner + Top, centerXRect, startYInnerRect)
idealFn(inner + Top + Left, startXInnerRect, startYInnerRect)
idealFn(inner + Top + Right, endXInnerRect, startYInnerRect)
idealFn(inner + Bottom, centerXRect, endYInnerRect)
idealFn(inner + Bottom + Left, startXInnerRect, endYInnerRect)
idealFn(inner + Bottom + Right, endXInnerRect, endYInnerRect)
idealFn('center', centerXRect, centerYRect)

const contain = (placement: string) => (
  triggerRect: ClientRect,
  popoverRect: ClientRect,
  containPolicy: ContainPolicy
): PlacementResult => {
  let nextPlacement: string | PlacementResult = placement
  const flip = containPolicy === 'flip',
    flipX = containPolicy === 'flipX',
    flipY = containPolicy === 'flipY'

  if (flip || flipX || flipY) {
    const idealRect = (idealRects[placement] || idealRects.center)(
      triggerRect,
      popoverRect
    )

    // center checks
    if (!nextPlacement) {
      if (flip || flipY) {
        if (idealRect.bottom > windowHeight()) {
          nextPlacement = 'top'
        } else if (idealRect.top < 0) {
          nextPlacement = 'bottom'
        }
      }

      if (!nextPlacement && (flip || flipX)) {
        if (idealRect.left < 0) {
          nextPlacement = 'right'
        } else if (idealRect.right > windowWidth()) {
          nextPlacement = 'left'
        }
      }
    }
    // order of these indexes matters... must be before placement === top check
    const leftIdx = nextPlacement.indexOf('left'),
      topIdx = nextPlacement.indexOf('top')

    if (nextPlacement === 'top' || nextPlacement === 'bottom') {
      if (flip || flipX) {
        // handles center X-axis case
        if (idealRect.left < 0) {
          nextPlacement += 'left'
        } else if (idealRect.right > windowWidth()) {
          nextPlacement += 'right'
        }
      }
    }

    if (flip || flipX) {
      // left checks
      if (
        (leftIdx === 0 && idealRect.left < 0) ||
        (leftIdx > 0 && idealRect.right > windowWidth())
      ) {
        nextPlacement = nextPlacement.replace('left', 'right')
      } else {
        const rightIdx = nextPlacement.indexOf('right')
        // right checks
        if (
          (rightIdx === 0 && idealRect.right > windowWidth()) ||
          (rightIdx > 0 && idealRect.left < 0)
        ) {
          nextPlacement = nextPlacement.replace('right', 'left')
        }
      }
    }

    // handles center Y-axis case
    if (flip || flipY) {
      if (nextPlacement === 'left' || nextPlacement === 'right') {
        if (idealRect.top < 0) {
          nextPlacement += 'top'
        } else if (idealRect.bottom > windowHeight()) {
          nextPlacement += 'bottom'
        }
      } else if (
        nextPlacement === 'innerleft' ||
        nextPlacement === 'innerright'
      ) {
        if (idealRect.top < 0) {
          nextPlacement = nextPlacement.replace('inner', 'innertop')
        } else if (idealRect.bottom > windowHeight()) {
          nextPlacement = nextPlacement.replace('inner', 'innerbottom')
        }
      }
    }

    if (flip || flipY) {
      // top checks
      if (
        (topIdx === 0 && idealRect.top < 0) ||
        (topIdx > 0 && idealRect.bottom > windowHeight())
      ) {
        nextPlacement = nextPlacement.replace('top', 'bottom')
      } else {
        const bottomIdx = nextPlacement.indexOf('bottom')
        // bottom checks
        if (
          (bottomIdx === 0 && idealRect.bottom > windowHeight()) ||
          (bottomIdx > 0 && idealRect.top < 0)
        ) {
          nextPlacement = nextPlacement.replace('bottom', 'top')
        }
      }
    }
  } else if (typeof containPolicy === 'function') {
    nextPlacement = containPolicy(nextPlacement, triggerRect, popoverRect)
    if (typeof nextPlacement !== 'string') return nextPlacement
  }

  return (placements[nextPlacement] || placements.center)(
    triggerRect,
    popoverRect
  )
}

export type Placement =
  | 'top'
  | 'topLeft'
  | 'topRight'
  | 'right'
  | 'rightTop'
  | 'rightBottom'
  | 'bottom'
  | 'bottomLeft'
  | 'bottomRight'
  | 'left'
  | 'leftTop'
  | 'leftBottom'
  | 'innerTop'
  | 'innerTopLeft'
  | 'innerTopRight'
  | 'innerRight'
  | 'innerBottom'
  | 'innerBottomLeft'
  | 'innerBottomRight'
  | 'innerLeft'
  | 'center'

interface PlacementResult {
  placement: Placement
  style: Partial<StyleRect>
}

const placements: Record<
  string,
  (triggerRect: ClientRect, popoverRect: ClientRect) => PlacementResult
> = {}

const placementFn = (
  placement: string,
  xFn: typeof centerXRect,
  yFn: typeof centerYRect
) => {
  placements[placement.toLowerCase()] = (
    triggerRect: ClientRect,
    popoverRect: ClientRect
  ): PlacementResult => ({
    placement: placement as Placement,
    style: assignY(
      xFn(triggerRect, popoverRect),
      yFn(triggerRect, popoverRect)
    ),
  })
}
placementFn(top, centerXPos, startYOuterPos)
placementFn(top + Left, startXInnerPos, startYOuterPos)
placementFn(top + Right, endXInnerPos, startYOuterPos)
placementFn(right, endXOuterPos, centerYPos)
placementFn(right + Top, endXOuterPos, startYInnerPos)
placementFn(right + Bottom, endXOuterPos, endYInnerPos)
placementFn(bottom, centerXPos, endYOuterPos)
placementFn(bottom + Left, startXInnerPos, endYOuterPos)
placementFn(bottom + Right, endXInnerPos, endYOuterPos)
placementFn(left, startXOuterPos, centerYPos)
placementFn(left + Top, startXOuterPos, startYInnerPos)
placementFn(left + Bottom, startXOuterPos, endYInnerPos)
placementFn(inner + Top, centerXPos, startYInnerPos)
placementFn(inner + Top + Left, startXInnerPos, startYInnerPos)
placementFn(inner + Top + Right, endXInnerPos, startYInnerPos)
placementFn(inner + Right, endXInnerPos, centerYPos)
placementFn(inner + Bottom, centerXPos, endYInnerPos)
placementFn(inner + Bottom + Right, endXInnerPos, endYInnerPos)
placementFn(inner + Bottom + Left, startXInnerPos, endYInnerPos)
placementFn(inner + Left, startXInnerPos, centerYPos)
placementFn('center', centerXPos, centerYPos)

export type ContainPolicy =
  | 'flip'
  | 'flipX'
  | 'flipY'
  | null
  | ((
      placement: string,
      triggerRect: ClientRect,
      popoverRect: ClientRect
    ) => Placement | PlacementResult)

const setPlacementStyle = (
  requestedPlacement:
    | string
    | ((
        triggerRect: ClientRect,
        popoverRect: ClientRect,
        containPolicy: ContainPolicy
      ) => string),
  trigger: HTMLElement,
  popover: HTMLElement,
  containPolicy: ContainPolicy
): PlacementState | ((prev: PlacementState) => PlacementState) => {
  if (!trigger || !popover) return (prev) => prev

  let result = {},
    placement = requestedPlacement
  const triggerRect = trigger.getBoundingClientRect(),
    popoverRect = popover.getBoundingClientRect()

  popoverRect.width = popover.offsetWidth
  popoverRect.height = popover.offsetHeight

  if (typeof requestedPlacement === 'function') {
    result = requestedPlacement(triggerRect, popoverRect, containPolicy)

    if (typeof result === 'string') {
      placement = result
    } else {
      if (__DEV__) {
        if (
          // @ts-ignore
          typeof result.placement !== 'string' ||
          // @ts-ignore
          typeof result.style !== 'object'
        ) {
          throw new Error(
            `[Popover] Placement functions must return an object of type:\n` +
              `\n{\n  placement: string,\n  style: {}\n}\n`
          )
        }
      }
    }
  }

  if (typeof placement === 'string') {
    const fn = contain(placement.toLowerCase())
    result = fn(triggerRect, popoverRect, containPolicy)
  }
  // @ts-ignore
  result.requestedPlacement = requestedPlacement
  return result as PlacementState
}

export interface PopoverContextValue {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
  id?: string
  style: React.CSSProperties
  targetRef: React.MutableRefObject<HTMLElement | null>
  triggerRef: React.MutableRefObject<HTMLElement | null>
  placement: Placement
  reposition: (nextPlacement: Placement) => void
  triggeredBy: string | null
  setTriggeredBy: (trigger: string) => void
}

export interface PopoverControls {
  open: () => void
  close: () => void
  toggle: () => void
  reposition: (nextPlacement: Placement) => void
}

// @ts-ignore
export const PopoverContext: React.Context<PopoverContextValue> = React.createContext(
    {}
  ),
  {Consumer: PopoverConsumer} = PopoverContext,
  usePopover = () => React.useContext<PopoverContextValue>(PopoverContext),
  usePlacement = () => usePopover().placement,
  useControls = (): PopoverControls => {
    const {open, close, toggle, reposition} = usePopover()
    return {open, close, toggle, reposition}
  },
  useIsOpen = () => usePopover().isOpen

const isClosedStyles: React.CSSProperties = {
  position: 'fixed',
  visibility: 'hidden',
}
const isOpenStyles: React.CSSProperties = Object.assign({}, isClosedStyles, {
  visibility: 'visible',
})

const portalize = (
  Component: React.ReactElement,
  portal: boolean | undefined | null | string | Record<any, any>
) => {
  if (portal === false || portal === void 0 || portal === null) return Component
  const props: PortalizeProps = {children: Component}
  if (typeof portal === 'string') props.container = portal
  else Object.assign(props, portal)
  return React.createElement(Portalize, props)
}

export interface TargetProps {
  placement?: Placement
  portal?: boolean | undefined | null | string | Record<any, any>
  closeOnEscape?: boolean
  closedClass?: string
  openClass?: string
  closedStyle?: React.CSSProperties
  openStyle?: React.CSSProperties
  children: JSX.Element | React.ReactElement
}

let isServer: boolean

export const Target: React.FC<TargetProps> = ({
  placement = 'bottom',
  portal,
  openStyle,
  closedStyle,
  closedClass,
  closeOnEscape = true,
  openClass = 'popover--open',
  children,
}) => {
  let {
    id,
    style,
    isOpen,
    close,
    reposition,
    triggeredBy,
    targetRef,
  } = usePopover()

  const ref = useMergedRef(
    // @ts-ignore
    children.ref,
    targetRef
  )
  // Closes the modal when escape is pressed
  useKey(targetRef, {Escape: () => closeOnEscape && close()})
  useConditionalFocus(targetRef, isOpen, {includeRoot: true})
  // handles repositioning the popover
  // Yes this is correct, it's React.useEffect, not useLayoutEffect
  // Just move on .
  React.useEffect(() => {
    reposition(placement as Placement)
    isServer = false
  }, [placement, reposition])

  const defaultStyles = isOpen ? isOpenStyles : isClosedStyles
  triggeredBy = triggeredBy || 'click'
  const isClickTrigger = triggeredBy.indexOf('click') > -1

  return portalize(
    React.cloneElement(children, {
      'aria-modal': isClickTrigger ? 'false' : void 0,
      'aria-hidden': String(!isOpen),
      key: String(isServer),
      id,
      role: isClickTrigger ? 'dialog' : 'tooltip',
      className:
        clsx(children.props.className, isOpen ? openClass : closedClass) ||
        void 0,
      style: Object.assign(
        {},
        defaultStyles,
        children.props.style,
        style,
        isOpen ? openStyle : closedStyle
      ),
      ref,
    }),
    portal
  )
}

interface PopoverContainerProps {
  id?: string
  open: () => void
  close: () => void
  toggle: () => void
  isOpen: boolean
  containPolicy: ContainPolicy
  windowSize: [number, number]
  scrollY?: number
  repositionOnResize: boolean | number
  repositionOnScroll: boolean | number
  children:
    | React.ReactChild
    | React.ReactChild[]
    | JSX.Element[]
    | JSX.Element
    | ((context: PopoverContextValue) => React.ReactChild)
}

interface PlacementState extends PlacementResult {
  requestedPlacement: Placement | null
}

const PopoverContainer: React.FC<PopoverContainerProps> = React.memo(
  ({
    id,
    open,
    close,
    toggle,
    isOpen,
    containPolicy,
    windowSize,
    scrollY,
    children,
  }) => {
    const triggerRef = React.useRef<HTMLElement | null>(null),
      targetRef = React.useRef<HTMLElement | null>(null),
      [{style, requestedPlacement, placement}, setState] = React.useState<
        PlacementState
      >({
        style: {top: 0, right: 0, bottom: 0, left: 0},
        placement: 'bottom',
        requestedPlacement: 'bottom',
      }),
      reposition = React.useCallback(
        (nextPlacement) => {
          if (!triggerRef.current || !targetRef.current) return
          setState(
            setPlacementStyle(
              nextPlacement,
              triggerRef.current,
              targetRef.current,
              containPolicy
            )
          )
        },
        [containPolicy]
      ),
      [triggeredBy, setTriggeredBy] = React.useState<string | null>(null)

    useLayoutEffect(() => {
      isOpen && reposition(requestedPlacement)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, reposition, scrollY, windowSize[0], windowSize[1]])

    const childContext = React.useMemo(
      () => ({
        isOpen,
        open,
        close,
        toggle,
        id,
        style,
        placement,
        reposition,
        targetRef,
        triggerRef,
        triggeredBy,
        setTriggeredBy,
      }),
      [
        id,
        isOpen,
        open,
        close,
        toggle,
        placement,
        reposition,
        triggeredBy,
        style,
      ]
    )

    return (
      <PopoverContext.Provider
        value={childContext}
        children={
          // @ts-ignore
          typeof children === 'function' ? children(childContext) : children
        }
      />
    )
  },
  (prev, next) =>
    // bails out if the popover is closed and was closed
    // and the children didn't change
    (next.isOpen === false &&
      prev.isOpen === false &&
      prev.children === next.children) ||
    // bails out if all else is equal
    (prev.children === next.children &&
      prev.isOpen === next.isOpen &&
      prev.windowSize[0] === next.windowSize[0] &&
      prev.windowSize[1] === next.windowSize[1] &&
      prev.scrollY === next.scrollY &&
      prev.containPolicy === next.containPolicy)
)

export interface CloseProps {
  children: JSX.Element | React.ReactElement
}

export const Close: React.FC<CloseProps> = ({children}) => {
  const {close, isOpen, id} = usePopover()

  return (
    <Button>
      {React.cloneElement(children, {
        'aria-controls': id,
        'aria-haspopup': 'dialog',
        'aria-expanded': String(isOpen),
        'aria-label': children.props['aria-label'] || 'Close',
        onClick: React.useCallback(
          (e) => {
            e.stopPropagation()
            close()
            children.props.onClick?.(e)
          },
          [close, children.props.onClick]
        ),
      })}
    </Button>
  )
}

export interface TriggerProps {
  on: string
  openClass?: string
  closedClass?: string
  openStyle?: React.CSSProperties
  closedStyle?: React.CSSProperties
  children: JSX.Element | React.ReactElement
}

export const Trigger: React.FC<TriggerProps> = ({
  children,
  on,
  openClass,
  closedClass,
  openStyle,
  closedStyle,
}) => {
  const {
      isOpen,
      open,
      close,
      toggle,
      id,
      triggerRef,
      setTriggeredBy,
    } = usePopover(),
    prevOpen = React.useRef<boolean>(isOpen),
    ref = useMergedRef(
      // @ts-ignore
      children.ref,
      triggerRef
    )
  useConditionalFocus(
    triggerRef,
    prevOpen.current && !isOpen && on.indexOf('click') > -1,
    {includeRoot: true}
  )
  React.useEffect(() => {
    setTriggeredBy(on)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on])
  // returns the focus to the trigger when the popover box closes if focus is
  // not an event that triggers opening the popover and prevents the trigger
  // from capturing the window focus right away
  React.useEffect(() => {
    prevOpen.current = isOpen
  }, [isOpen])

  const isClickable = on.indexOf('click') > -1
  const isFocusable = on.indexOf('focus') > -1
  const isHoverable = on.indexOf('hover') > -1
  const props = children.props
  const child = React.cloneElement(children, {
    'aria-controls': id,
    'aria-haspopup': props.hasOwnProperty('aria-haspopup')
      ? props['aria-haspopup']
      : 'dialog',
    'aria-expanded': String(isOpen),
    className:
      clsx(props.className, isOpen ? openClass : closedClass) || void 0,
    onClick: !isClickable
      ? props.onClick
      : (e: React.MouseEvent<HTMLElement>) => {
          e.stopPropagation()
          toggle()
          props.onClick?.(e)
        },
    onFocus: !isFocusable
      ? props.onFocus
      : (e: React.MouseEvent<HTMLElement>) => {
          open()
          props.onFocus?.(e)
        },
    onMouseEnter: !isHoverable
      ? props.onMouseEnter
      : (e: React.MouseEvent<HTMLElement>) => {
          open()
          props.onMouseEnter?.(e)
        },
    onMouseLeave: !isHoverable
      ? props.onMouseLeave
      : (e: React.MouseEvent<HTMLElement>) => {
          close()
          props.onMouseLeave?.(e)
        },
    style: Object.assign({}, props.style, isOpen ? openStyle : closedStyle),
    ref,
  })

  return isClickable ? <Button>{child}</Button> : child
}

const ScrollPositioner: React.FC<PopoverContainerProps> = (props) =>
  React.createElement(
    PopoverContainer,
    Object.assign(
      {
        scrollY: useWindowScroll(
          props.repositionOnScroll === true
            ? Infinity
            : (props.repositionOnScroll as number)
        ),
      },
      props
    )
  )

const ResizePositioner: React.FC<PopoverContainerProps> = (prevProps) => {
  const props = Object.assign(
    {
      windowSize: useWindowSize({
        initialWidth: 1280,
        initialHeight: 720,
        fps:
          prevProps.repositionOnResize === true
            ? Infinity
            : (prevProps.repositionOnResize as number),
      }),
    },
    prevProps
  )

  return React.createElement(
    props.repositionOnScroll ? ScrollPositioner : PopoverContainer,
    props
  )
}

const defaultWindowSize: [number, number] = [0, 0]

export interface PopoverProps {
  id?: string
  open?: boolean
  defaultOpen?: boolean
  repositionOnResize?: boolean
  repositionOnScroll?: boolean
  containPolicy?: ContainPolicy
  onChange?: (isOpen: boolean) => void
  children:
    | React.ReactChild
    | React.ReactChild[]
    | JSX.Element[]
    | JSX.Element
    | ((context: PopoverContextValue) => React.ReactChild)
}

export const Popover: React.FC<PopoverProps> = ({
  id,
  open,
  defaultOpen,
  repositionOnResize = false,
  repositionOnScroll = false,
  containPolicy = 'flip',
  onChange,
  children,
}) => {
  const [isOpen_, toggle] = useSwitch(defaultOpen)
  const didMount = React.useRef<undefined | boolean>()
  const storedOnChange = React.useRef(onChange)
  storedOnChange.current = onChange
  id = useId(id)

  React.useEffect(() => {
    didMount.current && storedOnChange.current?.(isOpen_)
    didMount.current = true
  }, [isOpen_])

  return React.createElement(
    repositionOnResize
      ? ResizePositioner
      : repositionOnScroll
      ? ScrollPositioner
      : PopoverContainer,
    {
      id,
      open: toggle.on,
      close: toggle.off,
      toggle,
      isOpen: open === void 0 || open === null ? isOpen_ : open,
      containPolicy: containPolicy as ContainPolicy,
      windowSize: defaultWindowSize,
      repositionOnResize,
      repositionOnScroll,
      children,
    }
  )
}

/* istanbul ignore next */
if (__DEV__) {
  Popover.displayName = 'Popover'
  Target.displayName = 'Target'
  Trigger.displayName = 'Trigger'
}
