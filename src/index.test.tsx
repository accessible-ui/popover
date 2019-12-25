/* jest */
import React from 'react'
import {renderHook} from '@testing-library/react-hooks'
import {render, fireEvent, cleanup} from '@testing-library/react'
import {
  Popover,
  Trigger,
  Target,
  Close,
  usePopover,
  usePlacement,
  useControls,
  useIsOpen,
  Placement,
} from './index'

describe('<Popover>', () => {
  it('should have a custom id', () => {
    const result = render(
      <Popover id="foobar">
        <Target>
          <div>Hello world</div>
        </Target>

        <Trigger on="click">
          <button>popover me</button>
        </Trigger>
      </Popover>
    )

    expect(result.asFragment()).toMatchSnapshot()
  })

  it('should provide context to function child', () => {
    let cxt

    render(
      <Popover>
        {context => {
          cxt = context
          return <div />
        }}
      </Popover>
    )

    expect(cxt).toMatchSnapshot()
  })
})

describe('<Target>', () => {
  it('should open and close on Trigger click', () => {
    const result = render(
      <Popover>
        <Target>
          <div>Hello world</div>
        </Target>

        <Trigger on="click">
          <button>popover me</button>
        </Trigger>
      </Popover>
    )

    expect(result.asFragment()).toMatchSnapshot('closed initially')
    fireEvent.click(result.getByText('popover me'))
    expect(result.asFragment()).toMatchSnapshot('open')
    fireEvent.click(result.getByText('popover me'))
    expect(result.asFragment()).toMatchSnapshot('closed')
  })

  it('should have a tooltip role w/ hover trigger', () => {
    const result = render(
      <Popover>
        <Target>
          <div>Hello world</div>
        </Target>

        <Trigger on="hover">
          <button>popover me</button>
        </Trigger>
      </Popover>
    )

    expect(result.asFragment()).toMatchSnapshot()
  })

  it('should have a tooltip role w/ focus trigger', () => {
    const result = render(
      <Popover>
        <Target>
          <div>Hello world</div>
        </Target>

        <Trigger on="focus">
          <button>popover me</button>
        </Trigger>
      </Popover>
    )

    expect(result.asFragment()).toMatchSnapshot()
  })

  it('open on Trigger focus', () => {
    const result = render(
      <Popover>
        <Target>
          <div>Hello world</div>
        </Target>

        <Trigger on="focus">
          <button>popover me</button>
        </Trigger>
      </Popover>
    )

    expect(result.asFragment()).toMatchSnapshot('closed initially')
    fireEvent.focus(result.getByText('popover me'))
    expect(result.asFragment()).toMatchSnapshot('open')
  })

  it('should close on escape key', () => {
    const result = render(
      <Popover>
        <Target>
          <div>Hello world</div>
        </Target>

        <Trigger on="click">
          <button>popover me</button>
        </Trigger>
      </Popover>
    )

    expect(result.asFragment()).toMatchSnapshot('closed initially')
    fireEvent.click(result.getByText('popover me'))
    expect(result.asFragment()).toMatchSnapshot('open')
    fireEvent.keyUp(result.getByText('Hello world'), {key: 'Escape', which: 27})
    expect(result.asFragment()).toMatchSnapshot('closed')
  })

  it(`shouldn't close on escape key if prop is false`, () => {
    const result = render(
      <Popover>
        <Target closeOnEscape={false}>
          <div>Hello world</div>
        </Target>

        <Trigger on="click">
          <button>popover me</button>
        </Trigger>
      </Popover>
    )

    expect(result.asFragment()).toMatchSnapshot('closed initially')
    fireEvent.click(result.getByText('popover me'))
    expect(result.asFragment()).toMatchSnapshot('open')
    fireEvent.keyUp(result.getByText('Hello world'), {key: 'Escape', which: 27})
    expect(result.asFragment()).toMatchSnapshot('still open')
  })

  it(`should assign to custom styles when opened or closed`, () => {
    const result = render(
      <Popover>
        <Target>
          <div style={{fontSize: '2rem'}}>Hello world</div>
        </Target>

        <Trigger on="click">
          <button>popover me</button>
        </Trigger>
      </Popover>
    )

    expect(result.asFragment()).toMatchSnapshot()
    fireEvent.click(result.getByText('popover me'))
    expect(result.asFragment()).toMatchSnapshot('open')
  })

  it(`should apply custom classname when opened or closed`, () => {
    const result = render(
      <Popover>
        <Target>
          <div className="custom">Hello world</div>
        </Target>

        <Trigger on="click">
          <button>popover me</button>
        </Trigger>
      </Popover>
    )

    expect(result.asFragment()).toMatchSnapshot()
    fireEvent.click(result.getByText('popover me'))
    expect(result.asFragment()).toMatchSnapshot('open')
  })

  it(`should apply user defined openClass and closedClass`, () => {
    const result = render(
      <Popover>
        <Target closedClass="closed" openClass="open">
          <div>Hello world</div>
        </Target>

        <Trigger on="click">
          <button>popover me</button>
        </Trigger>
      </Popover>
    )

    expect(result.asFragment()).toMatchSnapshot()
    fireEvent.click(result.getByText('popover me'))
    expect(result.asFragment()).toMatchSnapshot('open')
  })

  it(`should apply user defined openStyle and closedStyle`, () => {
    const result = render(
      <Popover>
        <Target closedStyle={{display: 'none'}} openStyle={{display: 'block'}}>
          <div>Hello world</div>
        </Target>

        <Trigger on="click">
          <button>popover me</button>
        </Trigger>
      </Popover>
    )

    expect(result.asFragment()).toMatchSnapshot()
    fireEvent.click(result.getByText('popover me'))
    expect(result.asFragment()).toMatchSnapshot('open')
  })

  it(`should be initially open when defined as such`, () => {
    const result = render(
      <Popover defaultOpen>
        <Target>
          <div style={{fontSize: '2rem'}}>Hello world</div>
        </Target>

        <Trigger on="click">
          <button>popover me</button>
        </Trigger>
      </Popover>
    )

    expect(result.asFragment()).toMatchSnapshot('initially open')
    fireEvent.click(result.getByText('popover me'))
    expect(result.asFragment()).toMatchSnapshot('closed')
  })

  it(`should act like a controlled component when 'open' prop is specified`, () => {
    const result = render(
      <Popover open>
        <Target>
          <div style={{fontSize: '2rem'}}>Hello world</div>
        </Target>

        <Trigger on="click">
          <button>popover me</button>
        </Trigger>
      </Popover>
    )

    expect(result.asFragment()).toMatchSnapshot('initially open')
    fireEvent.click(result.getByText('popover me'))
    expect(result.asFragment()).toMatchSnapshot('still open')

    result.rerender(
      <Popover open={false}>
        <Target>
          <div style={{fontSize: '2rem'}}>Hello world</div>
        </Target>

        <Trigger on="click">
          <button>popover me</button>
        </Trigger>
      </Popover>
    )

    expect(result.asFragment()).toMatchSnapshot('closed')
    fireEvent.click(result.getByText('popover me'))
    expect(result.asFragment()).toMatchSnapshot('still closed')
  })

  it('should render into a portal by default ID', () => {
    const portalRoot = document.createElement('div')
    portalRoot.setAttribute('id', 'portals')
    document.body.appendChild(portalRoot)

    const result = render(
      <Popover open>
        <Target portal>
          <div style={{fontSize: '2rem'}}>Hello world</div>
        </Target>

        <Trigger on="click">
          <button>popover me</button>
        </Trigger>
      </Popover>
    )

    fireEvent.click(result.getByText('popover me'))
    expect(result.baseElement).toMatchSnapshot()
    document.body.removeChild(portalRoot)
  })

  it('should render into a portal by custom selector object', () => {
    const portalRoot = document.createElement('div')
    portalRoot.setAttribute('class', 'portals')
    document.body.appendChild(portalRoot)

    const result = render(
      <Popover open>
        <Target portal={{container: '.portals'}}>
          <div style={{fontSize: '2rem'}}>Hello world</div>
        </Target>

        <Trigger on="click">
          <button>popover me</button>
        </Trigger>
      </Popover>
    )

    fireEvent.click(result.getByText('popover me'))
    expect(result.baseElement).toMatchSnapshot()
    document.body.removeChild(portalRoot)
  })

  it('should render into a portal by custom selector', () => {
    const portalRoot = document.createElement('div')
    portalRoot.setAttribute('class', 'portals')
    document.body.appendChild(portalRoot)

    const result = render(
      <Popover open>
        <Target portal=".portals">
          <div style={{fontSize: '2rem'}}>Hello world</div>
        </Target>

        <Trigger on="click">
          <button>popover me</button>
        </Trigger>
      </Popover>
    )

    fireEvent.click(result.getByText('popover me'))
    expect(result.baseElement).toMatchSnapshot()
    document.body.removeChild(portalRoot)
  })

  it('should render to different placements', () => {
    const placements = [
      'top',
      'topLeft',
      'topRight',
      'right',
      'rightTop',
      'rightBottom',
      'bottom',
      'bottomLeft',
      'bottomRight',
      'left',
      'leftTop',
      'leftBottom',
      'innerTop',
      'innerTopLeft',
      'innerTopRight',
      'innerRight',
      'innerBottom',
      'innerBottomLeft',
      'innerBottomRight',
      'innerLeft',
      'center',
    ]

    for (const placement of placements) {
      const result = render(
        <Popover open>
          <Target placement={placement as Placement}>
            <div style={{fontSize: '2rem'}}>Hello world</div>
          </Target>

          <Trigger on="click">
            <button>popover me</button>
          </Trigger>
        </Popover>
      )

      fireEvent.click(result.getByText('popover me'))
      expect(result.baseElement).toMatchSnapshot(placement)
      cleanup()
    }
  })
})

