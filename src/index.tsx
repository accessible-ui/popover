import React, {
  useRef,
  useEffect,
  useContext,
  useState,
  useCallback,
  useMemo,
  CSSProperties,
  MutableRefObject,
} from 'react'
import useWindowSize from '@react-hook/window-size/throttled'
import useLayoutEffect from '@react-hook/passive-layout-effect'
import useSwitch from '@react-hook/switch'
import useMergedRef from '@react-hook/merged-ref'
import useWindowScroll from '@react-hook/window-scroll'
import {useId} from '@reach/auto-id'
import Portalize from 'react-portalize'
import clsx from 'clsx'

const __DEV__ =
  typeof process !== 'undefined' && process.env.NODE_ENV !== 'production'

const objectWithoutProps = (
  obj: Record<any, any>,
  props: Record<any, any>
): Record<any, any> => {
  const next = {},
    keys = Object.keys(obj),
    len = keys.length
  let i = 0
  for (; i < len; i++)
    if (props[keys[i]] === void 0) next[keys[i]] = obj[keys[i]]
  return next
}

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

const endXInnerPos = triggerRect => {
  return {
    left: 'auto',
    right: windowWidth() - triggerRect.right,
  }
}

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
  const rect = {
    right: popoverRect.width / 2 - triggerRect.width / 2 + triggerRect.right,
  }
  // @ts-ignore
  rect.left = rect.right - popoverRect.width
  return rect
}

const startXOuterRect = (triggerRect, popoverRect) => {
  const rect = {right: triggerRect.left}
  // @ts-ignore
  rect.left = rect.right - popoverRect.width
  return rect
}

const endXOuterRect = (triggerRect, popoverRect) => {
  const rect = {left: triggerRect.right}
  // @ts-ignore
  rect.right = rect.left + popoverRect.width
  return rect
}

const centerYRect = (triggerRect, popoverRect) => {
  const rect = {
    bottom:
      popoverRect.height / 2 - triggerRect.height / 2 + triggerRect.bottom,
  }
  // @ts-ignore
  rect.top = rect.bottom - popoverRect.height
  return rect
}

const startYOuterRect = (triggerRect, popoverRect) => {
  const rect = {bottom: triggerRect.top}
  // @ts-ignore
  rect.top = rect.bottom - popoverRect.height
  return rect
}

const endYOuterRect = (triggerRect, popoverRect) => {
  const rect = {top: triggerRect.bottom}
  // @ts-ignore
  rect.bottom = rect.top + popoverRect.height
  return rect
}

const startXInnerRect = (triggerRect, popoverRect) => {
  const rect = {left: triggerRect.left}
  // @ts-ignore
  rect.right = rect.left + popoverRect.width
  return rect
}

const endXInnerRect = (triggerRect, popoverRect) => {
  const rect = {right: triggerRect.right}
  // @ts-ignore
  rect.left = rect.right - popoverRect.width
  return rect
}

const startYInnerRect = (triggerRect, popoverRect) => {
  const rect = {top: triggerRect.top}
  // @ts-ignore
  rect.bottom = rect.top + popoverRect.height
  return rect
}

const endYInnerRect = (triggerRect, popoverRect) => {
  const rect = {bottom: triggerRect.bottom}
  // @ts-ignore
  rect.top = rect.bottom - popoverRect.height
  return rect
}

const assignY = (a, b) => {
  a.top = b.top
  a.bottom = b.bottom
  return a
}

