import * as React from 'react'
interface StyleRectX {
  right: number | 'auto'
  left: number | 'auto'
}
interface StyleRectY {
  top: number | 'auto'
  bottom: number | 'auto'
}
interface StyleRect extends StyleRectX, StyleRectY {}
export declare type Placement =
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
export declare type ContainPolicy =
  | 'flip'
  | 'flipX'
  | 'flipY'
  | null
  | ((
      placement: string,
      triggerRect: ClientRect,
      popoverRect: ClientRect
    ) => Placement | PlacementResult)
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
export declare const PopoverContext: React.Context<PopoverContextValue>,
  PopoverConsumer: React.Consumer<PopoverContextValue>,
  usePopover: () => PopoverContextValue,
  usePlacement: () => Placement,
  useControls: () => PopoverControls,
  useIsOpen: () => boolean
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
export declare const Target: React.FC<TargetProps>
export interface CloseProps {
  children: JSX.Element | React.ReactElement
}
export declare const Close: React.FC<CloseProps>
export interface TriggerProps {
  on: string
  openClass?: string
  closedClass?: string
  openStyle?: React.CSSProperties
  closedStyle?: React.CSSProperties
  children: JSX.Element | React.ReactElement
}
export declare const Trigger: React.FC<TriggerProps>
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
export declare const Popover: React.FC<PopoverProps>
export {}
