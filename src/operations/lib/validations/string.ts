
import OperationBase from '../base';
import { DataEntity } from '@terascope/job-components';
import { StringRefs } from '../../../interfaces';
import _ from 'lodash';

export default class String extends OperationBase {
    private length?: number;

    constructor(config: StringRefs) {
        super(config);
        this.length = config.length;
    }

    run(data: DataEntity): DataEntity | null {
        if (typeof data[this.source] !== 'string') _.unset(data, this.source);
        if (this.length && data[this.source] && data[this.source].length !== this.length) _.unset(data, this.source);
        return data;
    }
}