const calcIdealRect = (
  placement: string,
  triggerRect: ClientRect,
  popoverRect: ClientRect
): StyleRect => {
  switch (placement) {
    case 'top':
      return assignY(
        centerXRect(triggerRect, popoverRect),
        startYOuterRect(triggerRect, popoverRect)
      )

    case 'topleft':
      return assignY(
        startXInnerRect(triggerRect, popoverRect),
        startYOuterRect(triggerRect, popoverRect)
      )

    case 'topright':
      return assignY(
        endXInnerRect(triggerRect, popoverRect),
        startYOuterRect(triggerRect, popoverRect)
      )

    case 'right':
      return assignY(
        endXOuterRect(triggerRect, popoverRect),
        centerYRect(triggerRect, popoverRect)
      )

    case 'righttop':
      return assignY(
        endXOuterRect(triggerRect, popoverRect),
        startYInnerRect(triggerRect, popoverRect)
      )

    case 'rightbottom':
      return assignY(
        endXOuterRect(triggerRect, popoverRect),
        endYInnerRect(triggerRect, popoverRect)
      )

    case 'bottom':
      return assignY(
        centerXRect(triggerRect, popoverRect),
        endYOuterRect(triggerRect, popoverRect)
      )

    case 'bottomleft':
      return assignY(
        startXInnerRect(triggerRect, popoverRect),
        endYOuterRect(triggerRect, popoverRect)
      )

    case 'bottomright':
      return assignY(
        endXInnerRect(triggerRect, popoverRect),
        endYOuterRect(triggerRect, popoverRect)
      )

    case 'left':
      return assignY(
        startXOuterRect(triggerRect, popoverRect),
        centerYRect(triggerRect, popoverRect)
      )

    case 'lefttop':
      return assignY(
        startXOuterRect(triggerRect, popoverRect),
        startYInnerRect(triggerRect, popoverRect)
      )

    case 'leftbottom':
      return assignY(
        startXOuterRect(triggerRect, popoverRect),
        endYInnerRect(triggerRect, popoverRect)
      )

    case 'innerleft':
      return assignY(
        startXInnerRect(triggerRect, popoverRect),
        centerYRect(triggerRect, popoverRect)
      )

    case 'innerright':
      return assignY(
        endXInnerRect(triggerRect, popoverRect),
        centerYRect(triggerRect, popoverRect)
      )

    case 'innertop':
      return assignY(
        centerXRect(triggerRect, popoverRect),
        startYInnerRect(triggerRect, popoverRect)
      )

    case 'innertopleft':
      return assignY(
        startXInnerRect(triggerRect, popoverRect),
        startYInnerRect(triggerRect, popoverRect)
      )

    case 'innertopright':
      return assignY(
        endXInnerRect(triggerRect, popoverRect),
        startYInnerRect(triggerRect, popoverRect)
      )

    case 'innerbottom':
      return assignY(
        centerXRect(triggerRect, popoverRect),
        endYInnerRect(triggerRect, popoverRect)
      )

    case 'innerbottomleft':
      return assignY(
        startXInnerRect(triggerRect, popoverRect),
        endYInnerRect(triggerRect, popoverRect)
      )

    case 'innerbottomright':
      return assignY(
        endXInnerRect(triggerRect, popoverRect),
        endYInnerRect(triggerRect, popoverRect)
      )

    default:
      return assignY(
        centerXRect(triggerRect, popoverRect),
        centerYRect(triggerRect, popoverRect)
      )
  }
}

