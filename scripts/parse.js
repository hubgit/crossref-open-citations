const fs = require('fs-extra')

const parse = (inputFile, outputFile) => {
  const input = require('input-stream')(inputFile)

  const items = []

  input.on('data', item => {
    items.push({
      name: item['primary-name'],
      value: item.counts['total-dois']
    })
  })

  input.on('end', () => {
    const output = items.reduce((output, item) => {
      if (output[item.name]) {
        output[item.name] += item.value
      } else {
        output[item.name] = item.value
      }

      return output
    }, {})

    fs.writeJSONSync(outputFile, output)
  })
}

parse('data/raw/open.ndjson', 'data/parsed/open.json')
parse('data/raw/closed.ndjson', 'data/parsed/closed.json')
