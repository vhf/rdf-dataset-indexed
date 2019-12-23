import { BaseQuad, DataFactory, Dataset, Quad } from 'rdf-js';

declare function dataFactory<Q extends BaseQuad = Quad>(quads?: Array<Q>): DataFactory & DatasetFactory<Q>;

export default dataFactory;