const contain = (placement: string) => (
  triggerRect: ClientRect,
  popoverRect: ClientRect,
  containPolicy
): PlacementResult => {
  const flip = containPolicy === 'flip',
    flipX = containPolicy === 'flipX',
    flipY = containPolicy === 'flipY'

  if (flip || flipX || flipY) {
    const idealRect = calcIdealRect(placement, triggerRect, popoverRect)

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
    placement = containPolicy(triggerRect, popoverRect)

    if (typeof placement !== 'string') return placement
  }

  return calcPlacement(placement, triggerRect, popoverRect)
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
  | 'inner'
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

const calcPlacement = (
  placement: string,
  triggerRect: ClientRect,
  popoverRect: ClientRect
): PlacementResult => {
  switch (placement) {
    case 'top':
      return {
        placement: 'top',
        style: assignY(
          centerXPos(triggerRect, popoverRect),
          startYOuterPos(triggerRect)
        ),
      }

    case 'topleft':
      return {
        placement: 'topLeft',
        style: assignY(
          startXInnerPos(triggerRect),
          startYOuterPos(triggerRect)
        ),
      }

    case 'topright':
      return {
        placement: 'topRight',
        style: assignY(endXInnerPos(triggerRect), startYOuterPos(triggerRect)),
      }

    case 'right':
      return {
        placement: 'right',
        style: assignY(
          endXOuterPos(triggerRect),
          centerYPos(triggerRect, popoverRect)
        ),
      }

    case 'righttop':
      return {
        placement: 'rightTop',
        style: assignY(endXOuterPos(triggerRect), startYInnerPos(triggerRect)),
      }

    case 'rightbottom':
      return {
        placement: 'rightBottom',
        style: assignY(endXOuterPos(triggerRect), endYInnerPos(triggerRect)),
      }

    case 'bottom':
      return {
        placement: 'bottom',
        style: assignY(
          centerXPos(triggerRect, popoverRect),
          endYOuterPos(triggerRect)
        ),
      }

    case 'bottomleft':
      return {
        placement: 'bottomLeft',
        style: assignY(startXInnerPos(triggerRect), endYOuterPos(triggerRect)),
      }

    case 'bottomright':
      return {
        placement: 'bottomRight',
        style: assignY(endXInnerPos(triggerRect), endYOuterPos(triggerRect)),
      }

    case 'left':
      return {
        placement: 'left',
        style: assignY(
          startXOuterPos(triggerRect),
          centerYPos(triggerRect, popoverRect)
        ),
      }

    case 'lefttop':
      return {
        placement: 'leftTop',
        style: assignY(
          startXOuterPos(triggerRect),
          startYInnerPos(triggerRect)
        ),
      }

    case 'leftbottom':
      return {
        placement: 'leftBottom',
        style: assignY(startXOuterPos(triggerRect), endYInnerPos(triggerRect)),
      }

    case 'innertop':
      return {
        placement: 'innerTop',
        style: assignY(
          centerXPos(triggerRect, popoverRect),
          startYInnerPos(triggerRect)
        ),
      }

    case 'innertopleft':
      return {
        placement: 'innerTopLeft',
        style: assignY(
          startXInnerPos(triggerRect),
          startYInnerPos(triggerRect)
        ),
      }

    case 'innertopright':
      return {
        placement: 'innerTopRight',
        style: assignY(endXInnerPos(triggerRect), startYInnerPos(triggerRect)),
      }

    case 'innerright':
      return {
        placement: 'innerRight',
        style: assignY(
          endXInnerPos(triggerRect),
          centerYPos(triggerRect, popoverRect)
        ),
      }

    case 'innerbottom':
      return {
        placement: 'innerBottom',
        style: assignY(
          centerXPos(triggerRect, popoverRect),
          endYInnerPos(triggerRect)
        ),
      }

    case 'innerbottomright':
      return {
        placement: 'innerBottomRight',
        style: assignY(endXInnerPos(triggerRect), endYInnerPos(triggerRect)),
      }

    case 'innerbottomleft':
      return {
        placement: 'innerBottomLeft',
        style: assignY(startXInnerPos(triggerRect), endYInnerPos(triggerRect)),
      }

    case 'innerleft':
      return {
        placement: 'innerLeft',
        style: assignY(
          startXInnerPos(triggerRect),
          centerYPos(triggerRect, popoverRect)
        ),
      }

    default:
      return {
        placement: 'center',
        style: assignY(
          centerXPos(triggerRect, popoverRect),
          centerYPos(triggerRect, popoverRect)
        ),
      }
  }
}

const defaultPlacements = /outer|center/g

export type ContainPolicy =
  | 'flip'
  | 'flipX'
  | 'flipY'
  | ((triggerRect: ClientRect, popoverRect: ClientRect) => string)

export const setPlacementStyle = (
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

  if (typeof placement === 'function') {
    result = placement(triggerRect, popoverRect, containPolicy)

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
    const fn = contain(placement.toLowerCase().replace(defaultPlacements, ''))
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
  id: string
  style: CSSProperties
  ref: MutableRefObject<HTMLElement | null>
  triggerRef: MutableRefObject<HTMLElement | null>
  placement: Placement
  reposition: (nextPlacement: Placement) => void
}

export const PopoverContext = React.createContext<PopoverContextValue>({
    isOpen: false,
    open: () => {},
    close: () => {},
    toggle: () => {},
    id: '',
    style: {},
    ref: {current: null},
    triggerRef: {current: null},
    placement: 'center',
    reposition: () => {},
  }),
  {Consumer: PopoverConsumer} = PopoverContext,
  usePopoverContext = () => useContext<PopoverContextValue>(PopoverContext)

const defaultStyles: CSSProperties = {position: 'fixed'}
const withoutPop = {ref: 0, triggerRef: 0, style: 0}

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

export interface PopoverBoxProps {
  as?: any
  placement: Placement
  portal?: boolean | undefined | null | string | Record<any, any>
  className?: string
  openClassName?: string
  style?: CSSProperties
}

export const PopoverBox: React.FC<PopoverBoxProps> = React.forwardRef(
  (
    {
      as = 'div',
      placement = 'bottom',
      portal,
      className,
      openClassName = 'popover--open',
      style,
      children,
    },
    ref: MutableRefObject<HTMLElement>
  ) => {
    const popover = usePopoverContext()
    // handles repositioning the popover
    // Yes this is correct, it's useEffect, not useLayoutEffect
    // Just move on .
    useEffect(() => {
      if (typeof placement === 'function') popover.reposition(placement)
    }, [placement])
    // handles closing the popover when the ESC key is pressed
    useLayoutEffect(() => {
      const current = popover?.ref?.current
      if (current && popover.isOpen) {
        setTimeout(() => current.focus(), 100)
        const callback = event =>
          parseInt(event.keyCode) === 27 && popover.close()
        current.addEventListener('keyup', callback)
        return () => current.removeEventListener('keyup', callback)
      }

      return
    }, [popover.ref.current, popover.isOpen])

    return portalize(
      React.createElement(
        as,
        {
          ref: useMergedRef(popover.ref, ref),
          className: clsx(className, popover.isOpen && openClassName),
          style: style ? Object.assign({}, defaultStyles) : defaultStyles,
        },
        typeof children === 'function'
          ? children(objectWithoutProps(popover, withoutPop))
          : children
      ),
      portal
    )
  }
)

export interface PopoverContainerProps {
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
    id = String(useId(id))
    const triggerRef = useRef(null),
      popoverRef = useRef(null),
      [{style, requestedPlacement, placement}, setState] = useState<
        PlacementState
      >({
        style: {top: 0, right: 0, bottom: 0, left: 0},
        placement: 'center',
        requestedPlacement: null,
      }),
      reposition = useCallback(
        nextPlacement => {
          setState(
            setPlacementStyle(
              nextPlacement,
              triggerRef.current,
              popoverRef.current,
              containPolicy
            )
          )
        },
        [containPolicy]
      ),
      childContext = useMemo(
        () => ({
          isOpen,
          open,
          close,
          toggle,
          id: id as string,
          style,
          ref: popoverRef,
          placement,
          reposition,
          triggerRef,
        }),
        [isOpen, open, close, toggle, placement, reposition, style]
      )

    useEffect(() => {
      isOpen && reposition(requestedPlacement)
    }, [isOpen, reposition, scrollY, windowSize[0], windowSize[1]])

    return (
      <PopoverContext.Provider
        value={childContext}
        children={
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

export const PopoverMe = props => {
  const {children, on, tabIndex} = props
  const {isOpen, open, close, toggle, id} = usePopoverContext(),
    elementRef = useRef<HTMLElement>(null),
    ref = useMergedRef(usePopoverContext().triggerRef, elementRef),
    seen = useRef(false)

  // returns the focus to the trigger when the popover box closes if focus is
  // not an event that triggers opening the popover
  useLayoutEffect(() => {
    if (!isOpen) {
      if (seen.current) {
        let isTriggeredByFocus = false

        for (const match of on.split(' '))
          if (match === 'focus') {
            isTriggeredByFocus = true
            break
          }

        if (!isTriggeredByFocus) elementRef.current?.focus()
      }

      seen.current = true
    }
  }, [isOpen])

  // handles trigger events
  useLayoutEffect(() => {
    if (elementRef.current && on) {
      const listeners: any[] = []
      const current = elementRef.current
      const addListener = (...args) => {
        listeners.push(args)
        // @ts-ignore
        current.addEventListener(...args)
      }

      for (const match of on.split(' ')) {
        switch (match) {
          case 'hover':
            addListener('mouseenter', open)
            addListener('mouseleave', close)
            break

          case 'focus':
            addListener('focus', open)
            // addListener('blur', close)
            break

          case 'click':
            addListener('click', e => {
              e.stopPropagation()
              toggle()
            })
            break
        }
      }

      return () => {
        // @ts-ignore
        listeners.forEach(args => current.removeEventListener(...args))
      }
    }

    return
  }, [elementRef.current, on, open, close, toggle])

  return React.cloneElement(children, {
    tabIndex:
      children.props.tabIndex ||
      (typeof tabIndex === 'string' ? tabIndex : undefined),
    'aria-controls': props['aria-controls'] || id,
    'aria-haspopup': 'true',
    'aria-expanded': String(isOpen),
    ref,
  })
}

const ScrollPositioner: React.FC<PopoverContainerProps> = props =>
  React.createElement(
    PopoverContainer,
    Object.assign(
      {
        scrollY: useWindowScroll(
          props.repositionOnScroll === true
            ? 30
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
        ? 30
        : (props.repositionOnResize as number),
  })

  return React.createElement(
    props.repositionOnScroll ? ScrollPositioner : PopoverContainer,
    props
  )
}

export interface PopoverProps {
  open?: boolean
  initialOpen?: boolean
  repositionOnResize?: boolean
  repositionOnScroll?: boolean
  containPolicy?: ContainPolicy
}

export const Popover = ({
  open,
  initialOpen,
  repositionOnResize = false,
  repositionOnScroll = false,
  containPolicy = 'flip',
  children,
}) => {
  const [isOpen_, toggle] = useSwitch(initialOpen)
  return React.createElement(
    repositionOnResize
      ? ResizePositioner
      : repositionOnScroll
      ? ScrollPositioner
      : PopoverContainer,
    {
      open: toggle.on,
      close: toggle.off,
      toggle,
      isOpen: open === void 0 || open === null ? isOpen_ : open,
      containPolicy: containPolicy as ContainPolicy,
      windowSize: [0, 0],
      repositionOnResize,
      repositionOnScroll,
    },
    children
  )
}

if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
  Popover.displayName = 'Popover'
  PopoverBox.displayName = 'PopoverBox'
}
