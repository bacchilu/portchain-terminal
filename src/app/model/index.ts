import {Schedule, Vessel} from '../types';
import {getSchedules, getVessels} from './model';

export const FetchManager = (function () {
    return {
        fetchSchedules: async function (vessels: Vessel[], cb: (v: Vessel) => void) {
            const res = [] as Schedule[];
            for (let vessel of vessels) {
                cb(vessel);
                const schedule = await getSchedules(vessel.imo);
                res.push(schedule);
            }
            return res;
        },
        getVessels: getVessels,
    };
})();
