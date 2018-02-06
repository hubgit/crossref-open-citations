const collection = require('rest-collection-stream')

const fetch = (filter, file) => {
  const output = require('output-stream')(file)

  collection('https://api.crossref.org/v1/members', {
    qs: {
      filter,
      rows: 1000,
    },
    data: (response, body) => body.message.items,
    next: (response, body) => {
      const { message } = body

      if (message.query['start-index'] > message['total-results']) return null

      return {
        offset: message.query['start-index'] + message['items-per-page']
      }
    }
  }).pipe(output)
}

fetch('has-public-references:true', 'data/raw/open.ndjson')
fetch('has-public-references:false', 'data/raw/closed.ndjson')
