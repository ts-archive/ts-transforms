
import { DataEntity } from '@terascope/job-components';
import { OperationConfig, WatcherConfig } from '../interfaces';
import PhaseBase from './base';
import { OperationsManager, OperationBase } from '../operations';
import _ from 'lodash';

export default class SelectionPhase extends PhaseBase {
    private opConfig: WatcherConfig;
    readonly selectionPhase: OperationBase[];

    constructor(opConfig: WatcherConfig, configList:OperationConfig[], opsManager: OperationsManager) {
        super();
        this.opConfig = opConfig;
        const selectionPhase: OperationBase[] = [];
        const dict = {};
        const Selector = opsManager.getTransform('selector');

        _.forEach(configList, (config: OperationConfig) => {
            if (config.selector && !config.follow && !config.other_match_required) dict[config.selector] = true;
        });
        // @ts-ignore
        _.forOwn(dict, (_value, selector) => selectionPhase.push(new Selector({ selector }, this.opConfig.types)));
        this.selectionPhase = selectionPhase;
    }

    public run(data: DataEntity[]): DataEntity[] {
        if (this.selectionPhase.length > 0) {
            return data.reduce<DataEntity[]>((results, record) => {
                _.each(this.selectionPhase, selectorOp => selectorOp.run(record));
                const recordMeta = record.getMetadata('selectors');
                if (recordMeta) {
                    results.push(record);
                }
                return results;
            }, []);
        }

        return [];
    }
}
