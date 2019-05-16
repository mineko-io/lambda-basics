const getRequest = event => event.Records[0].cf.request
const logging = msg => console.log(msg)

module.exports = (config = {}) => async event => {
    const { uriPart = '', rootDoc = '/index.html', log = false } = config
    
    const request = getRequest(event)
    const uri = request.uri

    log && logging(`Old URI: ${uri}`)

    if (uri.endsWith('/')) {
        request.uri = `${uriPart}${rootDoc}`
        log && logging(`New URI: ${request.uri}`)
    }

    return request
}