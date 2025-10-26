import React from 'react'
import { Avatar, Tooltip } from '@mui/material'

function UserAvatar({ user, size = 32, showTooltip = true }) {
  const displayName = user?.name || user?.username || 'User'
  const avatarUrl = user?.avatarUrl

  const avatar = (
    <Avatar
      src={avatarUrl}
      alt={displayName}
      sx={{
        width: size,
        height: size,
        bgcolor: 'rgba(99, 102, 241, 0.2)',
        color: '#6366F1',
        fontWeight: 600,
        fontSize: size * 0.4,
      }}
    >
      {!avatarUrl && (displayName.charAt(0).toUpperCase() || 'U')}
    </Avatar>
  )

  if (showTooltip && user) {
    return (
      <Tooltip
        title={
          <div>
            <div style={{ fontWeight: 600 }}>{displayName}</div>
            {user.email && <div style={{ fontSize: '0.85rem' }}>{user.email}</div>}
          </div>
        }
        arrow
      >
        {avatar}
      </Tooltip>
    )
  }

  return avatar
}

export default UserAvatar


