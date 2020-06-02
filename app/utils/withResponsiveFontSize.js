import React from 'react'
// import throttle from 'lodash/throttle';

export default function withResponsiveFontSize(Compo) {
  class Wrapper extends React.PureComponent {
    componentDidMount() {
      if (typeof window === 'object') {
        window.addEventListener('resize', this.setRootFontSize)
        this.setRootFontSize()
      }
    }

    componentWillUnmount() {
      if (typeof window === 'object') {
        window.removeEventListener('resize', this.setRootFontSize)
        document.documentElement.style.removeProperty('font-size')
      }
    }

    setRootFontSize = () => {
      const { innerWidth } = window;
      if (innerWidth > 1920) {
        const baseFontSize = 16 + Math.floor((innerWidth * 0.83333 / 100 - 16)/4) * 4;
        document.documentElement.style.setProperty('font-size', `${baseFontSize}px`)
      } else {
        document.documentElement.style.removeProperty('font-size')
      }
    }

    render() {
      return (
        <Compo {...this.props} />
      )
    }
  }
  Wrapper.displayName = `withResponsiveFontSize(${Compo.displayName || Compo.name})`;
  return Wrapper
}