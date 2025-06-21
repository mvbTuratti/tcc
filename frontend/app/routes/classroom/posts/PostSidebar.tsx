import React from 'react'
import { Card, List, Button } from 'antd'

export default function PostSidebar({
  scheduledClasses,
  onExternalLink
}: {
  scheduledClasses: { date: string; startHour: string; finalHour: string }[]
  onExternalLink: (href: string) => void
}) {
  return (
    <div className="post-sidebar">
      <Card size="small" title="Próximas Aulas" className="next-classes-card">
        <List
          size="small"
          dataSource={scheduledClasses}
          renderItem={c => (
            <List.Item>
              {`${new Date(c.date).toLocaleDateString()} ${c.startHour}–${c.finalHour}`}
            </List.Item>
          )}
        />
      </Card>
      <Button
        type="primary"
        block
        className="google-button"
        onClick={() => onExternalLink('https://google.com.br')}
      >
        Ir para Google
      </Button>
    </div>
  )
}
