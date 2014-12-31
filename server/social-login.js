var createServiceConfiguration = function(service, clientId, secret) {

    ServiceConfiguration.configurations.remove({
        service: service
    })
    var config = {

        generic: {
            service: service,
            clientId: clientId,
            secret: secret
        },
        facebook: {
            service: service,
            appId: clientId,
            secret: secret
        },
        twitter: {
            service: service,
            consumerKey: clientId,
            secret: secret
        }
    }

    switch (service) {
        case 'facebook':
            return ServiceConfiguration.configurations.insert(config.facebook)
        case 'twitter':
            return ServiceConfiguration.configurations.insert(config.twitter)
        default:
            return ServiceConfiguration.configurations.insert(config.generic)
    }
}

createServiceConfiguration('facebook', '816366145063973', '628e2b177d56b3e60cbc1bff4771e100')
createServiceConfiguration('twitter', '4EM4wYgeIYJgyi6NanZmufNW1', 'Jz8sba5ZECnJaHqU4mSAGgSbCrLBAodDILYWeqPWqP1yOYBKkc')