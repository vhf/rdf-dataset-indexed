import * as RDF from 'rdf-js';

export * from '@rdfjs/data-model';

export function dataset<Q extends RDF.BaseQuad = RDF.Quad>(quads?: RDF.Dataset<Q> | Q[]): RDF.Dataset<Q>;
