const getters = {
    userInfo: state => state.user.userInfo,
    asideStatus: state => state.user.asideStatus,
    cachedViews:state => state.tags.cachedViews,
    cacheStatus:state => state.tags.cacheStatus,
}
export default getters

