import React, {
  cloneElement,
  useRef,
  useEffect,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react'
import useWindowSize from '@react-hook/window-size/throttled'
import useLayoutEffect from '@react-hook/passive-layout-effect'
import useSwitch from '@react-hook/switch'
import useMergedRef from '@react-hook/merged-ref'
import useWindowScroll from '@react-hook/window-scroll'
import useId from '@accessible/use-id'
import useKeycode from '@accessible/use-keycode'
import useConditionalFocus from '@accessible/use-conditional-focus'
import Button from '@accessible/button'
import Portalize from 'react-portalize'
import clsx from 'clsx'

const __DEV__ =
  typeof process !== 'undefined' && process.env.NODE_ENV !== 'production'

const windowWidth = (): number =>
  window.innerWidth || document.documentElement.clientWidth

const windowHeight = (): number =>
  window.innerHeight || document.documentElement.clientHeight

interface StyleRect {
  top: number | 'auto'
  right: number | 'auto'
  bottom: number | 'auto'
  left: number | 'auto'
}

const centerXPos = (triggerRect, popoverRect) => ({
  left: 'auto',
  right:
    windowWidth() -
    triggerRect.right -
    (popoverRect.width - triggerRect.width) / 2,
})

const centerYPos = (triggerRect, popoverRect) => ({
  top: 'auto',
  bottom:
    windowHeight() -
    triggerRect.bottom -
    (popoverRect.height - triggerRect.height) / 2,
})

const startXInnerPos = triggerRect => ({
  left: triggerRect.left,
  right: 'auto',
})

const startXOuterPos = triggerRect => ({
  left: 'auto',
  right: windowWidth() - triggerRect.left,
})

const endXOuterPos = triggerRect => ({
  left: triggerRect.right,
  right: 'auto',
})

const endXInnerPos = triggerRect => ({
  left: 'auto',
  right: windowWidth() - triggerRect.right,
})

const startYInnerPos = triggerRect => ({
  top: triggerRect.top,
  bottom: 'auto',
})

const startYOuterPos = triggerRect => ({
  top: 'auto',
  bottom: windowHeight() - triggerRect.top,
})

const endYInnerPos = triggerRect => ({
  top: 'auto',
  bottom: windowHeight() - triggerRect.bottom,
})

const endYOuterPos = triggerRect => ({
  top: triggerRect.bottom,
  bottom: 'auto',
})

const centerXRect = (triggerRect, popoverRect) => {
  const right =
    popoverRect.width / 2 - triggerRect.width / 2 + triggerRect.right
  return {
    right,
    left: right - popoverRect.width,
  }
}

const startXOuterRect = (triggerRect, popoverRect) => ({
  right: triggerRect.left,
  left: triggerRect.left - popoverRect.width,
})

const endXOuterRect = (triggerRect, popoverRect) => ({
  left: triggerRect.right,
  right: triggerRect.right + popoverRect.width,
})

const centerYRect = (triggerRect, popoverRect) => {
  const bottom =
    popoverRect.height / 2 - triggerRect.height / 2 + triggerRect.bottom
  return {
    bottom,
    top: bottom - popoverRect.height,
  }
}

const startYOuterRect = (triggerRect, popoverRect) => ({
  bottom: triggerRect.top,
  top: triggerRect.top - popoverRect.height,
})

const endYOuterRect = (triggerRect, popoverRect) => ({
  top: triggerRect.bottom,
  bottom: triggerRect.bottom + popoverRect.height,
})

const startXInnerRect = (triggerRect, popoverRect) => ({
  left: triggerRect.left,
  right: triggerRect.left + popoverRect.width,
})

const endXInnerRect = (triggerRect, popoverRect) => ({
  right: triggerRect.right,
  left: triggerRect.right - popoverRect.width,
})

const startYInnerRect = (triggerRect, popoverRect) => ({
  top: triggerRect.top,
  bottom: triggerRect.top + popoverRect.height,
})

const endYInnerRect = (triggerRect, popoverRect) => ({
  bottom: triggerRect.bottom,
  top: triggerRect.bottom - popoverRect.height,
})

const assignY = (a, b) => {
  a.top = b.top
  a.bottom = b.bottom
  return a
}

const idealFn = (placement, xFn, yFn) => {
  idealRects[placement.toLowerCase()] = (
    triggerRect: ClientRect,
    popoverRect: ClientRect
  ) => assignY(xFn(triggerRect, popoverRect), yFn(triggerRect, popoverRect))
}
const idealRects: Record<
  string,
  (triggerRect: ClientRect, popoverRect: ClientRect) => StyleRect
> = {}
idealFn('top', centerXRect, startYOuterRect)
idealFn('topLeft', startXInnerRect, startYOuterRect)
idealFn('topRight', endXInnerRect, startYOuterRect)
idealFn('right', endXOuterRect, centerYRect)
idealFn('rightTop', endXOuterRect, startYInnerRect)
idealFn('rightBottom', endXOuterRect, endYInnerRect)
idealFn('bottom', centerXRect, endYOuterRect)
idealFn('bottomLeft', startXInnerRect, endYOuterRect)
idealFn('bottomRight', endXInnerRect, endYOuterRect)
idealFn('left', startXOuterRect, centerYRect)
idealFn('leftTop', startXOuterRect, startYInnerRect)
idealFn('leftBottom', startXOuterRect, endYInnerRect)
idealFn('innerLeft', startXInnerRect, centerYRect)
idealFn('innerRight', endXInnerRect, centerYRect)
idealFn('innerTop', centerXRect, startYInnerRect)
idealFn('innerTopLeft', startXInnerRect, startYInnerRect)
idealFn('innerTopRight', endXInnerRect, startYInnerRect)
idealFn('innerBottom', centerXRect, endYInnerRect)
idealFn('innerBottomLeft', startXInnerRect, endYInnerRect)
idealFn('innerBottomRight', endXInnerRect, endYInnerRect)
idealFn('center', centerXRect, centerYRect)

const contain = (placement: string) => (
  triggerRect: ClientRect,
  popoverRect: ClientRect,
  containPolicy
): PlacementResult => {
  const flip = containPolicy === 'flip',
    flipX = containPolicy === 'flipX',
    flipY = containPolicy === 'flipY'

  if (flip || flipX || flipY) {
    const idealRect = (idealRects[placement] || idealRects.center)(
      triggerRect,
      popoverRect
    )

    // center checks
    if (!placement) {
      if (flip || flipY) {
        if (idealRect.bottom > windowHeight()) {
          placement = 'top'
        } else if (idealRect.top < 0) {
          placement = 'bottom'
        }
      }

      if (!placement && (flip || flipX)) {
        if (idealRect.left < 0) {
          placement = 'right'
        } else if (idealRect.right > windowWidth()) {
          placement = 'left'
        }
      }
    }
    // order of these indexes matters... must be before placement === top check
    const leftIdx = placement.indexOf('left'),
      topIdx = placement.indexOf('top')

    if (placement === 'top' || placement === 'bottom') {
      if (flip || flipX) {
        // handles center X-axis case
        if (idealRect.left < 0) {
          placement += 'left'
        } else if (idealRect.right > windowWidth()) {
          placement += 'right'
        }
      }
    }

    if (flip || flipX) {
      // left checks
      if (
        (leftIdx === 0 && idealRect.left < 0) ||
        (leftIdx > 0 && idealRect.right > windowWidth())
      ) {
        placement = placement.replace('left', 'right')
      } else {
        const rightIdx = placement.indexOf('right')
        // right checks
        if (
          (rightIdx === 0 && idealRect.right > windowWidth()) ||
          (rightIdx > 0 && idealRect.left < 0)
        ) {
          placement = placement.replace('right', 'left')
        }
      }
    }

    // handles center Y-axis case
    if (flip || flipY) {
      if (placement === 'left' || placement === 'right') {
        if (idealRect.top < 0) {
          placement += 'top'
        } else if (idealRect.bottom > windowHeight()) {
          placement += 'bottom'
        }
      } else if (placement === 'innerleft' || placement === 'innerright') {
        if (idealRect.top < 0) {
          placement = placement.replace('inner', 'innertop')
        } else if (idealRect.bottom > windowHeight()) {
          placement = placement.replace('inner', 'innerbottom')
        }
      }
    }

    if (flip || flipY) {
      // top checks
      if (
        (topIdx === 0 && idealRect.top < 0) ||
        (topIdx > 0 && idealRect.bottom > windowHeight())
      ) {
        placement = placement.replace('top', 'bottom')
      } else {
        const bottomIdx = placement.indexOf('bottom')
        // bottom checks
        if (
          (bottomIdx === 0 && idealRect.bottom > windowHeight()) ||
          (bottomIdx > 0 && idealRect.top < 0)
        ) {
          placement = placement.replace('bottom', 'top')
        }
      }
    }
  } else if (typeof containPolicy === 'function') {
    placement = containPolicy(placement, triggerRect, popoverRect)
    if (typeof placement !== 'string') return placement
  }

  return (placements[placement] || placements.center)(triggerRect, popoverRect)
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
  style: StyleRect
}

const placements: Record<
  string,
  (triggerRect: ClientRect, popoverRect: ClientRect) => PlacementResult
> = {}
const placementFn = (placement, xFn, yFn) => {
  placements[placement.toLowerCase()] = (
    triggerRect: ClientRect,
    popoverRect: ClientRect
  ): PlacementResult => ({
    placement,
    style: assignY(
      xFn(triggerRect, popoverRect),
      yFn(triggerRect, popoverRect)
    ),
  })
}
placementFn('top', centerXPos, startYOuterPos)
placementFn('topLeft', startXInnerPos, startYOuterPos)
placementFn('topRight', endXInnerPos, startYOuterPos)
placementFn('right', endXOuterPos, centerYPos)
placementFn('rightTop', endXOuterPos, startYInnerPos)
placementFn('rightBottom', endXOuterPos, endYInnerPos)
placementFn('bottom', centerXPos, endYOuterPos)
placementFn('bottomLeft', startXInnerPos, endYOuterPos)
placementFn('bottomRight', endXInnerPos, endYOuterPos)
placementFn('left', startXOuterPos, centerYPos)
placementFn('leftTop', startXOuterPos, startYInnerPos)
placementFn('leftBottom', startXOuterPos, endYInnerPos)
placementFn('innerTop', centerXPos, startYInnerPos)
placementFn('innerTopLeft', startXInnerPos, startYInnerPos)
placementFn('innerTopRight', endXInnerPos, startYInnerPos)
placementFn('innerRight', endXInnerPos, centerYPos)
placementFn('innerBottom', centerXPos, endYInnerPos)
placementFn('innerBottomRight', endXInnerPos, endYInnerPos)
placementFn('innerBottomLeft', startXInnerPos, endYInnerPos)
placementFn('innerLeft', startXInnerPos, centerYPos)
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
  trigger,
  popover,
  containPolicy
): PlacementState | ((prev: PlacementState) => PlacementState) => {
  if (!trigger || !popover) return prev => prev

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
  usePopover = () => useContext<PopoverContextValue>(PopoverContext),
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
  Component,
  portal: boolean | undefined | null | string | Record<any, any>
) => {
  if (portal === false || portal === void 0 || portal === null) return Component
  const props: Record<string, any> = {children: Component}
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

let isServer

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
  // Closes the modal when escape is pressed
  const keycodeRef = useKeycode(27, () => closeOnEscape && close())
  const focusRef = useConditionalFocus(isOpen)
  // @ts-ignore
  const ref = useMergedRef(children.ref, targetRef, keycodeRef, focusRef)
  // handles repositioning the popover
  // Yes this is correct, it's useEffect, not useLayoutEffect
  // Just move on .
  useEffect(() => {
    reposition(placement as Placement)
    isServer = false
  }, [placement])

  const defaultStyles = isOpen ? isOpenStyles : isClosedStyles
  triggeredBy = triggeredBy || 'click'
  const isClickTrigger = triggeredBy.indexOf('click') > -1

  return portalize(
    cloneElement(children, {
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
    const triggerRef = useRef<HTMLElement | null>(null),
      targetRef = useRef<HTMLElement | null>(null),
      [{style, requestedPlacement, placement}, setState] = useState<
        PlacementState
      >({
        style: {top: 0, right: 0, bottom: 0, left: 0},
        placement: 'bottom',
        requestedPlacement: 'bottom',
      }),
      reposition = useCallback(
        nextPlacement => {
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
      [triggeredBy, setTriggeredBy] = useState<string | null>(null)

    useLayoutEffect(() => {
      isOpen && reposition(requestedPlacement)
    }, [isOpen, reposition, scrollY, windowSize[0], windowSize[1]])

    const childContext = useMemo(
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
  const onClick = children.props.onClick

  return (
    <Button>
      {cloneElement(children, {
        'aria-controls': id,
        'aria-haspopup': 'dialog',
        'aria-expanded': String(isOpen),
        'aria-label': children.props['aria-label'] || 'Close',
        onClick: e => {
          close()
          onClick?.(e)
        },
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
    prevOpen = useRef<boolean>(isOpen),
    focusRef = useConditionalFocus(
      prevOpen.current && !isOpen && on.indexOf('click') > -1,
      true
    ),
    // @ts-ignore
    ref = useMergedRef(children.ref, triggerRef, focusRef)

  useEffect(() => {
    setTriggeredBy(on)
  }, [on])
  // returns the focus to the trigger when the popover box closes if focus is
  // not an event that triggers opening the popover and prevents the trigger
  // from capturing the window focus right away
  useLayoutEffect(() => {
    prevOpen.current = isOpen
  }, [isOpen])

  // handles trigger events
  useLayoutEffect(() => {
    const {current} = triggerRef
    if (current && on) {
      const listeners: any[] = []
      const addListener = (...args) => {
        listeners.push(args)
        // @ts-ignore
        current.addEventListener(...args)
      }

      if (on.indexOf('hover') > -1) {
        addListener('mouseenter', open)
        addListener('mouseleave', close)
      }

      if (on.indexOf('focus') > -1) {
        addListener('focus', open)
      }

      if (on.indexOf('click') > -1) {
        addListener('click', e => {
          e.stopPropagation()
          toggle()
        })
      }

      return () => {
        // @ts-ignore
        listeners.forEach(args => current.removeEventListener(...args))
      }
    }

    return
  }, [triggerRef.current, on, open, close, toggle])

  const child = cloneElement(children, {
    'aria-controls': id,
    'aria-haspopup': 'dialog',
    'aria-expanded': String(isOpen),
    className:
      clsx(children.props.className, isOpen ? openClass : closedClass) ||
      void 0,
    style: Object.assign(
      {},
      children.props.style,
      isOpen ? openStyle : closedStyle
    ),
    ref,
  })

  return on.indexOf('click') > -1 ? <Button>{child}</Button> : child
}

const ScrollPositioner: React.FC<PopoverContainerProps> = props =>
  React.createElement(
    PopoverContainer,
    Object.assign(
      {
        scrollY: useWindowScroll(
          props.repositionOnScroll === true
            ? 60
            : (props.repositionOnScroll as number)
        ),
      },
      props
    )
  )

const ResizePositioner: React.FC<PopoverContainerProps> = props => {
  props = Object.assign({}, props)
  props.windowSize = useWindowSize(1280, 720, {
    fps:
      props.repositionOnResize === true
        ? 60
        : (props.repositionOnResize as number),
  })

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
  children,
}) => {
  const [isOpen_, toggle] = useSwitch(defaultOpen)
  id = useId(id)

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
