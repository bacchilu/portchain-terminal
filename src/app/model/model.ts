import axios, {AxiosError} from 'axios';

import {Port, PortCall, Schedule, Vessel} from '../types';

export interface ScheduleReturned {
    portCalls: {
        port: Port;
        arrival: string;
        departure: string;
        isOmitted: boolean;
    }[];
}

const parseSchedule = function (item: ScheduleReturned) {
    return item.portCalls.map(
        (pc) =>
            ({
                port: pc.port,
                arrival: new Date(pc.arrival),
                departure: new Date(pc.departure),
                isOmitted: pc.isOmitted,
            } as PortCall)
    ) as Schedule;
};

export const getVessels = async function () {
    try {
        const res = await axios.get<Vessel[]>('https://import-coding-challenge-api.portchain.com/api/v2/vessels');
        return res.data;
    } catch (error) {
        throw (error as AxiosError).message;
    }
};

export const getSchedules = async function (imo: number) {
    try {
        const res = await axios.get<Schedule>(
            `https://import-coding-challenge-api.portchain.com/api/v2/schedule/${imo}`,
            {
                transformResponse: [
                    (data: string) => {
                        const parsedData = JSON.parse(data) as ScheduleReturned;
                        return parseSchedule(parsedData);
                    },
                ],
            }
        );
        return res.data;
    } catch (error) {
        throw (error as AxiosError).message;
    }
};
