# @vhf/rdf-dataset-indexed

[![Build Status](https://travis-ci.org/vhf/rdf-dataset-indexed.svg?branch=master)](https://travis-ci.org/vhf/rdf-dataset-indexed)
[![Coverage Status](https://coveralls.io/repos/github/vhf/rdf-dataset-indexed/badge.svg?branch=master)](https://coveralls.io/github/vhf/rdf-dataset-indexed?branch=master)
[![npm version](https://badge.fury.io/js/%40vhf%2Frdf-dataset-indexed.svg)](https://www.npmjs.com/package/@vhf/rdf-dataset-indexed)

An indexed implementation of the [RDFJS Dataset Specification](https://rdf.js.org/dataset-spec/) based on a fork of the powerful [N3.js](https://github.com/rdfjs/N3.js) library. [Changelog](/CHANGELOG.md).

Note: while most Dataset implementations reconstruct Quads to retrieve, which can save quite some memory, this implementation makes the opposite tradeoff: it retrieves the actual quad object stored in the first place. This comes at a memory cost but has its own advantages. You are encouraged to experiment and benchmark different implementations of the RDF/JS Dataset Specification before deciding which package you want to use.

See the [RDFJS Dataset specification](https://github.com/rdfjs/dataset-spec) for more details.

## Installing

`npm install @vhf/rdf-dataset-indexed`

## Example Usage

```js
const rdf = require('@vhf/rdf-dataset-indexed')

// create a quad
const aQuad = rdf.quad(
  rdf.blankNode(),
  rdf.namedNode('http://schema.org/memberOf'),
  rdf.namedNode('http://example.com/someOrganization'))

// create a dataset
const dataset = rdf.dataset()
dataset.add(aQuad)

console.log(dataset.match(null, rdf.namedNode('http://schema.org/memberOf')).toArray())

for (const quad of dataset) {
  console.log(quad.object.value)
}
```

## Methods Available on a Dataset Instance

### Basic Functionalities from DatasetCore

```typescript
[Symbol.iterator](): Iterator<Quad>;
```
Makes a Dataset instance iterable.

---

```typescript
readonly size: number;
```
A non-negative integer that specifies the number of quads in the set.

---

```typescript
add(quad: Quad): Dataset;
```
Adds the specified quad to the dataset.

Existing quads, as defined in `Quad.equals`, will be ignored.

---

```typescript
delete(quad: Quad): Dataset;
```
Removes the specified quad from the dataset.

---

```typescript
has(quad: Quad): boolean;
```
Determines whether a dataset includes a certain quad.

---

```typescript
match(subject?: Term | null, predicate?: Term | null, object?: Term | null, graph?: Term | null): this;
```
Returns a new dataset that is comprised of all quads in the current instance matching the given arguments.

The logic described in [Quad Matching](https://rdf.js.org/dataset-spec/#quad-matching) is applied for each
quad in this dataset to check if it should be included in the output dataset.

This method always returns a new DatasetCore, even if that dataset contains no quads.

Since a `DatasetCore` is an unordered set, the order of the quads within the returned sequence is arbitrary.

> ```
> @param subject   The optional exact subject to match.
> @param predicate The optional exact predicate to match.
> @param object    The optional exact object to match.
> @param graph     The optional exact graph to match.
> ```

### Functionalities from Dataset

This part of the specification is marked as **Experimental**.

```typescript
addAll(quads: Quad): Dataset;
```
Imports the quads into this dataset.

This method differs from `Dataset.union` in that it adds all `quads` to the current instance, rather than
combining `quads` and the current instance to create a new instance.

---

```typescript
contains(other: Dataset): boolean;
```
Returns `true` if the current instance is a superset of the given dataset; differently put: if the given dataset
is a subset of, is contained in the current dataset.

Blank Nodes will be normalized.

---

```typescript
deleteMatches(subject?: Term, predicate?: Term, object?: Term, graph?: Term): Dataset;
```
This method removes the quads in the current instance that match the given arguments.

The logic described in [Quad Matching](https://rdf.js.org/dataset-spec/#quad-matching) is applied for each
quad in this dataset to select the quads which will be deleted.
> ```
> @param subject   The optional exact subject to match.
> @param predicate The optional exact predicate to match.
> @param object    The optional exact object to match.
> @param graph     The optional exact graph to match.
> ```
---

```typescript
difference(other: Dataset): Dataset;
```
Returns a new dataset that contains all quads from the current dataset, not included in the given dataset.

---

```typescript
equals(other: Dataset): boolean;
```
Returns true if the current instance contains the same graph structure as the given dataset.

Blank Nodes will be normalized.

---

```typescript
every(iteratee): boolean;
```
Universal quantification method, tests whether every quad in the dataset passes the test implemented by the
provided `iteratee`.

This method immediately returns boolean `false` once a quad that does not pass the test is found.

This method always returns boolean `true` on an empty dataset.

This method is aligned with `Array.prototype.every()` in ECMAScript-262.

---

```typescript
filter(iteratee): Dataset;
```
Creates a new dataset with all the quads that pass the test implemented by the provided `iteratee`.

This method is aligned with Array.prototype.filter() in ECMAScript-262.

---

```typescript
forEach(iteratee): void;
```
Executes the provided `iteratee` once on each quad in the dataset.

This method is aligned with `Array.prototype.forEach()` in ECMAScript-262.

---

```typescript
import(stream: Stream<Quad>): Promise<Dataset>;
```
Imports all quads from the given stream into the dataset.

The stream events `end` and `error` are wrapped in a Promise.

---

```typescript
intersection(other: Dataset): Dataset;
```
Returns a new dataset containing alls quads from the current dataset that are also included in the given dataset.

---

```typescript
map(iteratee): Dataset;
```
Returns a new dataset containing all quads returned by applying `iteratee` to each quad in the current dataset.

---

```typescript
reduce<A>(iteratee, initialValue?: A): A;
```
This method calls the `iteratee` on each `quad` of the `Dataset`. The first time the `iteratee` is called, the
`accumulator` value is the `initialValue` or, if not given, equals to the first quad of the `Dataset`. The return
value of the `iteratee` is used as `accumulator` value for the next calls.

This method returns the return value of the last `iteratee` call.

This method is aligned with `Array.prototype.reduce()` in ECMAScript-262.

---

```typescript
some(iteratee): boolean;
```
Existential quantification method, tests whether some quads in the dataset pass the test implemented by the
provided `iteratee`.

This method immediately returns boolean `true` once a quad that passes the test is found.

This method is aligned with `Array.prototype.some()` in ECMAScript-262.

---

```typescript
toArray(): Quad[];
```
Returns the set of quads within the dataset as a host language native sequence, for example an `Array` in
ECMAScript-262.

Since a `Dataset` is an unordered set, the order of the quads within the returned sequence is arbitrary.

---

```typescript
toCanonical(): string;
```
Returns an N-Quads string representation of the dataset, preprocessed with
[RDF Dataset Normalization](https://json-ld.github.io/normalization/spec/) algorithm.

---

```typescript
toStream(): Stream<Quad>;
```
Returns a stream that contains all quads of the dataset.

---

```typescript
toString(): string;
```
Returns an N-Quads string representation of the dataset.

No prior normalization is required, therefore the results for the same quads may vary depending on the `Dataset`
implementation.

---

```typescript
union(quads: Dataset): Dataset;
```
Returns a new `Dataset` that is a concatenation of this dataset and the quads given as an argument.
