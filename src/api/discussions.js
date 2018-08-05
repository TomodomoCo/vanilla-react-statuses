import { truncateText, fetchJson, postData, METHODS, getProfile, getUserAccess } from '@tomodomo/vanilla-react-utils'

const { ACTIVITY_CATEGORY_ID } = window.tomodomo.config

// --------  ACTIVITIES  --------

/** @returns moderation permissions of the current user */
export async function getModAccessOnActivities() {
  const { userID } = await getProfile()
  const scope = `category.${ACTIVITY_CATEGORY_ID}`
  return getUserAccess(userID, {
    'comments.delete': scope,
    'discussions.manage': scope,
    // 'comments.edit': scope,
  })
}

export function getActivitiesByPage(page, options) {
  return fetchJson(
    `/api/v2/discussions?categoryId=${ACTIVITY_CATEGORY_ID}&expand=insertUser&page=${page}`,
    options
  )
}

// param options is not used currently
export async function getLegacyActivitiesByPage(page, options) {
  const legacyResult = await fetchJson(`/activity.json?Page=p${page}&expand=Comments`, options)
  const legacyActivities = legacyResult.Activities
    ? legacyResult.Activities.filter(({ ActivityType }) => ActivityType === 'Status')
    : []
  return legacyActivities.map(
    ({ ActivityID, Photo, ActivityName, DateInserted, Story, InsertUserID, Comments }) => ({
      discussionID: ActivityID,
      dateInserted: DateInserted,
      body: Story,
      categoryID: ACTIVITY_CATEGORY_ID,
      countComments: Comments.length,
      insertUser: {
        userID: InsertUserID,
        name: ActivityName,
        photoUrl: Photo,
      },
      isLegacy: true,
      comments: Comments.map(
        ({ ActivityCommentID, Body, InsertName, InsertPhoto, DateInserted }) => ({
          commentID: ActivityCommentID,
          insertUser: {
            photoUrl: InsertPhoto,
            name: InsertName,
          },
          body: Body,
          dateInserted: DateInserted,
        })
      ),
    })
  )
}

export function getActivityById(id) {
  return fetchJson(`/api/v2/discussions/${id}`)
}

export function postActivity({ text, apiVersion = 1 }) {
  if (apiVersion === 2) {
    return postData({
      url: '/api/v2/discussions',
      data: {
        body: text,
        name: truncateText(text, 20),
        format: 'Markdown',
        categoryID: ACTIVITY_CATEGORY_ID,
      },
    })
  }

  return postData({
    url: '/api/v1/discussions/add',
    data: {
      Body: text,
      Name: truncateText(text, 20),
      Format: 'Markdown',
      CategoryID: ACTIVITY_CATEGORY_ID,
    },
    resultFormat: text,
  })
}

export function deleteActivityById(id) {
  return fetchJson(`/api/v2/discussions/${id}`, { method: METHODS.DELETE })
}

export function updateDiscussionById(discussionID, { categoryID, body } = {}) {
  if (!discussionID || (!categoryID && !body)) {
    throw new Error('not enough data to update the discussion')
  }
  return postData({
    url: `/api/v2/discussions/${discussionID}`,
    data: {
      ...(body ? { body } : {}),
      ...(categoryID ? { categoryID } : {}),
    },
    method: METHODS.PATCH,
  })
}
