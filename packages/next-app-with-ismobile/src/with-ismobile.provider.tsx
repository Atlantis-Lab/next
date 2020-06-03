import isMobile                   from 'ismobilejs'
import React, { ElementType, FC } from 'react'

type Props = {
  Component?: ElementType
  isMobileVersion?: boolean
  isTabletVersion?: boolean
}

type State = {}

type ClientContainerProps = {
  Component?: ElementType
}

export const withIsMobile = () => WrapperComponent => {
  const ClientContainer: FC<ClientContainerProps> = ({ Component, ...props }) => (
    <Component {...props} />
  )

  return class withIsMobileWrapper extends React.Component<Props, State> {
    static async getInitialProps(context) {
      let props = {}

      if (WrapperComponent.getInitialProps) {
        props = await WrapperComponent.getInitialProps(context)
      }

      if (!(process as any).browser) {
        const {
          ctx: { req },
        } = context
        const userAgent = req.headers['user-agent']
        return {
          ...props,
          isMobileVersion: isMobile(userAgent).any,
          isTabletVersion: isMobile(userAgent).tablet,
        }
      }
      return {
        ...props,
      }
    }

    render() {
      const { Component, isMobileVersion, isTabletVersion } = this.props

      return (
        <WrapperComponent
          {...this.props}
          Component={wrapperProps => (
            <ClientContainer
              {...wrapperProps}
              Component={Component}
              isMobile={isMobileVersion}
              isTablet={isTabletVersion}
            />
          )}
        />
      )
    }
  }
}
