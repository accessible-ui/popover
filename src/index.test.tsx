/* jest */
import React from 'react'
// import {renderHook} from '@testing-library/react-hooks'
import {render, fireEvent, cleanup} from '@testing-library/react'
import {Popover, PopoverMe, PopoverBox, Placement} from './index'

describe('<Popover>', () => {
  it('should have a custom id', () => {
    const result = render(
      <Popover id='foobar'>
        <PopoverBox>
          <div>Hello world</div>
        </PopoverBox>

        <PopoverMe on='click'>
          <button>popover me</button>
        </PopoverMe>
      </Popover>
    )

    expect(result.asFragment()).toMatchSnapshot()
  })
})

describe('<PopoverBox>', () => {
  it('should open and close on PopoverMe click', () => {
    const result = render(
      <Popover>
        <PopoverBox>
          <div>
            Hello world
          </div>
        </PopoverBox>

        <PopoverMe on='click'>
          <button>popover me</button>
        </PopoverMe>
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
        <PopoverBox>
          <div>
            Hello world
          </div>
        </PopoverBox>

        <PopoverMe on='hover'>
          <button>popover me</button>
        </PopoverMe>
      </Popover>
    )

    expect(result.asFragment()).toMatchSnapshot()
  })

  it('should have a tooltip role w/ focus trigger', () => {
    const result = render(
      <Popover>
        <PopoverBox>
          <div>
            Hello world
          </div>
        </PopoverBox>

        <PopoverMe on='focus'>
          <button>popover me</button>
        </PopoverMe>
      </Popover>
    )

    expect(result.asFragment()).toMatchSnapshot()
  })

  it('open on PopoverMe focus', () => {
    const result = render(
      <Popover>
        <PopoverBox>
          <div>
            Hello world
          </div>
        </PopoverBox>

        <PopoverMe on='focus'>
          <button>popover me</button>
        </PopoverMe>
      </Popover>
    )

    expect(result.asFragment()).toMatchSnapshot('closed initially')
    fireEvent.focus(result.getByText('popover me'))
    expect(result.asFragment()).toMatchSnapshot('open')
  })

  it('should close on escape key', () => {
    const result = render(
      <Popover>
        <PopoverBox>
          <div>
            Hello world
          </div>
        </PopoverBox>

        <PopoverMe on='click'>
          <button>popover me</button>
        </PopoverMe>
      </Popover>
    )

    expect(result.asFragment()).toMatchSnapshot('closed initially')
    fireEvent.click(result.getByText('popover me'))
    expect(result.asFragment()).toMatchSnapshot('open')
    fireEvent.keyUp(result.getByText('Hello world'), { key: 'Escape', code: 27 })
    expect(result.asFragment()).toMatchSnapshot('closed')
  })

  it(`shouldn't close on escape key if prop is false`, () => {
    const result = render(
      <Popover>
        <PopoverBox closeOnEscape={false}>
          <div>
            Hello world
          </div>
        </PopoverBox>

        <PopoverMe on='click'>
          <button>popover me</button>
        </PopoverMe>
      </Popover>
    )

    expect(result.asFragment()).toMatchSnapshot('closed initially')
    fireEvent.click(result.getByText('popover me'))
    expect(result.asFragment()).toMatchSnapshot('open')
    fireEvent.keyUp(result.getByText('Hello world'), { key: 'Escape', code: 27 })
    expect(result.asFragment()).toMatchSnapshot('still open')
  })

  it(`should assign to custom styles when opened or closed`, () => {
    const result = render(
      <Popover>
        <PopoverBox>
          <div style={{fontSize: '2rem'}}>
            Hello world
          </div>
        </PopoverBox>

        <PopoverMe on='click'>
          <button>popover me</button>
        </PopoverMe>
      </Popover>
    )

    expect(result.asFragment()).toMatchSnapshot()
    fireEvent.click(result.getByText('popover me'))
    expect(result.asFragment()).toMatchSnapshot('open')
  })

  it(`should apply custom classname when opened or closed`, () => {
    const result = render(
      <Popover>
        <PopoverBox>
          <div className='custom'>
            Hello world
          </div>
        </PopoverBox>

        <PopoverMe on='click'>
          <button>popover me</button>
        </PopoverMe>
      </Popover>
    )

    expect(result.asFragment()).toMatchSnapshot()
    fireEvent.click(result.getByText('popover me'))
    expect(result.asFragment()).toMatchSnapshot('open')
  })

  it(`should apply user defined openClassName and closedClassName`, () => {
    const result = render(
      <Popover>
        <PopoverBox closedClassName='closed' openClassName='open'>
          <div>
            Hello world
          </div>
        </PopoverBox>

        <PopoverMe on='click'>
          <button>popover me</button>
        </PopoverMe>
      </Popover>
    )

    expect(result.asFragment()).toMatchSnapshot()
    fireEvent.click(result.getByText('popover me'))
    expect(result.asFragment()).toMatchSnapshot('open')
  })

  it(`should apply user defined openStyle and closedStyle`, () => {
    const result = render(
      <Popover>
        <PopoverBox closedStyle={{display: 'none'}} openStyle={{display: 'block'}}>
          <div>
            Hello world
          </div>
        </PopoverBox>

        <PopoverMe on='click'>
          <button>popover me</button>
        </PopoverMe>
      </Popover>
    )

    expect(result.asFragment()).toMatchSnapshot()
    fireEvent.click(result.getByText('popover me'))
    expect(result.asFragment()).toMatchSnapshot('open')
  })

  it(`should be initially open when defined as such`, () => {
    const result = render(
      <Popover defaultOpen>
        <PopoverBox>
          <div style={{fontSize: '2rem'}}>
            Hello world
          </div>
        </PopoverBox>

        <PopoverMe on='click'>
          <button>popover me</button>
        </PopoverMe>
      </Popover>
    )

    expect(result.asFragment()).toMatchSnapshot('initially open')
    fireEvent.click(result.getByText('popover me'))
    expect(result.asFragment()).toMatchSnapshot('closed')
  })

  it(`should act like a controlled component when 'open' prop is specified`, () => {
    const result = render(
      <Popover open>
        <PopoverBox>
          <div style={{fontSize: '2rem'}}>
            Hello world
          </div>
        </PopoverBox>

        <PopoverMe on='click'>
          <button>popover me</button>
        </PopoverMe>
      </Popover>
    )

    expect(result.asFragment()).toMatchSnapshot('initially open')
    fireEvent.click(result.getByText('popover me'))
    expect(result.asFragment()).toMatchSnapshot('still open')

    result.rerender(
      <Popover open={false}>
        <PopoverBox>
          <div style={{fontSize: '2rem'}}>
            Hello world
          </div>
        </PopoverBox>

        <PopoverMe on='click'>
          <button>popover me</button>
        </PopoverMe>
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
        <PopoverBox portal>
          <div style={{fontSize: '2rem'}}>
            Hello world
          </div>
        </PopoverBox>

        <PopoverMe on='click'>
          <button>popover me</button>
        </PopoverMe>
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
        <PopoverBox portal={{container: '.portals'}}>
          <div style={{fontSize: '2rem'}}>
            Hello world
          </div>
        </PopoverBox>

        <PopoverMe on='click'>
          <button>popover me</button>
        </PopoverMe>
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
        <PopoverBox portal='.portals'>
          <div style={{fontSize: '2rem'}}>
            Hello world
          </div>
        </PopoverBox>

        <PopoverMe on='click'>
          <button>popover me</button>
        </PopoverMe>
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
      'inner',
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
          <PopoverBox placement={placement as Placement}>
            <div style={{fontSize: '2rem'}}>
              Hello world
            </div>
          </PopoverBox>

          <PopoverMe on='click'>
            <button>popover me</button>
          </PopoverMe>
        </Popover>
      )

      fireEvent.click(result.getByText('popover me'))
      expect(result.baseElement).toMatchSnapshot(placement)
      cleanup()
    }
  })
})