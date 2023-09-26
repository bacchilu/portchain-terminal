import ora from 'ora';

export const Spinner = function (firstMessage: string) {
    const spinner = ora(firstMessage).start();

    return {
        setMessage: function (message: string) {
            spinner.color = 'yellow';
            spinner.text = message;
        },
        stop: function () {
            spinner.stop();
        },
    };
};
