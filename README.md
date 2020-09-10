# Usage
`.drone.yml`
```yml
steps:
- name: line-notify
  image: spadeg25620/drone-line-flex-message
  settings:
    channel_token:
      from_secret: line_channel_token
    to:
      from_secret: line_user_id
  when:
    status: [success, failure]
```
