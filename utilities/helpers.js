const moment = require("moment")

exports.ejsRenderer = {
     defaultLayout: (res, view, options = {}) => {
          return res.render(view, { ...options, layout: 'layouts/layout' })
     },
     useLayout: (res, view, layout, options = {}) => {
          return res.render(view, { ...options, layout })
     }
}

exports.getRandomString = (length) => {
     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
     let randomcharacters = ''

     for (let i = 0; i < length; i++) {
          randomIndex = Math.floor(Math.random() * chars.length)
          randomcharacters += chars[randomIndex]
     }

     return randomcharacters;
}

exports.formatStringToAgo = (dateString) => {
     return moment(dateString).fromNow();
}