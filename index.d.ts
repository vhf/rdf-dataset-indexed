import { BaseQuad, DataFactory, Dataset, Quad } from 'rdf-js';

declare function datasetFactory<Q extends BaseQuad = Quad>(quads?: Array<Q>, dataFactory?: DataFactory): Dataset<Q>;

export default datasetFactory;
