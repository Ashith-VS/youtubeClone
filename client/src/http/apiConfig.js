export const baseUrl = 'http://localhost:4000'

export const UrlEndPoint = {
    random: '/api/video/random',
    trend: '/api/video/trend',
    sub: '/api/video/sub',
    user:id=>`/api/user/find/${id}`,
    signIn:'/api/auth/signin',
    signUp:'/api/auth/signup',
    google:'/api/auth/googleAuth',
    video:id=>`/api/video/find/${id}`,
    like:id=>`/api/user/like/${id}`,
    dislike:id=>`/api/user/dislike/${id}`,
    currentUser:'/api/auth/currentUser',
    subscribe:id=>`/api/user/sub/${id}`,
    addComment:'/api/comment',
    comments:id=>`/api/comment/${id}`,
    addVideo:'/api/video',
    recommendation:tags=>`/api/video/tags?tags=${tags}`,
    search:query=>`/api/video/search${query}`,
}
// updateVideo:'/api/video',
// deleteVideo:'/api/video',
// addView:'/api/video/view'