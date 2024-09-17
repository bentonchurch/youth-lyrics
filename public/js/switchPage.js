function setPage(page) {
    let dir = window.location.pathname.split('/').slice(0, -1).join('/') + '/'
    window.location.pathname = dir + page
}

function getPageUrl(page) {
    let dir = window.location.pathname.split('/').slice(0, -1).join('/') + '/'
    return dir + page
}