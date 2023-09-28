import {FetchManager} from '.';
import {Port, PortCall, Vessel} from '../types';
import {getSchedules, getVessels} from './model';
import {data as mockVessels} from './vessels.mock';

jest.mock('./model', () => {
    const originalModule = jest.requireActual('.');
    return {
        ...originalModule,
        getVessels: jest.fn(),
        getSchedules: jest.fn(),
    };
});

describe('getVessels', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('returns expected data', async () => {
        (getVessels as jest.Mock).mockReturnValue(mockVessels);

        const vessels = await FetchManager.getVessels();
        expect(vessels).toHaveLength(mockVessels.length);
    });

    test('handles failure', async () => {
        (getVessels as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));

        await expect(FetchManager.getVessels()).rejects.toThrow('Failed to fetch');
    });
});

describe('fetchSchedules', () => {
    const mockVessels = [
        {imo: 9303807, name: 'ABIDJAN EXPRESS'} as Vessel,
        {imo: 9303807, name: 'ABIDJAN EXPRESS'} as Vessel,
        {imo: 9303807, name: 'ABIDJAN EXPRESS'} as Vessel,
    ];

    const mockSchedules = [
        {
            arrival: new Date('2019-01-12T03:42:00+00:00'),
            departure: new Date('2019-01-12T20:48:00+00:00'),
            isOmitted: false,
            port: {id: 'BEANR', name: 'Antwerpen'} as Port,
        } as PortCall,
        {
            arrival: new Date('2019-01-14T05:18:00+00:00'),
            departure: new Date('2019-01-14T18:00:00+00:00'),
            isOmitted: false,
            port: {id: 'DEHAM', name: 'Hamburg'} as Port,
        } as PortCall,
    ];

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('returns expected data', async () => {
        (getSchedules as jest.Mock).mockReturnValue(mockSchedules);

        const schedules = await FetchManager.fetchSchedules(mockVessels, () => {});
        expect(schedules).toHaveLength(mockVessels.length);
        expect(schedules[0]).toHaveLength(mockSchedules.length);
    });

    test('handles failure', async () => {
        (getSchedules as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));

        await expect(FetchManager.fetchSchedules(mockVessels, () => {})).rejects.toThrow('Failed to fetch');
    });
});
