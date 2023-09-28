import Table from 'cli-table';
import colors from 'colors/safe';

import {Schedule} from './types';
import {
    evalExtremeValues,
    evalPercentiles,
    getPortCallsLength,
    getPortsDetails,
    humanizeTimedelta,
} from './utils/utils';

interface Percentile {
    p_05: number;
    p_20: number;
    p_50: number;
    p_75: number;
    p_90: number;
}

enum Position {
    TOP5,
    MIDDLE,
    BOTTOM5,
}

interface TabularData {
    id: string;
    name: string;
    length: number;
    position: Position;
    percentiles: Percentile | null;
}

const createTabularData = function (schedules: Schedule[]) {
    const ports = getPortsDetails(schedules);
    const {top, bottom} = evalExtremeValues(ports, 5);

    const table = [] as TabularData[];
    for (const [id, portDetail] of Array.from(ports)) {
        const name = portDetail.name;
        const length = getPortCallsLength(portDetail);
        let position = Position.MIDDLE;
        if (top.includes(length)) position = Position.TOP5;
        if (bottom.includes(length)) position = Position.BOTTOM5;
        const percentiles = evalPercentiles(portDetail);
        table.push({id, name, length, position, percentiles});
    }

    return table;
};

const printPercentile = function (percentiles: Percentile | null) {
    if (percentiles === null) return '';
    return [
        ` 5°: ${humanizeTimedelta(percentiles.p_05)}`,
        `20°: ${humanizeTimedelta(percentiles.p_20)}`,
        `50°: ${humanizeTimedelta(percentiles.p_50)}`,
        `75°: ${humanizeTimedelta(percentiles.p_75)}`,
        `90°: ${humanizeTimedelta(percentiles.p_90)}`,
    ].join('\n');
};

const getColorByPosition = function (position: Position) {
    if (position === Position.TOP5) return colors.bgGreen;
    if (position === Position.BOTTOM5) return colors.bgRed;
    if (position === Position.MIDDLE) return (s: string) => s;
    console.assert(false);
    return (s: string) => s;
};

const getLength = function (row: TabularData) {
    const l = row.length;
    return getColorByPosition(row.position)(`${l}`);
};

export const toTable = function (schedules: Schedule[]) {
    const table = new Table({head: ['ID', 'Name', 'Port Calls', 'Percentiles']});
    const data = createTabularData(schedules);

    for (let row of data) table.push([colors.bold(row.id), row.name, getLength(row), printPercentile(row.percentiles)]);
    return table.toString();
};
