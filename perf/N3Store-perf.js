#!/usr/bin/env node --expose-gc
const assert = require('assert')
if (!assert.hasOwnProperty('strict')) {
  assert.strict = {
    equal: assert.equal, // eslint-disable-line
    deepEqual: assert.deepEqual // eslint-disable-line
  }
}

function gc () {
  try {
    if (global.gc) { global.gc() }
  } catch (e) {
    console.log('`node --expose-gc index.js`')
    process.exit()
  }
}

const rdf = require('@rdfjs/data-model')

const implementations = {
  '@vhf/rdf-dataset-indexed': require('..'),
  '@rdfjs/dataset': require('@rdfjs/dataset')
}

const prefix = 'http://example.org/#'
const prefixed = (term) => rdf.namedNode(`${prefix}${term}`)

/* Test triples */
const dim = parseInt(process.argv[2], 10) || 64
const dimSquared = dim ** 2
const dimCubed = dim ** 3

for (const [implementation, factory] of Object.entries(implementations)) {
  for (let runs = 0; runs < 2; runs++) {
    gc()
    let dataset = factory.dataset()
    console.log(`\n\n${implementation} performance test, run ${runs + 1}`)
    let TEST = `- Adding ${dimCubed} triples to the default graph`
    console.time(TEST)
    let i, j, k, l
    for (i = 0; i < dim; i++) {
      for (j = 0; j < dim; j++) {
        for (k = 0; k < dim; k++) {
          dataset.add(
            rdf.quad(
              prefixed(i),
              prefixed(j),
              prefixed(k)
            )
          )
        }
      }
    }
    console.timeEnd(TEST)

    console.log(`* Memory usage for triples: ${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`)

    TEST = `- Finding all ${dimCubed} triples in the default graph ${dimSquared * 1} times\t(0 variables)\t`
    console.time(TEST)
    for (i = 0; i < dim; i++) {
      for (j = 0; j < dim; j++) {
        for (k = 0; k < dim; k++) {
          assert.strict.equal(dataset.match(prefixed(i), prefixed(j), prefixed(k), '').size, 1)
        }
      }
    }
    console.timeEnd(TEST)

    TEST = `- Finding all ${dimCubed} triples in the default graph ${dimSquared * 2} times\t(1 variable)\t`
    console.time(TEST)
    for (i = 0; i < dim; i++) {
      for (j = 0; j < dim; j++) {
        assert.strict.equal(dataset.match(prefixed(i), prefixed(j), null, '').size, dim)
      }
    }
    for (i = 0; i < dim; i++) {
      for (j = 0; j < dim; j++) {
        assert.strict.equal(dataset.match(prefixed(i), null, prefixed(j), '').size, dim)
      }
    }
    for (i = 0; i < dim; i++) {
      for (j = 0; j < dim; j++) {
        assert.strict.equal(dataset.match(null, prefixed(i), prefixed(j), '').size, dim)
      }
    }
    console.timeEnd(TEST)

    TEST = `- Finding all ${dimCubed} triples in the default graph ${dimSquared * 3} times\t(2 variables)\t`
    console.time(TEST)
    for (i = 0; i < dim; i++) {
      assert.strict.equal(dataset.match(prefixed(i), null, null, '').size, dimSquared)
    }
    for (j = 0; j < dim; j++) {
      assert.strict.equal(dataset.match(null, prefixed(j), null, '').size, dimSquared)
    }
    for (k = 0; k < dim; k++) {
      assert.strict.equal(dataset.match(null, null, prefixed(k), '').size, dimSquared)
    }
    console.timeEnd(TEST)

    console.log()

    /* Test quads */
    const quadDim = dim / 4
    const quadDimCubed = quadDim ** 3
    const dimQuads = quadDimCubed * quadDim

    dataset = factory.dataset()
    TEST = `- Adding ${dimQuads} quads`
    console.time(TEST)
    for (i = 0; i < quadDim; i++) {
      for (j = 0; j < quadDim; j++) {
        for (k = 0; k < quadDim; k++) {
          for (l = 0; l < quadDim; l++) {
            dataset.add(
              rdf.quad(
                prefixed(i),
                prefixed(j),
                prefixed(k),
                prefixed(l)
              )
            )
          }
        }
      }
    }
    console.timeEnd(TEST)

    console.log(`* Memory usage for quads: ${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`)

    TEST = `- Finding all ${dimQuads} quads ${quadDimCubed * 4} times\t(3 variables)\t`
    console.time(TEST)
    for (i = 0; i < quadDim; i++) {
      assert.strict.equal(dataset.match(prefixed(i), null, null, null).size, quadDimCubed)
    }
    for (j = 0; j < quadDim; j++) {
      assert.strict.equal(dataset.match(null, prefixed(j), null, null).size, quadDimCubed)
    }
    for (k = 0; k < quadDim; k++) {
      assert.strict.equal(dataset.match(null, null, prefixed(k), null).size, quadDimCubed)
    }
    for (l = 0; l < quadDim; l++) {
      assert.strict.equal(dataset.match(null, null, null, prefixed(l)).size, quadDimCubed)
    }
    console.timeEnd(TEST)
  }
}