describe('useControls()', () => {
  it('should have toggle, open, close keys', () => {
    const {result} = renderHook(() => useControls(), {wrapper: Popover})
    expect(Object.keys(result.current)).toStrictEqual([
      'open',
      'close',
      'toggle',
      'reposition',
    ])
  })
})

describe('<Trigger>', () => {
  it('should have openClass and closedClass', () => {
    const result = render(
      <Popover>
        <Target>
          <div>Hello world</div>
        </Target>

        <Trigger on="click" closedClass="closed" openClass="open">
          <button>popover me</button>
        </Trigger>
      </Popover>
    )

    expect(result.asFragment()).toMatchSnapshot()
    fireEvent.click(result.getByText('popover me'))
    expect(result.asFragment()).toMatchSnapshot('open')
  })

  it('should have openStyle and closedStyle', () => {
    const result = render(
      <Popover>
        <Target>
          <div>Hello world</div>
        </Target>

        <Trigger
          on="click"
          closedStyle={{display: 'none'}}
          openStyle={{display: 'block'}}
        >
          <button>popover me</button>
        </Trigger>
      </Popover>
    )

    expect(result.asFragment()).toMatchSnapshot()
    fireEvent.click(result.getByText('popover me'))
    expect(result.asFragment()).toMatchSnapshot('open')
  })
})

describe('<Close>', () => {
  it('should close the modal', () => {
    const result = render(
      <Popover defaultOpen={true}>
        <Target>
          <div>
            <Close>
              <button data-testid="close">Close me</button>
            </Close>
            Hello world
          </div>
        </Target>

        <Trigger on="click">
          <button>open me</button>
        </Trigger>
      </Popover>
    )

    expect(result.asFragment()).toMatchSnapshot()
    fireEvent.click(result.getByTestId('close'))
    expect(result.asFragment()).toMatchSnapshot('closed')
  })
})

describe('useIsOpen()', () => {
  it('should return boolean', () => {
    const {result} = renderHook(() => useIsOpen(), {wrapper: Popover})
    expect(typeof result.current).toBe('boolean')
  })
})

describe('usePlacement()', () => {
  it('should return boolean', () => {
    const {result} = renderHook(() => usePlacement(), {wrapper: Popover})
    expect(typeof result.current).toBe('string')
  })
})

describe('usePopover()', () => {
  it('should return context', () => {
    const {result} = renderHook(() => usePopover(), {wrapper: Popover})
    expect(result.current).toMatchSnapshot()
  })
})
