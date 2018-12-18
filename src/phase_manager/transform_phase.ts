import { DataEntity } from '@terascope/job-components';
import { OperationConfig, WatcherConfig, OperationsDictionary } from '../interfaces';
import PhaseBase from './base';
import * as Ops from '../operations';
import _ from 'lodash';

export default class TransformPhase implements PhaseBase {
     // @ts-ignore
    private opConfig: WatcherConfig;
    private transformPhase: OperationsDictionary;
    private hasTransforms: boolean;

    constructor(opConfig: WatcherConfig, configList:OperationConfig[]) {
        this.opConfig = opConfig;
        this.transformPhase = {};

        _.forEach(configList, (config: OperationConfig) => {
            if (!config.refs && (config.source_field && config.target_field)) {
                if (config.selector) {
                    if (!this.transformPhase[config.selector as string]) this.transformPhase[config.selector as string] = [];
                    this.transformPhase[config.selector as string].push(new Ops.Transform(config));
                }
            }
        });

        _.forEach(configList, (config: OperationConfig) => {
            if (!config.refs && (config.source_field && config.target_field)) {
                if (config.other_match_required) {
                    _.forOwn(this.transformPhase, (sequence: Ops.OperationBase[], _key) => {
                        sequence.push(new Ops.Transform(config));
                    });
                }
            }
        });

        this.hasTransforms = Object.keys(this.transformPhase).length > 0;
    }

    run(dataArray: DataEntity[]): DataEntity[] {
        if (!this.hasTransforms) return dataArray;

        const resultsList: DataEntity[] = [];
        _.each(dataArray, (record) => {
            const selectors = record.getMetadata('selectors');
            const results = {};

            _.forOwn(selectors, (_value, key) => {
                if (this.transformPhase[key]) {
                    this.transformPhase[key].forEach(fn => _.merge(results, fn.run(record)));
                }
            });

            if (Object.keys(results).length > 0) {
                const newRecord = new DataEntity(results, { selectors });
                resultsList.push(newRecord);
            }
        });

        return resultsList;
    }
}
