import {PortDetail} from '../types';

export const mockPortDetail = {
    name: 'Norfolk',
    portCalls: [
        {
            arrival: new Date('2019-04-21 09:42:00'),
            departure: new Date('2019-04-22 10:48:00'),
            isOmitted: false,
        },
        {
            arrival: new Date('2019-01-06 12:00:00'),
            departure: new Date('2019-01-07 17:00:00'),
            isOmitted: true,
        },
        {
            arrival: new Date('2019-01-25 07:00:00'),
            departure: new Date('2019-01-26 22:36:00'),
            isOmitted: false,
        },
        {
            arrival: new Date('2019-02-03 12:00:00'),
            departure: new Date('2019-02-04 17:00:00'),
            isOmitted: true,
        },
        {
            arrival: new Date('2019-03-03 12:00:00'),
            departure: new Date('2019-03-04 17:00:00'),
            isOmitted: true,
        },
        {
            arrival: new Date('2019-04-14 17:48:00'),
            departure: new Date('2019-04-16 04:48:00'),
            isOmitted: false,
        },
        {
            arrival: new Date('2019-04-21 11:00:00'),
            departure: new Date('2019-04-22 16:00:00'),
            isOmitted: true,
        },
    ],
} as PortDetail;
