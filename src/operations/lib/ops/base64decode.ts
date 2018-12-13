
import { DataEntity } from '@terascope/job-components';
import { OperationConfig } from '../../../interfaces';
import _ from 'lodash';
import OperationBase from '../base'

export default class Base64Decode extends OperationBase { 
    constructor(config: OperationConfig) {
        super(config);
    }

    run(doc: DataEntity | null): DataEntity | null {
        if (!doc) return doc;
        try {
            const data = doc[this.source];
            if (typeof data !== 'string') {
                _.unset(doc, this.source);
            } else {
                const buff = Buffer.from(doc[this.source], 'base64');
                doc[this.target] = buff.toString('utf8');
            }
        } catch(err) {
            console.log('am i catching', this.source, 'and', doc)
            _.unset(doc, this.source);
        }
        if (this.removeSource){
            _.unset(doc, this.source);
        }
        return doc;
    }
}