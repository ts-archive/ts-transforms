
import _ from 'lodash';
import { DataEntity } from '@terascope/job-components';
import OperationBase from '../base';
import { OperationConfig } from '../../../interfaces';

export default class UuidLike extends OperationBase {
    private regex: RegExp;
    private case: 'lowercase' | 'uppercase';

    constructor(config: OperationConfig) {
        super(config);
        this.regex = /^[^\s]{8}-[^\s]{4}-[^\s]{4}-[^\s]{4}-[^\s]{12}$/g;
        this.case = config.case || 'lowercase';
    }

    normalizeField(value: string): string {
        let results = value;
        if (this.case === 'lowercase') results = results.toLowerCase();
        if (this.case === 'uppercase') results = results.toUpperCase();
        return results;
    }

    run(doc: DataEntity): DataEntity | null {
        const field = _.get(doc, this.source);
        if (typeof field !== 'string') {
            _.unset(doc, this.source);
            return doc;
        }
        const data = this.normalizeField(field);

        if (data.match(this.regex) === null) {
            _.unset(doc, this.source);
        } else {
            _.set(doc, this.source, data);
        }

        return doc;
    }
}
