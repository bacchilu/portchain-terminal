import {PortDetail} from '../types';
import {mockPortDetail} from './port_detail_mock';
import {portsMapMock} from './port_map_mock';
import {mockSchedules} from './schedules_mock';
import {evalExtremeValues, evalPercentiles, getPortCallsLength, getPortsDetails} from './utils';

describe('getPortCallsLength', () => {
    test('Returns the correct length of non-omitted port calls', () => {
        const length = getPortCallsLength(mockPortDetail);
        expect(length).toBe(3);
    });
});

describe('getPortsDetails', () => {
    test('Returns ports details as a Map', () => {
        const portsMap = getPortsDetails(mockSchedules);
        expect(portsMap.size).toBe(3);
        expect(portsMap.get('BEANR')).toBeDefined();
        expect(portsMap.get('MACAS')).toBeDefined();
        expect(portsMap.get('ITSAL')).toBeDefined();
    });
});

describe('evalExtremeValues', () => {
    test('Returns top and bottom values', () => {
        const limit = 2;
        const {top, bottom} = evalExtremeValues(portsMapMock, limit);
        expect(top).toEqual([4, 3]);
        expect(bottom).toEqual([1, 3]);
    });
});

describe('evalPercentiles Function', () => {
    const emptyPortDetail = {
        name: 'TEST',
        portCalls: [
            {arrival: new Date(2023, 0, 1, 8, 0, 0), departure: new Date(2023, 0, 1, 12, 0, 0), isOmitted: true},
        ],
    } as PortDetail;

    const mockPortDetail = {
        name: 'Antwerpen',
        portCalls: [
            {arrival: new Date(2019, 0, 12, 3, 43, 0), departure: new Date(2019, 0, 12, 20, 48, 0), isOmitted: false},
            {arrival: new Date(2019, 2, 13, 15, 12, 0), departure: new Date(2019, 2, 15, 9, 6, 0), isOmitted: false},
            {arrival: new Date(2019, 4, 22, 6, 0, 0), departure: new Date(2019, 4, 23, 11, 0, 0), isOmitted: false},
        ],
    } as PortDetail;

    test('Returns null when there are no valid port calls', () => {
        const result = evalPercentiles(emptyPortDetail);
        expect(result).toBeNull();
    });

    test('Returns null when there are no port calls', () => {
        const result = evalPercentiles({name: 'TEST', portCalls: []} as PortDetail);
        expect(result).toBeNull();
    });

    test('Calculates percentiles correctly when valid port calls are available', () => {
        const result = evalPercentiles(mockPortDetail);

        expect(result).toEqual({
            p_05: 46485000,
            p_20: 65790000,
            p_50: 104400000,
            p_75: 139230000,
            p_90: 150840000,
        });
    });
});
