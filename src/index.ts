import {FetchManager} from './app/model';
import {Spinner} from './app/spinner';
import {toTable} from './app/table';
import {Vessel} from './app/types';

const fetchData = async function () {
    const spinner = Spinner('Loading vessels');
    try {
        const vessels = await FetchManager.getVessels();
        return await FetchManager.fetchSchedules(vessels, (vessel: Vessel) => {
            spinner.setMessage(`Loading schedules... (${vessel.name})`);
        });
    } finally {
        spinner.stop();
    }
};

const app = async function () {
    try {
        const schedules = await fetchData();
        console.log(toTable(schedules));
    } catch (e) {
        console.log(e);
    }
};

app();
