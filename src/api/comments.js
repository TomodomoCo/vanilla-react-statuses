import { fetchJson, METHODS, postData } from '@tomodomo/vanilla-react-utils'

export function getCommentsByActivityId(id, options) {
  return fetchJson(`/api/v2/comments?discussionID=${id}&expand=insertUser&limit=100`, options)
}

export function deleteCommentById(id) {
  return fetchJson(`/api/v2/comments/${id}`, { method: METHODS.DELETE })
}

export function postComment({ text, discussionID, apiVersion = 2 }) {
  if (apiVersion === 2) {
    return postData({
      url: '/api/v2/comments',
      data: {
        body: text,
        format: 'Markdown',
        discussionID,
      },
    })
  }

  return postData({
    url: '/api/v1/comments/add',
    data: {
      Body: text,
      Format: 'Markdown',
      DiscussionID: discussionID,
    },
    resultFormat: text,
  })
}
