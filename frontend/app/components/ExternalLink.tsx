import React from 'react'
import { Modal } from 'antd'

interface ExternalLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: React.ReactNode
}

const ExternalLink: React.FC<ExternalLinkProps> = ({ href, children, ...rest }) => {
  const isExternal = /^https?:\/\//.test(href) && !href.includes(window.location.host)

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isExternal) {
      e.preventDefault()
      Modal.confirm({
        title: 'Você está saindo do ambiente',
        content: 'Será aberto um site externo. Deseja continuar?',
        onOk: () => window.open(href, '_blank'),
      })
    }
  }

  return (
    <a href={href} onClick={onClick} {...rest}>
      {children}
    </a>
  )
}

export default ExternalLink
