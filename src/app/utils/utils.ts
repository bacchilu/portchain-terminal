import humanizeDuration from 'humanize-duration';
import stats from 'stats-lite';

import {PortDetail, Schedule} from '../types';

interface PortDetails {
    [id: string]: PortDetail;
}

export const getPortCallsLength = function (d: PortDetail) {
    return d.portCalls.filter((pc) => !pc.isOmitted).length;
};

export const getPortsDetails = function (schedules: Schedule[]) {
    const flattenedSchedule = schedules.reduce((acc, current) => [...acc, ...current], []);
    const portsDict = flattenedSchedule.reduce((acc, current) => {
        const key = current.port.id;
        const prevPortCalls = acc[key] === undefined ? [] : acc[key].portCalls;
        const {arrival, departure, isOmitted} = current;
        const value = [...prevPortCalls, {arrival, departure, isOmitted}];
        return {...acc, [key]: {name: current.port.name, portCalls: value}};
    }, {} as PortDetails);
    return [...Object.keys(portsDict)]
        .sort((a, b) => getPortCallsLength(portsDict[b]) - getPortCallsLength(portsDict[a]))
        .reduce((acc, current) => {
            acc.set(current, portsDict[current]);
            return acc;
        }, new Map<string, PortDetail>());
};

export const evalPercentiles = function (portDetail: PortDetail) {
    const portCalls = portDetail.portCalls.filter((pc) => !pc.isOmitted);
    const durations = portCalls.map((pc) => pc.departure.getTime() - pc.arrival.getTime());
    if (durations.length === 0) return null;
    return {
        p_05: stats.percentile(durations, 0.05),
        p_20: stats.percentile(durations, 0.2),
        p_50: stats.percentile(durations, 0.5),
        p_75: stats.percentile(durations, 0.75),
        p_90: stats.percentile(durations, 0.9),
    };
};

export const humanizeTimedelta = function (ms: number) {
    return humanizeDuration(ms, {units: ['y', 'mo', 'w', 'd', 'h', 'm'], round: true});
};

export const evalExtremeValues = function (ports: Map<string, PortDetail>, limit: number) {
    const e = new Set(Array.from(ports).map(([_, portDetail]) => getPortCallsLength(portDetail)));
    const top = [...e].sort((a, b) => b - a).slice(0, limit);
    const bottom = [...e].sort((a, b) => a - b).slice(0, limit);
    return {top, bottom};
};
