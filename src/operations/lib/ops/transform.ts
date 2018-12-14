
import { DataEntity } from '@terascope/job-components';
import { OperationConfig } from '../../../interfaces';
import OperationBase from '../base';
import _ from 'lodash';

export default class Transform extends OperationBase {
    private config: OperationConfig;

    constructor(config: OperationConfig) {
        super(config);
        this.config = config;
    }

    sliceString(data: string, start:string, end: string): string | null {
        const indexStart = data.indexOf(start);
        if (indexStart !== -1) {
            const sliceStart = indexStart + start.length;
            let endInd = data.indexOf(end, sliceStart);
            if (endInd === -1) endInd = data.length;
            const extractedSlice = data.slice(sliceStart, endInd);
            if (extractedSlice) return data.slice(sliceStart, endInd);
        }
        return null;
    }

    run(doc: DataEntity): DataEntity | null {
        const { config } = this;
        let data = doc[config.source_field as string];
        if (data) {
            const metaData = doc.getMetadata();
            let transformedResult;
            if (config.regex) {
                const { regex } = config;
                let extractedField;
                if (typeof data === 'string') extractedField = data.match(regex as string);

                if (!extractedField && Array.isArray(data)) {
                    data.forEach((subData:any) => {
                        if (typeof subData === 'string') {
                            const subResults = subData.match(regex as string);
                            if (subResults) extractedField = subResults;
                        }
                    });
                }

                if (extractedField) {
                    const regexResult = extractedField.length === 1 ? extractedField[0] : extractedField[1];
                    if (regexResult) transformedResult = regexResult;
                }

            } else if (config.start && config.end) {
                let { start, end } = config;
                if (end === "EOP") end = '&';

                if (typeof data === 'string') {
                    const extractedSlice = this.sliceString(data, start, end)
                    if (extractedSlice) transformedResult = extractedSlice;
                }
                if (Array.isArray(data)) {
                    data.forEach((subData:any) => {
                        if (typeof subData === 'string') {
                            const extractedSlice = this.sliceString(subData, start, end);
                            if (extractedSlice) transformedResult = extractedSlice;
                        }
                    });
                }
            } else {
                transformedResult = data;
            }

            if (transformedResult) return new DataEntity(_.set({}, config.target_field as string, transformedResult), metaData);
        }

        return null;
    }
}
